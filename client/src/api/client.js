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

// Fetch CSRF token from the server with auto-retry for cold starts
export const fetchCsrfToken = async (retryCount = 0) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/auth/csrf-token`, { withCredentials: true });
    if (res.data && res.data.csrfToken) {
      cachedCsrfToken = res.data.csrfToken;
      return cachedCsrfToken;
    }
  } catch (err) {
    if ((err.response?.status === 502 || err.response?.status === 504 || !err.response) && retryCount < 2) {
      await new Promise((r) => setTimeout(r, 2000));
      return fetchCsrfToken(retryCount + 1);
    }
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

// Response interceptor: auto-retry with fresh CSRF token if EBADCSRFTOKEN happens,
// and auto-retry on 502/504 gateway cold start delays
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Auto-retry on Render cold starts (Vercel 502/504 Bad Gateway / Gateway Timeout)
    if (
      (error.response?.status === 502 ||
        error.response?.status === 503 ||
        error.response?.status === 504 ||
        (!error.response && error.code === 'ERR_NETWORK')) &&
      (!originalRequest._coldStartRetryCount || originalRequest._coldStartRetryCount < 2)
    ) {
      originalRequest._coldStartRetryCount = (originalRequest._coldStartRetryCount || 0) + 1;
      await new Promise((r) => setTimeout(r, 2500));
      if (!cachedCsrfToken) {
        await fetchCsrfToken();
      }
      if (cachedCsrfToken) {
        originalRequest.headers['x-csrf-token'] = cachedCsrfToken;
      }
      return apiClient(originalRequest);
    }

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

