import apiClient from './client';

export function listCategories(departmentId) {
  return apiClient
    .get('/categories', { params: departmentId ? { department_id: departmentId } : {} })
    .then((res) => res.data);
}

export function createCategory(data) {
  return apiClient.post('/categories', data).then((res) => res.data);
}

export function updateCategory(id, data) {
  return apiClient.patch(`/categories/${id}`, data).then((res) => res.data);
}

export function deleteCategory(id) {
  return apiClient.delete(`/categories/${id}`);
}
