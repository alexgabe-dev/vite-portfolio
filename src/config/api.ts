const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5173/api'
  : 'https://www.vizitor.hu/api';

export const API_ENDPOINTS = {
  SEND_EMAIL: `${API_BASE_URL}/send-email`
}; 