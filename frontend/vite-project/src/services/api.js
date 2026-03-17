import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Multipart FormData helper — photo field ni har doim qo'shadi (bo'sh bo'lsa ham)
// Bu backend da req.file?.filename crash ini oldini oladi
const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      fd.append(key, val);
    }
  });
  return fd;
};

const multipartConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

// AUTH
export const authAPI = {
  login: (data) => api.post('/auth/login/admin', data),
};

// USERS (xodimlar)
export const staffAPI = {
  getAll:  ()         => api.get('/users'),
  getById: (id)       => api.get(`/users/${id}`),
  create:  (data)     => api.post('/users', toFormData(data), multipartConfig),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id)       => api.delete(`/users/${id}`),
};

// TEACHERS
export const teacherAPI = {
  getAll:  ()         => api.get('/teachers/all'),
  getById: (id)       => api.get(`/teachers/${id}`),
  create:  (data)     => api.post('/teachers', toFormData(data), multipartConfig),
  update:  (id, data) => api.put(`/teachers/${id}`, data),
  delete:  (id)       => api.delete(`/teachers/${id}`),
};

// STUDENTS
export const studentAPI = {
  getAll:  ()         => api.get('/students/all'),
  getById: (id)       => api.get(`/students/${id}`),
  create:  (data)     => api.post('/students', toFormData(data), multipartConfig),
  update:  (id, data) => api.put(`/students/${id}`, data),
  delete:  (id)       => api.delete(`/students/${id}`),
};

// STUDENT-GROUP
export const studentGroupAPI = {
  create: (data)     => api.post('/student-group', data),
  update: (id, data) => api.put(`/student-group/${id}`, data),
  delete: (id)       => api.delete(`/student-group/${id}`),
};

// GROUPS
export const groupAPI = {
  getAll:      ()         => api.get('/groups/all'),
  getById:     (id)       => api.get(`/groups/${id}`),
  create:      (data)     => api.post('/groups', data),
  update:      (id, data) => api.put(`/groups/${id}`, data),
  delete:      (id)       => api.delete(`/groups/${id}`),
  getStudents: (groupId)  => api.get(`/groups/students/${groupId}`),
  getLessons:  (groupId)  => api.get(`/groups/lesson/${groupId}`),
};

// COURSES
export const courseAPI = {
  getAll:  ()         => api.get('/course/all'),
  getById: (id)       => api.get(`/course/${id}`),
  create:  (data)     => api.post('/course', data),
  update:  (id, data) => api.put(`/course/${id}`, data),
  delete:  (id)       => api.delete(`/course/${id}`),
};

// ROOMS
export const roomAPI = {
  getAll:  ()         => api.get('/rooms/all'),
  getById: (id)       => api.get(`/rooms/${id}`),
  create:  (data)     => api.post('/rooms', data),
  update:  (id, data) => api.put(`/rooms/${id}`, data),
  delete:  (id)       => api.delete(`/rooms/${id}`),
};

// LESSONS
export const lessonAPI = {
  getByGroup: (groupId)  => api.get(`/lessons/${groupId}`),
  create:     (data)     => api.post('/lessons', data),
  update:     (id, data) => api.put(`/lessons/${id}`, data),
  delete:     (id)       => api.delete(`/lessons/${id}`),
};

// HOMEWORK
export const homeworkAPI = {
  getByGroup: (groupId)  => api.get(`/homework/group/${groupId}`),
  getById:    (id)       => api.get(`/homework/${id}`),
  create:     (data)     => api.post('/homework', toFormData(data), multipartConfig),
  update:     (id, data) => api.put(`/homework/${id}`, data),
  delete:     (id)       => api.delete(`/homework/${id}`),
};

// LESSON VIDEO
export const videoAPI = {
  getByGroup: (groupId)  => api.get(`/lesson-video/${groupId}`),
  create:     (data)     => api.post('/lesson-video', toFormData(data), multipartConfig),
  delete:     (id)       => api.delete(`/lesson-video/${id}`),
};

// ATTENDANCE
export const attendanceAPI = {
  getByLesson: (lessonId) => api.get(`/attendance/${lessonId}`),
  create:      (data)     => api.post('/attendance', data),
};

export default api;