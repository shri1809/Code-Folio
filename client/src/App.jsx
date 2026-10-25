import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import MainLayout, { RouteLoadingFallback } from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './features/home/HomePage';

// Route-based code splitting for secondary and workspace views
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const PublicPortfolioPage = lazy(() => import('./features/portfolio/PublicPortfolioPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const RoleShowcasePage = lazy(() => import('./features/portfolio/RoleShowcasePage'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Main website layout with global Navbar and Footer */}
            <Route element={<MainLayout />}>
              {/* Public Marketing & Auth */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Role Showcase & Template Gallery Deep Links */}
              <Route path="/showcase/:roleId" element={<RoleShowcasePage />} />
              <Route path="/templates/:roleId" element={<RoleShowcasePage />} />

              {/* Protected Profile Setup (First-time onboarding & profile upload) */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Settings Page */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Public Portfolio Vanity Routes */}
              <Route path="/u/:username" element={<PublicPortfolioPage />} />
              <Route path="/user/:username" element={<PublicPortfolioPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Standalone Dashboard Route: uses its own studio toolbar without global Navbar/Footer */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
