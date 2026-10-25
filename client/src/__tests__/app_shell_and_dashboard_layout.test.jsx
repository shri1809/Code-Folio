import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import App from '../App';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import apiClient from '../api/client';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock API Client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  fetchCsrfToken: vi.fn().mockResolvedValue('mock-csrf-token'),
}));

describe('STEP 1: APPLICATION SHELL & DASHBOARD VIEWPORT LAYOUT TESTS', () => {
  const mockUser = {
    _id: 'user123',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'user',
    isPro: true,
    templateId: 'minimalist',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockUser,
      loading: false,
      logout: vi.fn(),
      updateUserLocal: vi.fn(),
    });

    apiClient.get.mockImplementation((url) => {
      if (url === '/portfolio') {
        return Promise.resolve({
          data: {
            success: true,
            portfolio: {
              profile: {
                name: 'John Doe',
                bio: 'Fullstack Architect',
                socialLinks: { github: 'https://github.com/johndoe' },
                resumeUrl: '',
              },
              skills: { frontend: ['React'], backend: ['Node.js'], devops: ['Docker'] },
              projects: [],
            },
            user: mockUser,
          },
        });
      }
      return Promise.resolve({ data: { success: true } });
    });
  });

  describe('Task 1: Application Shell Route-Appropriate Layouts', () => {
    it('renders global Navbar and Footer on home page (/)', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Global Navbar (header banner)
      const navbar = screen.getByRole('banner');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveTextContent('Minimalist Demo');
      expect(navbar).toHaveTextContent('Cyberpunk Pro');

      // Global Footer (contentinfo)
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent(/Hardened MERN Architecture/i);
    });

    it('renders global Navbar and Footer on settings page (/settings)', async () => {
      render(
        <MemoryRouter initialEntries={['/settings']}>
          <App />
        </MemoryRouter>
      );

      // Global Navbar (header banner)
      const navbar = screen.getByRole('banner');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveTextContent('Minimalist Demo');

      // Global Footer (contentinfo)
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent(/Hardened MERN Architecture/i);
    });

    it('renders studio toolbar but HIDES global Navbar and Footer on /dashboard', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      );

      // Wait for dashboard to mount
      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @johndoe/i)).toBeInTheDocument();
      });

      // Studio Action Toolbar controls are present
      expect(screen.getByRole('button', { name: /save portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /template studio/i })).toBeInTheDocument();

      // Global Navbar demo links MUST NOT be present on /dashboard
      expect(screen.queryByText('Minimalist Demo')).not.toBeInTheDocument();
      expect(screen.queryByText('Cyberpunk Pro')).not.toBeInTheDocument();

      // Global Footer MUST NOT be present on /dashboard
      expect(screen.queryByText(/Hardened MERN Architecture/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    });
  });

  describe('Task 2: Dashboard Viewport and Independent Scroll Structure', () => {
    it('occupies viewport with h-screen, max-h-screen, and overflow-hidden root container', async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @johndoe/i)).toBeInTheDocument();
      });

      // Root element must enforce viewport locking
      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveClass('h-screen');
      expect(rootDiv).toHaveClass('max-h-screen');
      expect(rootDiv).toHaveClass('overflow-hidden');
    });

    it('provides home link in studio toolbar for easy navigation back to main site', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTitle(/Back to CodeFolio Home/i)).toBeInTheDocument();
      });

      const homeLink = screen.getByTitle(/Back to CodeFolio Home/i);
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('configures independent scroll containers without hardcoded 100vh-4rem overflows', async () => {
      const { container } = render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @johndoe/i)).toBeInTheDocument();
      });

      // Left pane (Editor)
      const leftPane = container.querySelector('.lg\\:col-span-5');
      expect(leftPane).toBeInTheDocument();
      expect(leftPane).toHaveClass('overflow-y-auto');
      expect(leftPane).toHaveClass('lg:h-full');
      expect(leftPane).not.toHaveClass('h-[calc(100vh-4rem)]');

      // Right pane (Live Preview)
      const rightPane = container.querySelector('.lg\\:col-span-7');
      expect(rightPane).toBeInTheDocument();
      expect(rightPane).toHaveClass('lg:h-full');
      expect(rightPane).not.toHaveClass('h-[calc(100vh-4rem)]');

      // Right pane inner preview container has its own independent vertical scroll
      const previewScrollBox = rightPane.querySelector('.overflow-y-auto');
      expect(previewScrollBox).toBeInTheDocument();
      expect(previewScrollBox).toHaveClass('flex-1');
    });
  });
});
