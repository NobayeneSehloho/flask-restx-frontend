import api from './api';

export const courseService = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getStudents: (id) => api.get(`/courses/${id}/students`),
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getCourses: (id) => api.get(`/students/${id}/courses`),
};

export const departmentService = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  getCourses: (id) => api.get(`/departments/${id}/courses`),
};

export const teacherService = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  getCourses: (id) => api.get(`/teachers/${id}/courses`),
};

export const enrolmentService = {
  getAll: () => api.get('/enrolments'),
  getById: (id) => api.get(`/enrolments/${id}`),
  create: (data) => api.post('/enrolments', data),
  delete: (id) => api.delete(`/enrolments/${id}`),
};

export const studentEnrolmentService = {
  getAll: () => api.get('/student-enrolments'),
  getById: (id) => api.get(`/student-enrolments/${id}`),
  create: (data) => api.post('/student-enrolments', data),
  delete: (id) => api.delete(`/student-enrolments/${id}`),
};
