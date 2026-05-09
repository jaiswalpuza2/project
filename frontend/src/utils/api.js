import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 45000, // 45s timeout to accommodate slower AI responses (NVIDIA)
});

// Request Interceptor: Add Token to Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out. Please check your internet connection.');
    }
    
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized if token is expired
      if (localStorage.getItem('token')) {
        // localStorage.removeItem('token');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
