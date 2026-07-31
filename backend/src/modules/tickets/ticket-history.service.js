const ticketEventModel = require('../../models/ticket-event.model');

function recordStatusChange(ticketId, authorId, oldStatus, newStatus) {
  return ticketEventModel.create({
    ticket_id: ticketId,
    author_id: authorId,
    event_type: 'status_change',
    old_status: oldStatus,
    new_status: newStatus,
  });
}

function recordAssignmentChange(ticketId, authorId, oldAgentId, newAgentId) {
  return ticketEventModel.create({
    ticket_id: ticketId,
    author_id: authorId,
    event_type: 'assignment_change',
    old_agent_id: oldAgentId,
    new_agent_id: newAgentId,
  });
}

function recordComment(ticketId, authorId, commentBody, isInternal) {
  return ticketEventModel.create({
    ticket_id: ticketId,
    author_id: authorId,
    event_type: 'comment',
    comment_body: commentBody,
    is_internal: isInternal,
  });
}

function listForTicket(ticketId, { includeInternal }) {
  return ticketEventModel.listByTicket(ticketId, { includeInternal });
}

module.exports = {
  recordStatusChange,
  recordAssignmentChange,
  recordComment,
  listForTicket,
};
