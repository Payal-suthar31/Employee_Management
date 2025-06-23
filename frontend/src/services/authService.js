import axios from 'axios';

const API_URL = 'http://localhost:5181/api';

// Create a separate axios instance for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  login: async (email, password) => {
    try {
      console.log('Making login request to:', `${API_URL}/Account/login`);
      const response = await authAxios.post('/Account/login', {
        email,
        password,
      });
      
      console.log('Raw login response:', response);
      const { token, role } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      // Store the token with the 'Bearer ' prefix and ensure role is lowercase
      const normalizedRole = role?.toLowerCase() || 'employee';
      const tokenWithPrefix = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      localStorage.setItem('token', tokenWithPrefix);
      localStorage.setItem('userRole', normalizedRole);
      
      return {
        ...response.data,
        role: normalizedRole,
        token: tokenWithPrefix,
      };
    } catch (error) {
      console.error('Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await authAxios.post('/Account/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getCurrentUser: () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (!token) {
        return null;
      }

      return {
        token,
        role: userRole?.toLowerCase() || 'employee',
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Helper method to check if the token is valid
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Check if token is properly formatted
    return token.startsWith('Bearer ') && token.length > 10;
  },
};

export default authService; 