import apiClient from './client';

export function listDepartments() {
  return apiClient.get('/departments').then((res) => res.data);
}

export function createDepartment(data) {
  return apiClient.post('/departments', data).then((res) => res.data);
}

export function updateDepartment(id, data) {
  return apiClient.patch(`/departments/${id}`, data).then((res) => res.data);
}

export function deleteDepartment(id) {
  return apiClient.delete(`/departments/${id}`);
}
