import apiClient from './client';

export function fetchSummary() {
  return apiClient.get('/dashboard/summary').then((res) => res.data);
}

export function fetchByCategory() {
  return apiClient.get('/dashboard/by-category').then((res) => res.data);
}

export function fetchByDepartment() {
  return apiClient.get('/dashboard/by-department').then((res) => res.data);
}

export function fetchAvgResolutionTime() {
  return apiClient.get('/dashboard/avg-resolution-time').then((res) => res.data);
}
