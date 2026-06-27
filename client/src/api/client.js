import axios from 'axios';
import { message } from 'ant-design-vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'auth_token';
const USER_KEY = import.meta.env.VITE_USER_KEY || 'auth_user';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = getErrorMessage(error);
    
    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      message.error(errorMessage);
    }
    
    // Handle 401 - unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      message.warning('Session expired. Please login again.');
      window.location.href = '/login';
    }
    
    // Handle 403 - forbidden
    if (error.response?.status === 403) {
      message.error('You do not have permission to perform this action.');
    }
    
    // Handle 404 - not found
    if (error.response?.status === 404) {
      message.error('Resource not found.');
    }
    
    // Handle 500 - server error
    if (error.response?.status === 500) {
      message.error('Server error. Please try again later.');
    }
    
    // Handle network errors
    if (!error.response) {
      message.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to extract error message
function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Health check API
export const healthAPI = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
export { TOKEN_KEY, USER_KEY };
