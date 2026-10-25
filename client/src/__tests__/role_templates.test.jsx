import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROLES, CATEGORIES, ARCHETYPES, getRoleConfig } from '../features/portfolio/rolesConfig';
import { templateMap, DefaultLayout } from '../features/portfolio/templates';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import * as AuthContextModule from '../context/AuthContext';
import apiClient from '../api/client';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('ROLE TAXONOMY & TEMPLATE LAYOUT ENGINES TEST SUITE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Taxonomy & Role Configuration Integrity', () => {
    it('should have exactly 4 core categories and 38 specialized roles', () => {
      // 1 all + 4 categories = 5 items in CATEGORIES
      expect(CATEGORIES.filter((c) => c.id !== 'all')).toHaveLength(4);
      expect(ROLES).toHaveLength(38);
    });

    it('should assign each role to a valid category and archetype', () => {
      const validCategories = ['tech-product', 'visual-creative', 'media-lifestyle', 'writing-marketing'];
      const validArchetypes = Object.values(ARCHETYPES);

      ROLES.forEach((role) => {
        expect(validCategories).toContain(role.category);
        expect(validArchetypes).toContain(role.archetype);
        expect(role.id).toBeDefined();
        expect(role.title).toBeDefined();
        expect(role.badge).toBeDefined();
        expect(role.strategy).toBeDefined();
        expect(role.sampleData).toBeDefined();
        expect(role.sampleData.profile).toBeDefined();
        expect(role.sampleData.profile.name).toBeDefined();
        expect(role.sampleData.profile.bio).toBeDefined();
        expect(Array.isArray(role.sampleData.projects)).toBe(true);
        expect(role.sampleData.projects.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should return valid role configuration via getRoleConfig helper with fallback', () => {
      const backendConfig = getRoleConfig('backend-engineer');
      expect(backendConfig.id).toBe('backend-engineer');
      expect(backendConfig.archetype).toBe(ARCHETYPES.CODE_ARCHITECTURE);

      // Unknown fallback
      const fallbackConfig = getRoleConfig('non-existent-role');
      expect(fallbackConfig).toBeDefined();
      expect(fallbackConfig.id).toBe('fullstack-developer');
    });
  });

  describe('2. Template Map Dispatcher Integrity', () => {
    it('should register all 38 roles and 3 legacy themes in templateMap', () => {
      expect(templateMap['minimalist']).toBeDefined();
      expect(templateMap['cyberpunk']).toBeDefined();
      expect(templateMap['corporate']).toBeDefined();

      ROLES.forEach((role) => {
        expect(templateMap[role.id]).toBeDefined();
      });
    });

    it('should render each archetype layout without crashing', () => {
      const mockData = {
        user: { username: 'testuser', isPro: true },
        portfolio: {
          profile: {
            name: 'Test Artist',
            bio: 'Creative bio statement',
            socialLinks: { github: 'https://github.com' },
          },
          skills: {
            frontend: ['Skill A', 'Skill B'],
            backend: ['Skill C'],
            devops: ['Skill D'],
          },
          projects: [
            {
              title: 'Masterpiece 1',
              description: 'Detailed showcase project',
              techStack: ['React', 'Design'],
              screenshot: 'https://images.unsplash.com/photo-test',
              liveLink: 'https://example.com',
            },
          ],
        },
      };

      Object.values(ARCHETYPES).forEach((archetypeId) => {
        const LayoutComponent = templateMap[archetypeId];
        expect(LayoutComponent).toBeDefined();

        const { container } = render(
          <LayoutComponent
            data={mockData}
            roleConfig={getRoleConfig('backend-engineer')}
          />
        );
        expect(container).toBeDefined();
      });
    });
  });

  describe('3. Split-Screen Builder Role Selector & Sample Data Pre-fill', () => {
    beforeEach(() => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: { name: 'Initial Name', bio: 'Initial Bio' },
            skills: { frontend: [], backend: [], devops: [] },
            projects: [],
          },
          user: { username: 'testuser', templateId: 'minimalist', isPro: true },
        },
      });
    });

    it('should filter roles by category pills', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'testuser', isPro: true, templateId: 'backend-engineer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme & Role Template/i)).toBeInTheDocument();
      });

      // Click "Media & Lifestyle" category pill
      const mediaPill = screen.getByRole('button', { name: /media & lifestyle/i });
      fireEvent.click(mediaPill);

      // Commercial & Editorial Photographer should be visible
      expect(screen.getByText(/Commercial & Editorial Photographer/i)).toBeInTheDocument();
    });

    it('should search roles via the search input', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'testuser', isPro: true, templateId: 'backend-engineer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme & Role Template/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search roles/i);
      fireEvent.change(searchInput, { target: { value: 'Tattoo' } });

      expect(screen.getByText(/Tattoo Artist/i)).toBeInTheDocument();
    });

    it('should load role starter preset into form when Load Sample Content is clicked', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'testuser', isPro: true, templateId: 'data-scientist' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme & Role Template/i)).toBeInTheDocument();
      });

      // Find "Load Sample Content" button
      const loadSampleBtn = screen.getByRole('button', { name: /load sample content/i });
      fireEvent.click(loadSampleBtn);

      // Verify status text confirms load
      await waitFor(() => {
        expect(screen.getByText(/Loaded starter preset for/i)).toBeInTheDocument();
      });

      // Switch to Profile tab and verify user name remains authentic 'testuser', NOT sample persona
      const profileTab = screen.getByRole('button', { name: /profile/i });
      fireEvent.click(profileTab);

      const nameInput = screen.getByDisplayValue('Initial Name');
      expect(nameInput).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Aria Montgomery')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('Elena Rostova')).not.toBeInTheDocument();
    });

    it('should retain user real name and NEVER change to username handle when Load Sample Content is clicked', async () => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: { name: 'Shridhar Sharma', bio: 'My Real Bio' },
            skills: { frontend: [], backend: [], devops: [] },
            projects: [],
          },
          user: { name: 'Shridhar Sharma', username: 'shridhar_07', templateId: 'frontend-developer', isPro: true },
        },
      });

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { name: 'Shridhar Sharma', username: 'shridhar_07', isPro: true, templateId: 'frontend-developer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme & Role Template/i)).toBeInTheDocument();
      });

      // Click "Load Sample Content"
      const loadSampleBtn = screen.getByRole('button', { name: /load sample content/i });
      fireEvent.click(loadSampleBtn);

      await waitFor(() => {
        expect(screen.getByText(/Loaded starter preset for/i)).toBeInTheDocument();
      });

      // Check Profile Tab: Name must remain "Shridhar Sharma" and NOT become "shridhar_07"
      const profileTab = screen.getByRole('button', { name: /profile/i });
      fireEvent.click(profileTab);

      expect(screen.getByDisplayValue('Shridhar Sharma')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('shridhar_07')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('Elena Rostova')).not.toBeInTheDocument();
    });

    it('should correctly load mobile app developer sample and preserve left pane visibility and authentic name', async () => {
      apiClient.get.mockResolvedValue({
        data: {
          success: true,
          portfolio: {
            profile: { name: 'Shridhar', bio: 'My Developer Bio' },
            skills: { frontend: [], backend: [], devops: [] },
            projects: [],
          },
          user: { name: 'Shridhar', username: 'shridhar09', templateId: 'mobile-developer', isPro: true },
        },
      });

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { name: 'Shridhar', username: 'shridhar09', isPro: true, templateId: 'mobile-developer' },
        updateUserLocal: vi.fn(),
      });

      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/Choose Portfolio Theme & Role Template/i)).toBeInTheDocument();
      });

      // Verify active preset banner reflects Mobile App Developer
      expect(screen.getAllByText(/Mobile App Developer \(iOS \/ Android\)/i).length).toBeGreaterThan(0);

      // Click "Load Sample Content"
      const loadSampleBtn = screen.getByRole('button', { name: /load sample content/i });
      fireEvent.click(loadSampleBtn);

      await waitFor(() => {
        expect(screen.getByText(/Loaded starter preset for Mobile App Developer/i)).toBeInTheDocument();
      });

      // Verify authentic name remains 'Shridhar' across preview and forms
      expect(screen.getAllByText(/Shridhar/i).length).toBeGreaterThan(0);
      expect(screen.queryByText(/Marcus Vance/i)).not.toBeInTheDocument();

      // Check projects tab: verify sample projects populated through replaceProjects
      const projectsTab = screen.getByRole('button', { name: /projects/i });
      fireEvent.click(projectsTab);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/ZenPulse Meditation iOS/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/CryptoTracker Android/i)).toBeInTheDocument();
        // Verify App Store link is present for iOS project
        expect(screen.getByDisplayValue(/apps\.apple\.com\/app\/zenpulse-meditation/i)).toBeInTheDocument();
        // Verify Play Store link is present for Android project
        expect(screen.getByDisplayValue(/play\.google\.com\/store\/apps\/details\?id=com\.cryptotracker\.app/i)).toBeInTheDocument();
      });
    });
  });
});
