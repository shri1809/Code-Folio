import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { fetchCsrfToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mfaState, setMfaState] = useState(null); // { email, required: true }

  const checkAuth = useCallback(async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial CSRF and authentication check
    fetchCsrfToken();
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.mfaRequired) {
      setMfaState({ email, required: true });
      return { mfaRequired: true, email };
    }
    if (res.data?.success && res.data.user) {
      setUser(res.data.user);
      setMfaState(null);
      return { success: true, user: res.data.user };
    }
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    if (res.data?.success && res.data.user) {
      setUser(res.data.user);
      setMfaState(null);
      return { success: true, user: res.data.user };
    }
    return res.data;
  };

  const requestOtp = async (email) => {
    const res = await apiClient.post('/auth/request-otp', { email });
    return res.data;
  };

  const register = async (username, email, password, name = '') => {
    const payload = { username, email, password };
    if (name) payload.name = name;
    const res = await apiClient.post('/auth/register', payload);
    if (res.data?.success && res.data.user && res.data.requiresOtp === false) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
    if (res.data?.success && res.data.user) {
      setUser(res.data.user);
      setMfaState(null);
      return { success: true, user: res.data.user, message: res.data.message };
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('[Logout Error]:', err.message);
    } finally {
      setUser(null);
      setMfaState(null);
    }
  };

  const updateUserLocal = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        mfaState,
        setMfaState,
        login,
        register,
        verifyOtp,
        requestOtp,
        resetPassword,
        logout,
        checkAuth,
        updateUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

