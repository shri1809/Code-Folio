import axios from 'axios';

let cachedCsrfToken = null;

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch CSRF token from the server
export const fetchCsrfToken = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/csrf-token`, { withCredentials: true });
    if (res.data && res.data.csrfToken) {
      cachedCsrfToken = res.data.csrfToken;
      return cachedCsrfToken;
    }
  } catch (err) {
    console.warn('[CSRF] Could not fetch CSRF token:', err.message);
  }
  return null;
};

// Request interceptor: attach CSRF token to state-changing requests
apiClient.interceptors.request.use(async (config) => {
  const method = (config.method || '').toLowerCase();
  const stateChangingMethods = ['post', 'put', 'delete', 'patch'];

  if (stateChangingMethods.includes(method)) {
    if (!cachedCsrfToken) {
      await fetchCsrfToken();
    }
    if (cachedCsrfToken) {
      config.headers['x-csrf-token'] = cachedCsrfToken;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: auto-retry with fresh CSRF token if EBADCSRFTOKEN happens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.code === 'CSRF_INVALID' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await fetchCsrfToken();
      if (newToken) {
        originalRequest.headers['x-csrf-token'] = newToken;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

