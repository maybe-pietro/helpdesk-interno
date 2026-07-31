import apiClient from './client';

export function login(email, password) {
  return apiClient.post('/auth/login', { email, password }).then((res) => res.data);
}

export function fetchMe() {
  return apiClient.get('/auth/me').then((res) => res.data);
}

export function changePassword(currentPassword, newPassword) {
  return apiClient.post('/auth/change-password', { currentPassword, newPassword }).then((res) => res.data);
}
