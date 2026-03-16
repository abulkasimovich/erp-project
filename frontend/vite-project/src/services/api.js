// src/services/api.js
// ============================================================
// ALL backend requests go through here.
// Base URL: http://localhost:3000
// JWT token is read from localStorage and sent as Bearer token.
// ============================================================

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token automatically ──────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: if 401, logout ────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ════════════════════════════════════════
// AUTH
// ════════════════════════════════════════
export const authAPI = {
  // POST /auth/login  →  { token, user }
  login: (data) => api.post('/auth/login', data),
  // GET  /auth/me     →  current user
  me: () => api.get('/auth/me'),
};

// ════════════════════════════════════════
// GURUHLAR (Groups)
// ════════════════════════════════════════
export const groupAPI = {
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  create: (data) => api.post('/groups', data),
  update: (id, data) => api.put(`/groups/${id}`, data),
  delete: (id) => api.delete(`/groups/${id}`),
  toggleStatus: (id) => api.patch(`/groups/${id}/toggle`),
  // Stats: total groups, teachers, students
  getStats: () => api.get('/groups/stats'),
};

// ════════════════════════════════════════
// O'QITUVCHILAR (Teachers)
// ════════════════════════════════════════
export const teacherAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
};

// ════════════════════════════════════════
// TALABALAR (Students)
// ════════════════════════════════════════
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// ════════════════════════════════════════
// XODIMLAR (Staff / Employees)
// ════════════════════════════════════════
export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// ════════════════════════════════════════
// XONALAR (Rooms)
// ════════════════════════════════════════
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

// ════════════════════════════════════════
// KURSLAR (Courses)
// ════════════════════════════════════════
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories'),
};

// ════════════════════════════════════════
// UYGA VAZIFA (Homework)
// ════════════════════════════════════════
export const homeworkAPI = {
  getByGroup: (groupId) => api.get(`/groups/${groupId}/homeworks`),
  getById: (id) => api.get(`/homeworks/${id}`),
  create: (groupId, data) => api.post(`/groups/${groupId}/homeworks`, data),
  update: (id, data) => api.put(`/homeworks/${id}`, data),
  delete: (id) => api.delete(`/homeworks/${id}`),
};

// ════════════════════════════════════════
// VIDEOLAR (Videos / Lessons)
// ════════════════════════════════════════
export const videoAPI = {
  getByGroup: (groupId) => api.get(`/groups/${groupId}/videos`),
  create: (groupId, data) => api.post(`/groups/${groupId}/videos`, data),
  delete: (id) => api.delete(`/videos/${id}`),
};

// ════════════════════════════════════════
// DARSLAR (Lessons inside group)
// ════════════════════════════════════════
export const lessonAPI = {
  getByGroup: (groupId) => api.get(`/groups/${groupId}/lessons`),
  create: (groupId, data) => api.post(`/groups/${groupId}/lessons`, data),
};

export default api;
