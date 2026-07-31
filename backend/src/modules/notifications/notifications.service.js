const mailer = require('../../config/mailer');
const env = require('../../config/env');
const userModel = require('../../models/user.model');
const templates = require('./templates');

function send(to, { subject, html }) {
  if (!to) return Promise.resolve();
  return mailer.sendMail({ from: env.smtp.from, to, subject, html }).catch((err) => {
    console.error('[notifications] failed to send email:', err.message);
  });
}

async function notifyTicketCreated(ticket) {
  const requester = await userModel.findById(ticket.requester_id);
  const agents = await userModel.list({ role: 'agente', departmentId: ticket.department_id });
  const { subject, html } = templates.ticketCreated(ticket);

  await Promise.all([
    send(requester?.email, { subject, html }),
    ...agents.map((agent) => send(agent.email, { subject, html })),
  ]);
}

async function notifyNewComment(ticket, authorId, isInternal) {
  if (isInternal) return; // internal notes are not sent to the requester
  const author = await userModel.findById(authorId);
  const { subject, html } = templates.newComment(ticket, author?.name || 'Alguem');

  // Notify "the other side" of the conversation.
  const recipientId = authorId === ticket.requester_id ? ticket.assigned_agent_id : ticket.requester_id;
  if (!recipientId) return;
  const recipient = await userModel.findById(recipientId);
  await send(recipient?.email, { subject, html });
}

async function notifyStatusChanged(ticket, oldStatus, newStatus) {
  const requester = await userModel.findById(ticket.requester_id);
  const { subject, html } = templates.statusChanged(ticket, oldStatus, newStatus);
  await send(requester?.email, { subject, html });
}

async function notifyAssigned(ticket, agentId) {
  const agent = await userModel.findById(agentId);
  const { subject, html } = templates.assigned(ticket);
  await send(agent?.email, { subject, html });
}

module.exports = { notifyTicketCreated, notifyNewComment, notifyStatusChanged, notifyAssigned };
