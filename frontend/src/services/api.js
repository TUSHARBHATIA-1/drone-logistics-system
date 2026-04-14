import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
  withCredentials: true
});

// Attach JWT token to every outgoing request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] ▶ ${req.method?.toUpperCase()} ${req.baseURL}${req.url} — token ✅`);
  } else {
    console.warn(`[API] ▶ ${req.method?.toUpperCase()} ${req.baseURL}${req.url} — token ❌ missing`);
  }
  return req;
});

// Handle responses — auto-logout on 401
API.interceptors.response.use(
  (res) => {
    console.log(`[API] ◀ ${res.status} ${res.config?.url}`, res.data);
    return res;
  },
  (error) => {
    if (error.response) {
      console.error(`[API] ◀ ${error.response.status} ${error.config?.url}`, error.response.data);
      if (error.response.status === 401) {
        console.warn('[API] 401 Unauthorized — clearing session and redirecting to /login');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
      }
    } else {
      console.error('[API] Network error — no response received:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;