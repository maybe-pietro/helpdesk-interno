const ticketModel = require('../../models/ticket.model');
const categoryModel = require('../../models/category.model');
const userModel = require('../../models/user.model');
const attachmentModel = require('../../models/ticket-attachment.model');
const httpError = require('../../utils/httpError');
const ticketHistory = require('./ticket-history.service');
const notifications = require('../notifications/notifications.service');

const STATUS_TRANSITIONS = {
  aberto: ['em_andamento'],
  em_andamento: ['aguardando_solicitante', 'resolvido'],
  aguardando_solicitante: ['em_andamento', 'resolvido'],
  resolvido: ['fechado', 'em_andamento'],
  fechado: ['em_andamento'],
};

function scopeFiltersForUser(user, filters) {
  if (user.role === 'solicitante') {
    return { ...filters, requesterId: user.id };
  }
  if (user.role === 'agente') {
    // Agents see their department's queue plus anything already assigned to them.
    // Scoping to exactly one of the two is done via departmentId unless the
    // caller explicitly asks for "assigned to me".
    if (filters.assignedAgentId === 'me') {
      return { ...filters, assignedAgentId: user.id };
    }
    return { ...filters, departmentId: filters.departmentId || user.department_id };
  }
  return filters; // admin: unrestricted
}

async function list(user, filters, pagination) {
  const scoped = scopeFiltersForUser(user, filters);
  return ticketModel.list(scoped, pagination);
}

async function getById(user, id) {
  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  assertCanView(user, ticket);
  const attachments = await attachmentModel.listByTicket(id);
  return { ...ticket, attachments };
}

function assertCanView(user, ticket) {
  if (user.role === 'admin') return;
  if (user.role === 'solicitante' && ticket.requester_id === user.id) return;
  if (user.role === 'agente' && (ticket.department_id === user.department_id || ticket.assigned_agent_id === user.id)) return;
  throw httpError(403, 'Not allowed to view this ticket');
}

async function create(user, data) {
  const category = await categoryModel.findById(data.category_id);
  if (!category) {
    throw httpError(422, 'Invalid category_id');
  }

  let requesterId = user.id;
  if (data.requester_id && data.requester_id !== user.id) {
    if (user.role === 'solicitante') {
      throw httpError(403, 'Cannot open a ticket on behalf of another user');
    }
    const requester = await userModel.findById(data.requester_id);
    if (!requester) {
      throw httpError(422, 'Invalid requester_id');
    }
    requesterId = requester.id;
  }

  const ticket = await ticketModel.create({
    title: data.title,
    description: data.description,
    priority: data.priority || 'media',
    category_id: category.id,
    department_id: category.department_id,
    requester_id: requesterId,
    status: 'aberto',
  });

  notifications.notifyTicketCreated(ticket).catch((err) => console.error('[notifications]', err));

  return ticket;
}

async function update(user, id, data) {
  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  assertCanView(user, ticket);

  const isRequesterEditingOwn = user.role === 'solicitante' && ticket.requester_id === user.id;
  if (isRequesterEditingOwn && ticket.status !== 'aberto') {
    throw httpError(409, 'Ticket can only be edited by the requester while status is "aberto"');
  }
  if (user.role === 'solicitante' && !isRequesterEditingOwn) {
    throw httpError(403, 'Not allowed to edit this ticket');
  }

  const patch = {
    title: data.title ?? ticket.title,
    description: data.description ?? ticket.description,
    priority: data.priority ?? ticket.priority,
  };

  if (data.category_id && data.category_id !== ticket.category_id) {
    const category = await categoryModel.findById(data.category_id);
    if (!category) {
      throw httpError(422, 'Invalid category_id');
    }
    patch.category_id = category.id;
    patch.department_id = category.department_id;
  }

  return ticketModel.update(id, patch);
}

async function changeStatus(user, id, newStatus) {
  if (user.role === 'solicitante') {
    throw httpError(403, 'Only agents or admins can change ticket status');
  }

  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  assertCanView(user, ticket);

  const allowed = STATUS_TRANSITIONS[ticket.status] || [];
  if (!allowed.includes(newStatus)) {
    throw httpError(422, `Cannot transition from "${ticket.status}" to "${newStatus}"`);
  }

  const patch = { status: newStatus };
  if (newStatus === 'resolvido') patch.resolved_at = new Date();
  if (newStatus === 'fechado') patch.closed_at = new Date();
  // Reopening clears the timestamps from the previous resolution cycle so
  // metrics (e.g. avg resolution time) don't count a ticket that's active again.
  if (newStatus === 'em_andamento' || newStatus === 'aguardando_solicitante') {
    patch.resolved_at = null;
    patch.closed_at = null;
  }

  const updated = await ticketModel.update(id, patch);
  await ticketHistory.recordStatusChange(id, user.id, ticket.status, newStatus);
  notifications.notifyStatusChanged(updated, ticket.status, newStatus).catch((err) => console.error('[notifications]', err));
  return updated;
}

async function assign(user, id, agentId) {
  if (user.role === 'solicitante') {
    throw httpError(403, 'Only agents or admins can assign tickets');
  }

  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  assertCanView(user, ticket);

  const agent = await userModel.findById(agentId);
  if (!agent || agent.role !== 'agente' || !agent.is_active) {
    throw httpError(422, 'Invalid agent');
  }

  if (user.role === 'agente' && agentId !== user.id) {
    throw httpError(403, 'Agents can only self-assign tickets');
  }
  if (user.role === 'agente' && ticket.department_id !== user.department_id) {
    throw httpError(403, 'Agent does not belong to this ticket\'s department');
  }

  const previousAgentId = ticket.assigned_agent_id;
  const updated = await ticketModel.update(id, { assigned_agent_id: agentId });
  await ticketHistory.recordAssignmentChange(id, user.id, previousAgentId, agentId);
  notifications.notifyAssigned(updated, agentId).catch((err) => console.error('[notifications]', err));
  return updated;
}

module.exports = { list, getById, create, update, changeStatus, assign, assertCanView };
