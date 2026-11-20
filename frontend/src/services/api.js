import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'Network communication error';
    return Promise.reject(new Error(errorMsg));
  }
);

export const api = {
  analyzeOffer: (payload) => apiClient.post('/analyze', payload),
  getAnalyses: (params) => apiClient.get('/analyses', { params }),
  getAnalysisById: (id) => apiClient.get(`/analyses/${id}`),
  deleteAnalysis: (id) => apiClient.delete(`/analyses/${id}`),
  getDashboardStats: () => apiClient.get('/stats'),
  verifyCompany: (payload) => apiClient.post('/verify-company', payload),
  getHealth: () => apiClient.get('/health'),
};
