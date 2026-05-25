import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Enables cookie storage across origins
});

// Response interceptor to handle unauthorized access globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
      if (!isAuthPage) {
        // Clear all state by reloading and redirecting to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
