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

api.interceptors.response.use(
  (response) => {
    // Check if there's a new token in the response headers (assuming the token is returned in the response)
    const newToken = response.headers['x-access-token']; // Or use any other header field that your backend uses for tokens
   
    if (newToken) {
      // Update localStorage with the new token
      localStorage.setItem('token', newToken);               
    }
    return response;
  },
  (error) => {
    // Handle errors if needed (e.g., for expired tokens)
    return Promise.reject(error);
  }
);

export default api;