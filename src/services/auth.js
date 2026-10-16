import api from './api';

export const authService = {
  login: async (email, password) => {
    // Login lives at /auth/login on the backend, which is OUTSIDE the /api
    // base used by the shared axios instance. Override baseURL to '/' for this
    // one call so the request resolves to /auth/login (served via the /auth
    // proxy in nginx and in the Vite dev server).
    const response = await api.post('/auth/login', { email, password }, { baseURL: '/' });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
