import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export const trafficAPI = {
  getLogs: (params) => api.get('/traffic/logs', { params }),
  getState: () => api.get('/traffic/state'),
  simulateNormal: (data) => api.post('/traffic/normal', data),
  simulateAttack: (data) => api.post('/traffic/attack', data),
  stop: () => api.post('/traffic/stop'),
  getRateLimit: () => api.get('/traffic/rate-limit'),
  clearLogs: () => api.delete('/traffic/logs'),
};

export const detectionAPI = {
  getStatus: () => api.get('/detection/status'),
  analyze: (data) => api.post('/detection/analyze', data),
};

export const protectionAPI = {
  getBlockedIps: () => api.get('/protection/blocked-ips'),
  blockIp: (data) => api.post('/protection/block-ip', data),
  unblockIp: (ip) => api.delete(`/protection/block-ip/${ip}`),
  getFirewallRules: () => api.get('/protection/firewall'),
  addFirewallRule: (data) => api.post('/protection/firewall', data),
  deleteFirewallRule: (id) => api.delete(`/protection/firewall/${id}`),
  verifyCaptcha: (data) => api.post('/protection/captcha', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export const analyticsAPI = {
  getData: () => api.get('/analytics'),
};

export const reportsAPI = {
  getData: () => api.get('/reports/data'),
  getCsv: () => api.get('/reports/csv', { responseType: 'blob' }),
  getNotifications: () => api.get('/reports/notifications'),
  markRead: (id) => api.patch(`/reports/notifications/${id}/read`),
  clearNotifications: () => api.delete('/reports/notifications'),
};

export default api;
