import apiClient from './client';

export function listTickets(filters = {}) {
  return apiClient.get('/tickets', { params: filters }).then((res) => res.data);
}

export function getTicket(id) {
  return apiClient.get(`/tickets/${id}`).then((res) => res.data);
}

export function createTicket(data) {
  return apiClient.post('/tickets', data).then((res) => res.data);
}

export function updateTicket(id, data) {
  return apiClient.patch(`/tickets/${id}`, data).then((res) => res.data);
}

export function changeTicketStatus(id, status) {
  return apiClient.patch(`/tickets/${id}/status`, { status }).then((res) => res.data);
}

export function assignTicket(id, agentId) {
  return apiClient.patch(`/tickets/${id}/assign`, { agent_id: agentId }).then((res) => res.data);
}

export function listTicketEvents(id) {
  return apiClient.get(`/tickets/${id}/events`).then((res) => res.data);
}

export function addTicketComment(id, body, isInternal) {
  return apiClient.post(`/tickets/${id}/comments`, { body, is_internal: isInternal }).then((res) => res.data);
}

export function uploadAttachment(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient
    .post(`/tickets/${id}/attachments`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
}

export async function downloadAttachment(attachmentId, filename) {
  const response = await apiClient.get(`/attachments/${attachmentId}/download`, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export function deleteAttachment(attachmentId) {
  return apiClient.delete(`/attachments/${attachmentId}`);
}
