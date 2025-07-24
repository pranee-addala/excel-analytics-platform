
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Excel Data API
export const excelAPI = {
  uploadExcel: async (formData: FormData) => {
    const response = await api.post('/excel/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getExcelData: async (recordId: string) => {
    const response = await api.get(`/excel/${recordId}`);
    return response.data;
  },
  
  getAllExcelRecords: async () => {
    const response = await api.get('/excel');
    return response.data;
  }
};

// Chart API
export const chartAPI = {
  saveChart: async (chartData: any) => {
    const response = await api.post('/charts/save', chartData);
    return response.data;
  },
  
  getCharts: async () => {
    const response = await api.get('/charts');
    return response.data;
  },
  
  deleteChart: async (chartId: string) => {
    const response = await api.delete(`/charts/${chartId}`);
    return response.data;
  }
};

export default api;
