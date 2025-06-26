import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5181/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure token has 'Bearer ' prefix
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // console.log('API Response:', {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data,
    // });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and redirect to login on authentication/authorization errors
      authService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Employee endpoints
const employeeApi = {
  getAllEmployees: () => api.get('/Employees/all'),
  createEmployee: (data) => api.post('/Employees', data),
  getMyProfile: () => api.get('/Employees/me'),
  updateMyProfile: (data) => api.put('/Employees/me', data),
  updateEmployee: (id, data) => api.put(`/Employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/Employees/${id}`),
};

// Report endpoints
const reportApi = {
  createReport: (data) => api.post('/Report', data),
  getAllReports: () => api.get('/Report'),
  getMyReports: () => api.get('/Report/my'),
  updateReportStatus: (id, status) => api.put(`/Report/${id}/status`, { Status: status }),
  getDocument: (id) => api.get(`/Report/${id}/document`),
  deleteReport: (id) => api.delete(`/Report/${id}`),
};

export { employeeApi, reportApi };
export default api;
