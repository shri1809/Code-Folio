import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard that checks if user is authenticated and possesses one of the allowed roles
 * @param {Array<string>} allowedRoles - Defaults to ['user', 'admin']
 */
export const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-mono">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md p-6 bg-slate-900 border border-red-500/30 rounded-xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-4">
            You do not possess the required permissions to view this resource.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Return to Safety
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

