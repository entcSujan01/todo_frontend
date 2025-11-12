// src/api/client.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 20000,
});

// Critical: Let browser set Content-Type for FormData
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

export default client;