const ticketModel = require('../../models/ticket.model');
const attachmentModel = require('../../models/ticket-attachment.model');
const ticketsService = require('../tickets/tickets.service');
const httpError = require('../../utils/httpError');
const storage = require('./storage.local');

async function getTicketOrThrow(id) {
  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  return ticket;
}

async function addAttachment(user, ticketId, file) {
  if (!file) {
    throw httpError(422, 'No file uploaded');
  }
  const ticket = await getTicketOrThrow(ticketId);
  ticketsService.assertCanView(user, ticket);

  return attachmentModel.create({
    ticket_id: ticketId,
    uploaded_by: user.id,
    original_name: file.originalname,
    stored_filename: file.filename,
    mime_type: file.mimetype,
    size_bytes: file.size,
  });
}

async function getForDownload(user, attachmentId) {
  const attachment = await attachmentModel.findById(attachmentId);
  if (!attachment) {
    throw httpError(404, 'Attachment not found');
  }
  const ticket = await getTicketOrThrow(attachment.ticket_id);
  ticketsService.assertCanView(user, ticket);

  return { attachment, stream: storage.getFileStream(ticket.id, attachment.stored_filename) };
}

async function remove(user, attachmentId) {
  const attachment = await attachmentModel.findById(attachmentId);
  if (!attachment) {
    throw httpError(404, 'Attachment not found');
  }
  if (attachment.uploaded_by !== user.id && user.role !== 'admin') {
    throw httpError(403, 'Not allowed to delete this attachment');
  }

  await storage.deleteFile(attachment.ticket_id, attachment.stored_filename);
  await attachmentModel.remove(attachmentId);
}

module.exports = { addAttachment, getForDownload, remove };
