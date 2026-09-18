import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:3000/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pv_token');
      localStorage.removeItem('pv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
