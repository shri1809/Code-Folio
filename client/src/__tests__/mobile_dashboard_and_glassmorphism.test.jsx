import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { GlassmorphismLayout } from '../features/portfolio/templates/styles/GlassmorphismLayout';
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

describe('STEP 2: MOBILE DASHBOARD & GLASSMORPHISM PREVIEW TESTS', () => {
  const mockUser = {
    _id: 'user123',
    username: 'alexrivera',
    email: 'alex@example.com',
    role: 'user',
    isPro: true,
    templateId: 'fullstack-developer--glassmorphism',
  };

  const mockPortfolio = {
    profile: {
      name: 'Alex Rivera',
      bio: 'Full-stack builder shipping scalable SaaS products from zero to production.',
      socialLinks: { github: 'https://github.com/alex', linkedin: 'https://linkedin.com/in/alex' },
      resumeUrl: 'https://alex.dev/resume.pdf',
    },
    skills: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express', 'PostgreSQL'],
      devops: ['Docker', 'AWS'],
    },
    projects: [
      {
        title: 'Habit Forge',
        description: 'Gamified habit tracking web and mobile app with streak analytics.',
        techStack: ['React Native', 'Node.js', 'PostgreSQL'],
        repoLink: 'https://github.com/alex/habit-forge',
        liveLink: 'https://habitforge.app',
        screenshot: 'https://invalid-broken-domain-999.xyz/broken-habit-forge.png', // Simulated broken image
      },
      {
        title: 'CloudMetric Telemetry',
        description: 'Real-time telemetry aggregator with WebSocket streaming.',
        techStack: ['React', 'Node.js', 'Docker'],
        repoLink: 'https://github.com/alex/cloudmetric',
        liveLink: 'https://cloudmetric.dev',
        screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      },
    ],
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
            portfolio: mockPortfolio,
            user: mockUser,
          },
        });
      }
      return Promise.resolve({ data: { success: true } });
    });
  });

  describe('Task 1: Mobile Dashboard Edit / Preview Switching & State Preservation', () => {
    it('renders the accessible segmented control with Edit and Preview tabs', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @alexrivera/i)).toBeInTheDocument();
      });

      const editTab = screen.getByRole('tab', { name: /edit/i });
      const previewTab = screen.getByRole('tab', { name: /preview/i });

      expect(editTab).toBeInTheDocument();
      expect(previewTab).toBeInTheDocument();

      // Defaults to Edit mode
      expect(editTab).toHaveAttribute('aria-selected', 'true');
      expect(previewTab).toHaveAttribute('aria-selected', 'false');
    });

    it('toggles between Edit and Preview modes without losing unsaved form input', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @alexrivera/i)).toBeInTheDocument();
      });

      // Navigate to Profile tab and enter new bio text
      const profileTab = screen.getByRole('button', { name: /profile/i });
      fireEvent.click(profileTab);

      const bioInput = screen.getByPlaceholderText(/Senior Full-Stack Engineer/i);
      expect(bioInput).toBeInTheDocument();
      fireEvent.change(bioInput, { target: { value: 'Newly modified unsaved bio text for mobile test' } });
      expect(bioInput.value).toBe('Newly modified unsaved bio text for mobile test');

      // Switch to Mobile Preview mode
      const previewSegmentTab = screen.getByRole('tab', { name: /preview/i });
      fireEvent.click(previewSegmentTab);

      expect(previewSegmentTab).toHaveAttribute('aria-selected', 'true');

      // The live preview pane should be visible
      const editorPanel = screen.getByRole('region', { name: /edit/i });
      const previewPanel = screen.getByRole('region', { name: /preview/i });
      expect(editorPanel).toHaveClass('hidden lg:flex');
      expect(previewPanel).toHaveClass('flex');

      // Switch back to Edit mode
      const editSegmentTab = screen.getByRole('tab', { name: /edit/i });
      fireEvent.click(editSegmentTab);

      expect(editSegmentTab).toHaveAttribute('aria-selected', 'true');
      expect(editorPanel).toHaveClass('flex');

      // CRITICAL: Unsaved form input must STILL be present without being reset
      expect(bioInput.value).toBe('Newly modified unsaved bio text for mobile test');
    });

    it('keeps Save Portfolio accessible in both Edit and Preview modes', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save portfolio/i })).toBeInTheDocument();
      });

      // In Edit mode
      expect(screen.getByRole('button', { name: /save portfolio/i })).toBeVisible();

      // Switch to Preview mode
      fireEvent.click(screen.getByRole('tab', { name: /preview/i }));

      // In Preview mode, Save Portfolio remains accessible in top toolbar
      expect(screen.getByRole('button', { name: /save portfolio/i })).toBeVisible();
    });

    it('preserves preview device toggle (desktop vs mobile) across view mode switches', async () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/BUILDER \/\/ @alexrivera/i)).toBeInTheDocument();
      });

      // Switch to Preview
      fireEvent.click(screen.getByRole('tab', { name: /preview/i }));

      // Select Mobile Device Preview
      const mobileDeviceBtn = screen.getByTitle(/mobile view/i);
      fireEvent.click(mobileDeviceBtn);
      expect(mobileDeviceBtn).toHaveClass('bg-[#0c1df2]');

      // Switch to Edit mode and back to Preview mode
      fireEvent.click(screen.getByRole('tab', { name: /edit/i }));
      fireEvent.click(screen.getByRole('tab', { name: /preview/i }));

      // Device selection is preserved
      expect(screen.getByTitle(/mobile view/i)).toHaveClass('bg-[#0c1df2]');
    });
  });

  describe('Task 2: Glassmorphism Mobile Portfolio Preview & Image Fallback', () => {
    const roleConfig = {
      id: 'fullstack-developer',
      title: 'Full-Stack Developer',
      category: 'tech-product',
    };

    it('renders responsive mobile profile header with buttons wrapped below developer name', () => {
      const { container } = render(
        <GlassmorphismLayout
          data={{ user: mockUser, portfolio: mockPortfolio }}
          roleConfig={roleConfig}
          isMobilePreview={true}
        />
      );

      // Heading has responsive text size rather than oversized 5xl
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Alex Rivera');
      expect(heading).toHaveClass('text-2xl');

      // Contact action buttons are rendered and accessible
      expect(screen.getByRole('button', { name: /initiate contact/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /cv \/ resume/i })).toBeInTheDocument();

      // Social links are rendered
      expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
      expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    });

    it('renders ImageWithFallback for broken project images like Habit Forge', async () => {
      render(
        <GlassmorphismLayout
          data={{ user: mockUser, portfolio: mockPortfolio }}
          roleConfig={roleConfig}
          isMobilePreview={true}
        />
      );

      // Project title is rendered
      expect(screen.getByText('Habit Forge')).toBeInTheDocument();

      // Find the image element for Habit Forge
      const images = screen.getAllByRole('img');
      const habitForgeImg = images.find((img) => img.getAttribute('alt') === 'Habit Forge');
      expect(habitForgeImg).toBeInTheDocument();

      // Simulate image load error on the broken URL
      fireEvent.error(habitForgeImg);

      // Upon error, ImageWithFallback gracefully renders fallback title and placeholder
      await waitFor(() => {
        expect(screen.getByTestId('fallback-placeholder')).toBeInTheDocument();
        expect(screen.getByText('Preview Unavailable')).toBeInTheDocument();
      });
    });

    it('maintains 1-column project grid in mobile preview mode', () => {
      const { container } = render(
        <GlassmorphismLayout
          data={{ user: mockUser, portfolio: mockPortfolio }}
          roleConfig={roleConfig}
          isMobilePreview={true}
        />
      );

      // Projects container must be 1 column grid in mobile preview
      const projectGrid = container.querySelector('.grid.grid-cols-1');
      expect(projectGrid).toBeInTheDocument();
      expect(projectGrid).not.toHaveClass('md:grid-cols-2');
    });
  });
});
