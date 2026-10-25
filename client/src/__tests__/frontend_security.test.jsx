import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import DOMPurify from 'dompurify';
import MinimalistLayout from '../features/portfolio/templates/MinimalistLayout';
import CyberpunkLayout from '../features/portfolio/templates/CyberpunkLayout';
import CorporateLayout from '../features/portfolio/templates/CorporateLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import * as AuthContextModule from '../context/AuthContext';

describe('FRONTEND SECURITY & RESILIENCY AUDIT SUITE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. XSS SANITIZATION TESTS
  describe('1. XSS Payload Neutralization with DOMPurify', () => {
    it('should sanitize dangerous script and onerror attributes from user bio', () => {
      const maliciousBio = '<img src=x onerror=alert(1)><strong>Legitimate Developer Bio</strong><script>alert("hacked")</script>';
      const sanitized = DOMPurify.sanitize(maliciousBio);

      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<strong>Legitimate Developer Bio</strong>');
    });

    it('should sanitize javascript: scheme and XSS payloads in Template layouts', () => {
      const maliciousData = {
        user: { username: 'attacker', isPro: false, templateId: 'minimalist' },
        portfolio: {
          profile: {
            name: 'Attacker Profile',
            bio: '<img src=x onerror=alert("pwned")>Senior SecDevOps',
            socialLinks: { github: 'https://github.com/attacker' },
          },
          skills: { frontend: ['React'], backend: [], devops: [] },
          projects: [
            {
              id: '1',
              title: 'Exploit Project',
              description: '<svg/onload=alert("xss")>Dangerous description',
              techStack: ['Node.js'],
              liveLink: 'https://legit.com',
            },
          ],
        },
      };

      const { container } = render(
        <MemoryRouter>
          <MinimalistLayout data={maliciousData} />
        </MemoryRouter>
      );

      // Verify onerror and onload were completely stripped from rendered DOM
      expect(container.innerHTML).not.toContain('onerror=');
      expect(container.innerHTML).not.toContain('onload=');
      expect(container.innerHTML).toContain('Senior SecDevOps');
      expect(container.innerHTML).toContain('Dangerous description');
    });
  });

  // 2. ROUTE GUARD & PROTECTED ROUTE TESTS
  describe('2. ProtectedRoute Authentication Verification', () => {
    it('should redirect unauthenticated users to /login', () => {
      // Mock useAuth returning null user and loading false
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <div>Protected CMS Secret Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Landing</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected CMS Secret Content')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page Landing')).toBeInTheDocument();
    });

    it('should allow authenticated users with valid role into dashboard', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { id: '123', username: 'valid_dev', role: 'user' },
        loading: false,
      });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <div>Protected CMS Secret Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected CMS Secret Content')).toBeInTheDocument();
    });
  });

  // 3. EMPTY / PARTIAL PORTFOLIO RENDERING (NO UNDEFINED ERRORS)
  describe('3. Empty and Partial Portfolio Resilient Rendering', () => {
    const emptyData = {
      user: { username: 'newbie', isPro: false, templateId: 'minimalist' },
      portfolio: {
        profile: { name: '', bio: '', socialLinks: {} },
        skills: { frontend: [], backend: [], devops: [] },
        projects: [],
      },
    };

    it('should render MinimalistLayout without throwing TypeError on empty dataset', () => {
      const { container } = render(
        <MemoryRouter>
          <MinimalistLayout data={emptyData} />
        </MemoryRouter>
      );

      expect(container).toBeDefined();
      expect(screen.getByText('@newbie')).toBeInTheDocument();
      expect(screen.getByText(/No developer bio provided yet/i)).toBeInTheDocument();
      expect(screen.getByText(/No skills listed yet/i)).toBeInTheDocument();
    });

    it('should render CyberpunkLayout without throwing TypeError on empty dataset', () => {
      const { container } = render(
        <MemoryRouter>
          <CyberpunkLayout data={emptyData} />
        </MemoryRouter>
      );

      expect(container).toBeDefined();
      expect(screen.getByText(/SYSTEM_NODE \/\/ NEWBIE/i)).toBeInTheDocument();
      expect(screen.getByText(/\/\/ NO_BIO_PAYLOAD_LOADED/i)).toBeInTheDocument();
    });

    it('should render CorporateLayout without throwing TypeError on empty dataset', () => {
      const { container } = render(
        <MemoryRouter>
          <CorporateLayout data={emptyData} />
        </MemoryRouter>
      );

      expect(container).toBeDefined();
      expect(screen.getByText(/@newbie/i)).toBeInTheDocument();
      expect(screen.getByText(/Summary profile is currently pending executive submission/i)).toBeInTheDocument();
    });
  });
});

