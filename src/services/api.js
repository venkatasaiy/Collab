import axios from 'axios';

// Django REST API Base URL
const API_URL = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request interceptor to attach Auth Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend isn't connected, we silently fallback to mock local handling in context
    console.warn('API Endpoint unreachable or returned error:', error.message);
    return Promise.reject(error);
  }
);

// Helper API functions structured for Django REST API compatibility
export const bookService = {
  getAll: () => api.get('/books/'),
  getById: (id) => api.get(`/books/${id}/`),
  create: (data) => api.post('/books/', data),
  update: (id, data) => api.put(`/books/${id}/`, data),
  delete: (id) => api.delete(`/books/${id}/`),
};

export const borrowerService = {
  getAll: () => api.get('/borrowers/'),
  getById: (id) => api.get(`/borrowers/${id}/`),
  create: (data) => api.post('/borrowers/', data),
  update: (id, data) => api.put(`/borrowers/${id}/`, data),
  delete: (id) => api.delete(`/borrowers/${id}/`),
};

export const issueService = {
  getAll: () => api.get('/issued-books/'),
  issue: (data) => api.post('/issued-books/', data),
  returnBook: (id) => api.post(`/issued-books/${id}/return/`),
};

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
};

export default api;
