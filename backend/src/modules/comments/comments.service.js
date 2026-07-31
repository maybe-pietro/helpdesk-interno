const ticketModel = require('../../models/ticket.model');
const ticketsService = require('../tickets/tickets.service');
const ticketHistory = require('../tickets/ticket-history.service');
const notifications = require('../notifications/notifications.service');
const httpError = require('../../utils/httpError');

async function getTicketOrThrow(id) {
  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  return ticket;
}

async function listEvents(user, ticketId) {
  const ticket = await getTicketOrThrow(ticketId);
  ticketsService.assertCanView(user, ticket);

  const includeInternal = user.role !== 'solicitante';
  return ticketHistory.listForTicket(ticketId, { includeInternal });
}

async function addComment(user, ticketId, body, isInternal) {
  const ticket = await getTicketOrThrow(ticketId);
  ticketsService.assertCanView(user, ticket);

  const effectiveIsInternal = user.role !== 'solicitante' && Boolean(isInternal);
  const event = await ticketHistory.recordComment(ticketId, user.id, body, effectiveIsInternal);

  notifications
    .notifyNewComment(ticket, user.id, effectiveIsInternal)
    .catch((err) => console.error('[notifications]', err));

  return event;
}

module.exports = { listEvents, addComment };
