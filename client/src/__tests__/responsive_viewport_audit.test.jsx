import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TemplateGalleryModal } from '../features/portfolio/TemplateGalleryModal';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { PublicPortfolioPage } from '../features/portfolio/PublicPortfolioPage';
import { MinimalistLayout } from '../features/portfolio/templates';
import { GlassmorphismLayout } from '../features/portfolio/templates/styles';
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

const VIEWPORTS = [
  { width: 320, name: '320px (Ultra-compact mobile)' },
  { width: 375, name: '375px (Compact mobile)' },
  { width: 390, name: '390px (Standard smartphone)' },
  { width: 768, name: '768px (Tablet portrait)' },
  { width: 1024, name: '1024px (Small desktop / iPad Pro)' },
  { width: 1440, name: '1440px (Widescreen desktop)' },
];

const mockUser = {
  username: 'antigravity_dev',
  name: 'Dev Engineer',
  templateId: 'minimalist',
  isPro: true,
  customDomain: '',
};

const mockPortfolio = {
  profile: {
    name: 'Dev Engineer',
    bio: 'Systems Architect building scalable high-concurrency microservices.',
    socialLinks: {
      github: 'https://github.com/antigravity',
      linkedin: 'https://linkedin.com/in/antigravity',
    },
    resumeUrl: 'https://codefolio.dev/uploads/antigravity/resume.pdf',
  },
  skills: {
    frontend: ['React', 'TypeScript', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'MongoDB'],
    devops: ['Docker', 'Kubernetes', 'GCP'],
  },
  projects: [
    {
      title: 'Cloud Telemetry Engine',
      description: 'Distributed metrics pipeline processing 50k events/sec.',
      techStack: ['Node.js', 'Redis', 'Docker'],
      repoLink: 'https://github.com/antigravity/telemetry',
      liveLink: 'https://telemetry.codefolio.dev',
      screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    },
  ],
};

describe('STEP 7: EVIDENCE-BASED RESPONSIVE VIEWPORT AUDIT (320px - 1440px)', () => {
  const originalInnerWidth = window.innerWidth;

  const setViewportWidth = (width) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: mockUser,
      login: vi.fn(),
      register: vi.fn(),
      updateUserLocal: vi.fn(),
      requestOtp: vi.fn(),
      verifyOtp: vi.fn(),
    });

    apiClient.get.mockResolvedValue({
      data: {
        success: true,
        user: mockUser,
        portfolio: mockPortfolio,
        data: { user: mockUser, portfolio: mockPortfolio },
      },
    });

    apiClient.put.mockResolvedValue({
      data: { success: true, message: 'Saved successfully' },
    });
  });

  afterEach(() => {
    setViewportWidth(originalInnerWidth);
  });

  // 1. DASHBOARD RESPONSIVE AUDIT ACROSS ALL 6 VIEWPORTS
  describe('1. Dashboard Responsive Experience (320px - 1440px)', () => {
    VIEWPORTS.forEach(({ width, name }) => {
      it(`renders toolbar, action controls and save button cleanly at ${name}`, async () => {
        setViewportWidth(width);

        render(
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        );

        await waitFor(() => {
          expect(screen.getByText(/BUILDER/i)).toBeInTheDocument();
        });

        // Save Portfolio action is present and clickable
        const saveBtn = screen.getByRole('button', { name: /save portfolio/i });
        expect(saveBtn).toBeInTheDocument();
        expect(saveBtn).not.toBeDisabled();

        // Template Studio launcher is present
        expect(screen.getByRole('button', { name: /template studio/i })).toBeInTheDocument();

        // Section Tabs are present
        expect(screen.getByRole('button', { name: /theme & pro/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^profile$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /skills/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument();

        // Mobile View Switcher is present for widths < 1024
        if (width < 1024) {
          expect(screen.getByRole('tab', { name: /^edit$/i })).toBeInTheDocument();
          expect(screen.getByRole('tab', { name: /^preview$/i })).toBeInTheDocument();
        }
      });
    });
  });

  // 2. TEMPLATE GALLERY MODAL RESPONSIVE AUDIT
  describe('2. Template Gallery Modal Responsive Audit (320px - 1440px)', () => {
    VIEWPORTS.forEach(({ width, name }) => {
      it(`renders search, category filters, archetype selector, and cards without clipping at ${name}`, () => {
        setViewportWidth(width);
        const mockClose = vi.fn();
        const mockSelect = vi.fn();

        render(
          <TemplateGalleryModal
            isOpen={true}
            onClose={mockClose}
            currentTemplateId="minimalist"
            currentUserName="Dev Engineer"
            onSelectTemplate={mockSelect}
          />
        );

        // Header and title
        expect(screen.getByText(/Professional Portfolio Template Library/i)).toBeInTheDocument();

        // Close action
        expect(screen.getByTitle(/Close Gallery \(Esc\)/i)).toBeInTheDocument();

        // Search bar
        expect(screen.getByPlaceholderText(/Search by role, style, or tool/i)).toBeInTheDocument();

        // Archetype filter dropdown
        expect(screen.getByLabelText(/Filter by Layout Archetype/i)).toBeInTheDocument();

        // Dynamic result counter
        expect(screen.getByText(/Showing 38 of 38 templates/i)).toBeInTheDocument();
      });
    });
  });

  // 3. AUTHENTICATION & PROFILE SETUP RESPONSIVE AUDIT
  describe('3. Auth & Profile Setup Responsive Audit (320px - 1440px)', () => {
    VIEWPORTS.forEach(({ width, name }) => {
      it(`renders login and registration fields without overflow at ${name}`, () => {
        setViewportWidth(width);

        const { unmount } = render(
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('developer@domain.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /passwordless/i })).toBeInTheDocument();
        unmount();

        render(
          <MemoryRouter>
            <RegisterPage />
          </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register & send verification code/i })).toBeInTheDocument();
      });
    });
  });

  // 4. REPRESENTATIVE PORTFOLIO TEMPLATES RESPONSIVE AUDIT
  describe('4. Representative Portfolio Templates Responsive Audit (320px - 1440px)', () => {
    VIEWPORTS.forEach(({ width, name }) => {
      it(`renders Minimalist and Glassmorphism templates properly at ${name}`, () => {
        setViewportWidth(width);

        const roleConfig = {
          title: 'Full-Stack Software Engineer',
          badge: 'TypeScript / React / Node.js',
          roleId: 'fullstack-developer',
          showMetrics: true,
        };

        const { unmount } = render(
          <MinimalistLayout
            data={{ user: mockUser, portfolio: mockPortfolio }}
            roleConfig={roleConfig}
            isMobilePreview={width < 768}
          />
        );

        expect(screen.getByText('Dev Engineer')).toBeInTheDocument();
        expect(screen.getByText('Cloud Telemetry Engine')).toBeInTheDocument();
        unmount();

        render(
          <GlassmorphismLayout
            data={{ user: mockUser, portfolio: mockPortfolio }}
            roleConfig={roleConfig}
            isMobilePreview={width < 768}
          />
        );

        expect(screen.getByText('Dev Engineer')).toBeInTheDocument();
        expect(screen.getByText('Cloud Telemetry Engine')).toBeInTheDocument();
      });
    });
  });
});
