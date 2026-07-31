import apiClient from './client';

export function listUsers(filters = {}) {
  return apiClient.get('/users', { params: filters }).then((res) => res.data);
}

export function createUser(data) {
  return apiClient.post('/users', data).then((res) => res.data);
}

export function updateUser(id, data) {
  return apiClient.patch(`/users/${id}`, data).then((res) => res.data);
}

export function deleteUser(id) {
  return apiClient.delete(`/users/${id}`);
}
