// Centralized API configuration for ServiceDesk Pro
// Connects to deployed backend on Render (https://service-desk-backend-0wy7.onrender.com)
// or respects environment variables / local development proxy

const resolveApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const cleanUrl = envUrl.trim().replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // In local development mode without explicit VITE_API_URL, use Vite proxy /api
  if (import.meta.env.DEV) {
    return '/api';
  }

  // Production default fallback pointing to deployed Render backend
  return 'https://service-desk-backend-0wy7.onrender.com/api';
};

export const API_BASE = resolveApiBase();

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('servicedesk_token');
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};
