import axios from 'axios';

// Configure your backend base URL (adjust the port as needed)
// In api.js
const API_BASE_URL = import.meta.env.VITE_API_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Login method
  // In src/services/api.js, update the login method:
async login(username, password) {
  try {
    const response = await api.post('/auth/login', {
      name: username,
      password: password,
    });
    
    // Store the token from the response
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      
      // Store user info if provided in response
      if (response.data.name) {
        localStorage.setItem('user_name', response.data.name);
      }
      if (response.data.role) {
        localStorage.setItem('user_role', response.data.role);
      }
      
      // If not provided in response, decode from token
      if (!response.data.name || !response.data.role) {
        try {
          const token = response.data.access_token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          if (payload.name && !localStorage.getItem('user_name')) {
            localStorage.setItem('user_name', payload.name);
          }
          if (payload.role && !localStorage.getItem('user_role')) {
            localStorage.setItem('user_role', payload.role);
          }
        } catch (e) {
          console.error('Error decoding token:', e);
        }
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
},

  // Logout method
  logout() {
    localStorage.removeItem('access_token');
    // Redirect to login page
    window.location.href = '/login';
  },

  // Method to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};

export default api;