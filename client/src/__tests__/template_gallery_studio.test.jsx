import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as AuthContextModule from '../context/AuthContext';
import { TemplateGalleryModal } from '../features/portfolio/TemplateGalleryModal';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import apiClient from '../api/client';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock API client
vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
  fetchCsrfToken: vi.fn().mockResolvedValue('mock-csrf-token'),
}));

describe('CANVA / WIX / ADOBE PORTFOLIO TEMPLATE GALLERY STUDIO TESTS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. TemplateGalleryModal Component Isolation', () => {
    it('should not render anything when isOpen is false', () => {
      const { container } = render(
        <TemplateGalleryModal
          isOpen={false}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render header, search bar, category tabs, and template cards when isOpen is true', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      // Verify header and badge
      expect(screen.getByText(/Canva & Wix Inspired Studio/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional Portfolio Template Library/i)).toBeInTheDocument();
      expect(screen.getByText(/38 Industry Layouts/i)).toBeInTheDocument();

      // Verify search input
      expect(
        screen.getByPlaceholderText(/Search by role, style, or tool/i)
      ).toBeInTheDocument();

      // Verify category tabs
      expect(screen.getByRole('button', { name: /All Categories/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tech & Digital Product/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Visual & Creative Arts/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Media & Lifestyle/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Writing & Strategy/i })).toBeInTheDocument();
    });

    it('should filter templates when category tab is clicked', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      // Filter by Visual & Creative Arts
      const visualTab = screen.getByRole('button', { name: /Visual & Creative Arts/i });
      fireEvent.click(visualTab);

      // Should display Graphic Designer and Concept Artist & Illustrator
      expect(screen.getByText(/Graphic Designer/i)).toBeInTheDocument();
      expect(screen.getByText(/Concept Artist & Illustrator/i)).toBeInTheDocument();

      // Should NOT display purely backend engineering roles like Backend Software Engineer
      expect(screen.queryByText(/Backend Software Engineer/i)).not.toBeInTheDocument();
    });

    it('should filter templates based on search input', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search by role, style, or tool/i);
      fireEvent.change(searchInput, { target: { value: 'Kubernetes' } });

      // DevOps Engineer should match strategy/badge/title
      expect(screen.getByText(/DevOps & Cloud Infrastructure Engineer/i)).toBeInTheDocument();
      // Unrelated role should be filtered out
      expect(screen.queryByText(/Fashion Model/i)).not.toBeInTheDocument();
    });

    it('should open interactive fullscreen live preview modal and toggle device viewport', () => {
      const mockSelect = vi.fn();
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={mockSelect}
        />
      );

      // Click "Interactive Preview" on the first visible card
      const previewButtons = screen.getAllByRole('button', { name: /Interactive Preview/i });
      expect(previewButtons.length).toBeGreaterThan(0);
      fireEvent.click(previewButtons[0]);

      // Sub-modal should be visible with Desktop / Mobile viewport controls
      expect(screen.getByText(/Back to Templates/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mobile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Desktop/i })).toBeInTheDocument();

      // Click Mobile Viewport
      const mobileBtn = screen.getByRole('button', { name: /Mobile/i });
      fireEvent.click(mobileBtn);

      // Click "Use This Template" button inside the preview modal
      const useTemplateBtn = screen.getByRole('button', { name: /Use This Template/i });
      fireEvent.click(useTemplateBtn);

      expect(mockSelect).toHaveBeenCalled();
    });

    it('should trigger onSelectTemplate when "Apply" button is clicked on a card', () => {
      const mockSelect = vi.fn();
      const mockClose = vi.fn();
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={mockClose}
          currentTemplateId="minimalist"
          onSelectTemplate={mockSelect}
        />
      );

      const applyButtons = screen.getAllByRole('button', { name: /Apply/i });
      expect(applyButtons.length).toBeGreaterThan(0);
      fireEvent.click(applyButtons[0]);

      expect(mockSelect).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });

    it('should calculate and display dynamic result count and reset filters when clicked', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      // Initial count: Showing 38 of 38 templates
      expect(screen.getByText(/Showing.*38.*of.*38 templates/i)).toBeInTheDocument();

      // Filter by category
      const techTab = screen.getByRole('button', { name: /Tech & Digital Product/i });
      fireEvent.click(techTab);

      // Count changes dynamically
      expect(screen.getByText(/Showing.*10.*of.*38 templates/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset all/i })).toBeInTheDocument();

      // Click "Reset all"
      fireEvent.click(screen.getByRole('button', { name: /Reset all/i }));
      expect(screen.getByText(/Showing.*38.*of.*38 templates/i)).toBeInTheDocument();
    });

    it('should display empty state with Reset Filters action when no templates match search', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Search by role, style, or tool/i);
      fireEvent.change(searchInput, { target: { value: 'NonexistentRole12345xyz' } });

      expect(screen.getByText(/No templates found/i)).toBeInTheDocument();
      expect(screen.getByText(/No templates matched "NonexistentRole12345xyz"/i)).toBeInTheDocument();

      // Click "Reset Filters" in empty state
      const resetBtn = screen.getByRole('button', { name: /Reset Filters/i });
      expect(resetBtn).toBeInTheDocument();
      fireEvent.click(resetBtn);

      expect(screen.queryByText(/No templates found/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Showing.*38.*of.*38 templates/i)).toBeInTheDocument();
    });

    it('should correctly mark compound design-variant IDs as selected without false positives', () => {
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="frontend-developer--glassmorphism"
          onSelectTemplate={vi.fn()}
        />
      );

      // Frontend Developer card should be marked active with its variant name
      expect(screen.getByText(/Active: Glassmorphism/i)).toBeInTheDocument();

      // Other cards (like Backend Engineer) should not be marked Active
      const backendCard = screen.getByText(/Backend Software Engineer/i).closest('.group');
      expect(backendCard).not.toHaveTextContent(/\bActive\b/);
    });

    it('should support sample content toggle in live preview sub-modal', () => {
      const mockSelect = vi.fn();
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={vi.fn()}
          currentTemplateId="minimalist"
          onSelectTemplate={mockSelect}
        />
      );

      // Open interactive preview
      const previewButtons = screen.getAllByRole('button', { name: /Interactive Preview/i });
      fireEvent.click(previewButtons[0]);

      // Find sample content checkbox and uncheck it
      const sampleCheckbox = screen.getByLabelText(/Include sample content/i);
      expect(sampleCheckbox.checked).toBe(true);
      fireEvent.click(sampleCheckbox);
      expect(sampleCheckbox.checked).toBe(false);

      // Click Use This Template
      const useTemplateBtn = screen.getByRole('button', { name: /Use This Template/i });
      fireEvent.click(useTemplateBtn);

      // Should call with withSample=false
      expect(mockSelect).toHaveBeenCalledWith(expect.any(String), false);
    });

    it('should handle Escape key to close preview sub-modal or close gallery', () => {
      const mockClose = vi.fn();
      render(
        <TemplateGalleryModal
          isOpen={true}
          onClose={mockClose}
          currentTemplateId="minimalist"
          onSelectTemplate={vi.fn()}
        />
      );

      // Open interactive preview
      const previewButtons = screen.getAllByRole('button', { name: /Interactive Preview/i });
      fireEvent.click(previewButtons[0]);

      expect(screen.getByText(/Back to Templates/i)).toBeInTheDocument();

      // Press Escape: should close preview sub-modal, NOT the whole gallery
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByText(/Back to Templates/i)).not.toBeInTheDocument();
      expect(mockClose).not.toHaveBeenCalled();

      // Press Escape again: should close gallery modal
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. DashboardPage Integration with Template Studio & Stock Presets', () => {
    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: { name: 'Studio Tester', bio: 'Creative Dev' },
            skills: { frontend: ['React'], backend: ['Node.js'], devops: [] },
            projects: [],
          },
          user: {
            username: 'studiotester',
            templateId: 'backend-engineer',
            isPro: true,
            customDomain: '',
          },
        },
      });
    });

    it('should open TemplateGalleryModal from the Dashboard action bar Template Studio button', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'studiotester', isPro: true, templateId: 'backend-engineer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme/i)).toBeInTheDocument();
      });

      // Find and click "Template Studio" button
      const studioBtn = screen.getByRole('button', { name: /Template Studio/i });
      fireEvent.click(studioBtn);

      // Verify gallery modal opened
      expect(screen.getByText(/Professional Portfolio Template Library/i)).toBeInTheDocument();

      // Close modal
      const closeBtn = screen.getByTitle(/Close Gallery \(Esc\)/i);
      fireEvent.click(closeBtn);

      expect(screen.queryByText(/Professional Portfolio Template Library/i)).not.toBeInTheDocument();
    });

    it('should load sample projects when clicking quick start in an empty Projects tab', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'studiotester', isPro: true, templateId: 'backend-engineer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Wait for load
      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme/i)).toBeInTheDocument();
      });

      // Navigate to Projects tab
      const projectsTab = screen.getByRole('button', { name: /projects/i });
      fireEvent.click(projectsTab);

      // Should show empty state with Quick Start button
      expect(screen.getByText(/No projects added yet/i)).toBeInTheDocument();
      const quickStartBtn = screen.getByRole('button', { name: /Quick Start: Load.*Projects/i });
      expect(quickStartBtn).toBeInTheDocument();

      fireEvent.click(quickStartBtn);

      // Projects should now be populated
      await waitFor(() => {
        expect(screen.getByText(/PROJECT #1/i)).toBeInTheDocument();
      });
    });

    it('should allow inserting stock screenshot presets via 1-click buttons', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'studiotester', isPro: true, templateId: 'minimalist' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      // Wait for load
      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme/i)).toBeInTheDocument();
      });

      // Navigate to Projects tab
      const projectsTab = screen.getByRole('button', { name: /projects/i });
      fireEvent.click(projectsTab);

      // Click Add Project
      const addProjectBtn = screen.getByRole('button', { name: /add project/i });
      fireEvent.click(addProjectBtn);

      // Verify stock screenshot presets exist
      const mobilePresetBtn = screen.getByRole('button', { name: /Mobile UI/i });
      expect(mobilePresetBtn).toBeInTheDocument();

      fireEvent.click(mobilePresetBtn);

      // Check screenshot input updated with Unsplash URL
      const screenshotInput = screen.getByPlaceholderText(/https:\/\/images\.unsplash\.com/i);
      expect(screenshotInput.value).toContain('images.unsplash.com');
    });
  });
});
