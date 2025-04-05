import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // change to your actual backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token automatically to headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;