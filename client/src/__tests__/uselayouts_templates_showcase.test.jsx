import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import {
  VerticalTabsLayout,
  AccordionOSLayout,
  FeatureCarouselLayout,
  FluidExpandingGridLayout,
  BentoCardLayout,
  HoverDragRevealLayout,
  PhotoAlbumsPolaroidLayout,
  AnimatedCollectionLayout,
  ExpandableGalleryLayout,
  SplitViewRevealLayout,
  StackedListLayout,
  DiscreteTabsLayout,
} from '../features/portfolio/templates/uselayouts';
import {
  templateMap,
  ROLE_USELAYOUTS_MAP,
  DESIGN_STYLE_COMPONENTS,
  resolveTemplateComponent,
  DefaultLayout,
} from '../features/portfolio/templates';
import {
  ROLES,
  DESIGN_STYLES,
  DESIGN_STYLES_LIST,
  getRoleConfig,
  getRoleCompatibleStyles,
} from '../features/portfolio/rolesConfig';
import {
  GlassmorphismLayout,
  SkeuomorphismLayout,
  NeoBrutalismLayout,
  ClaymorphismLayout,
  MinimalismStyleLayout,
  LiquidGlassLayout,
  BentoGridStyleLayout,
  BarelyThereLayout,
  AuroraMeshLayout,
  MetalmorphismLayout,
  ArchivalIndexLayout,
} from '../features/portfolio/templates/styles';
import { RoleShowcasePage } from '../features/portfolio/RoleShowcasePage';
import * as AuthContextModule from '../context/AuthContext';

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

describe('USELAYOUTS.COM ANIMATED MODERN TEMPLATES & SHOWCASE SUITE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const samplePayload = {
    user: {
      username: 'artisan',
      isPro: true,
      customDomain: 'artisan.dev',
    },
    portfolio: {
      profile: {
        name: 'Artisan Specialist',
        bio: 'Comprehensive portfolio bio and strategic narrative statement.',
        resumeUrl: 'https://example.com/resume.pdf',
        socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
      },
      skills: {
        frontend: ['React', 'Framer Motion', 'Tailwind CSS'],
        backend: ['Node.js', 'PostgreSQL', 'Go'],
        devops: ['Docker', 'AWS', 'Kubernetes'],
      },
      projects: [
        {
          title: 'Quantum Mesh Pipeline',
          description: 'High-performance distributed telemetry broker handling 1.5M requests/sec.',
          techStack: ['Go', 'Raft', 'eBPF'],
          screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
          repoLink: 'https://github.com',
          liveLink: 'https://demo.dev',
        },
        {
          title: 'Neural Vision Core',
          description: 'Real-time multi-spectral segmentation running at 120 FPS on edge accelerators.',
          techStack: ['PyTorch', 'C++', 'CUDA'],
          screenshot: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
          repoLink: 'https://github.com',
          liveLink: 'https://neural.dev',
        },
      ],
    },
  };

  describe('1. Individual useLayouts Template Component Rendering', () => {
    const layoutComponents = [
      { name: 'VerticalTabsLayout', Component: VerticalTabsLayout, roleId: 'backend-engineer' },
      { name: 'AccordionOSLayout', Component: AccordionOSLayout, roleId: 'frontend-developer' },
      { name: 'FeatureCarouselLayout', Component: FeatureCarouselLayout, roleId: 'mobile-developer' },
      { name: 'FluidExpandingGridLayout', Component: FluidExpandingGridLayout, roleId: 'data-scientist' },
      { name: 'BentoCardLayout', Component: BentoCardLayout, roleId: 'graphic-designer' },
      { name: 'HoverDragRevealLayout', Component: HoverDragRevealLayout, roleId: 'motion-designer' },
      { name: 'PhotoAlbumsPolaroidLayout', Component: PhotoAlbumsPolaroidLayout, roleId: 'concept-artist' },
      { name: 'AnimatedCollectionLayout', Component: AnimatedCollectionLayout, roleId: 'storyboard-artist' },
      { name: 'ExpandableGalleryLayout', Component: ExpandableGalleryLayout, roleId: 'photographer' },
      { name: 'SplitViewRevealLayout', Component: SplitViewRevealLayout, roleId: 'film-editor' },
      { name: 'StackedListLayout', Component: StackedListLayout, roleId: 'content-writer' },
      { name: 'DiscreteTabsLayout', Component: DiscreteTabsLayout, roleId: 'scriptwriter' },
    ];

    layoutComponents.forEach(({ name, Component, roleId }) => {
      it(`should render ${name} without throwing errors`, () => {
        const roleConfig = getRoleConfig(roleId);
        const { container } = render(
          <Component data={samplePayload} roleConfig={roleConfig} />
        );
        expect(container).toBeDefined();
        expect(screen.getAllByText(/Artisan Specialist/i).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('2. Master Taxonomy Mapping Matrix Integrity', () => {
    it('should map each matrix role target to the exact designated useLayouts template', () => {
      expect(ROLE_USELAYOUTS_MAP['backend-engineer']).toBe(VerticalTabsLayout);
      expect(ROLE_USELAYOUTS_MAP['devops-engineer']).toBe(VerticalTabsLayout);

      expect(ROLE_USELAYOUTS_MAP['frontend-developer']).toBe(AccordionOSLayout);
      expect(ROLE_USELAYOUTS_MAP['fullstack-developer']).toBe(AccordionOSLayout);

      expect(ROLE_USELAYOUTS_MAP['mobile-developer']).toBe(FeatureCarouselLayout);

      expect(ROLE_USELAYOUTS_MAP['data-scientist']).toBe(FluidExpandingGridLayout);
      expect(ROLE_USELAYOUTS_MAP['fashion-model']).toBe(FluidExpandingGridLayout);
      expect(ROLE_USELAYOUTS_MAP['culinary-artist']).toBe(FluidExpandingGridLayout);

      expect(ROLE_USELAYOUTS_MAP['graphic-designer']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['brand-designer']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['packaging-designer']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['copywriter']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['growth-marketer']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['social-media-manager']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['pr-specialist']).toBe(BentoCardLayout);
      expect(ROLE_USELAYOUTS_MAP['seo-specialist']).toBe(BentoCardLayout);

      expect(ROLE_USELAYOUTS_MAP['motion-designer']).toBe(HoverDragRevealLayout);
      expect(ROLE_USELAYOUTS_MAP['animator']).toBe(HoverDragRevealLayout);
      expect(ROLE_USELAYOUTS_MAP['3d-artist']).toBe(HoverDragRevealLayout);
      expect(ROLE_USELAYOUTS_MAP['game-designer']).toBe(HoverDragRevealLayout);

      expect(ROLE_USELAYOUTS_MAP['concept-artist']).toBe(PhotoAlbumsPolaroidLayout);
      expect(ROLE_USELAYOUTS_MAP['storyboard-artist']).toBe(AnimatedCollectionLayout);

      expect(ROLE_USELAYOUTS_MAP['photographer']).toBe(ExpandableGalleryLayout);
      expect(ROLE_USELAYOUTS_MAP['wedding-photographer']).toBe(ExpandableGalleryLayout);
      expect(ROLE_USELAYOUTS_MAP['videographer']).toBe(ExpandableGalleryLayout);
      expect(ROLE_USELAYOUTS_MAP['architect']).toBe(ExpandableGalleryLayout);
      expect(ROLE_USELAYOUTS_MAP['fashion-designer']).toBe(ExpandableGalleryLayout);
      expect(ROLE_USELAYOUTS_MAP['tattoo-artist']).toBe(ExpandableGalleryLayout);

      expect(ROLE_USELAYOUTS_MAP['film-editor']).toBe(SplitViewRevealLayout);
      expect(ROLE_USELAYOUTS_MAP['interior-designer']).toBe(SplitViewRevealLayout);
      expect(ROLE_USELAYOUTS_MAP['makeup-artist']).toBe(SplitViewRevealLayout);

      expect(ROLE_USELAYOUTS_MAP['content-writer']).toBe(StackedListLayout);
      expect(ROLE_USELAYOUTS_MAP['technical-writer']).toBe(StackedListLayout);

      expect(ROLE_USELAYOUTS_MAP['scriptwriter']).toBe(DiscreteTabsLayout);
    });

    it('should register all 38 roles in templateMap', () => {
      ROLES.forEach((role) => {
        expect(templateMap[role.id]).toBeDefined();
      });
    });
  });

  describe('3. Unified RoleShowcasePage Router & Device Viewport', () => {
    it('should render RoleShowcasePage with topbar controls, active title and template', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'testuser', isPro: true },
      });

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/showcase/backend-engineer']}>
            <Routes>
              <Route path="/showcase/:roleId" element={<RoleShowcasePage />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      );

      // Verify topbar displays title and badge
      expect(screen.getAllByText(/Backend Software Engineer/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/SHOWCASE/i)).toBeInTheDocument();
      expect(screen.getByText(/Use This Template/i)).toBeInTheDocument();
    });

    it('should toggle between desktop, tablet, and mobile device viewports', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
      });

      const { container } = render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/showcase/frontend-developer']}>
            <Routes>
              <Route path="/showcase/:roleId" element={<RoleShowcasePage />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      );

      // Default is desktop: no max-w-[420px]
      const frameContainer = container.querySelector('.transition-all.duration-300');
      expect(frameContainer.className).toContain('max-w-full');

      // Click Mobile viewport button
      const mobileBtn = screen.getByTitle(/Mobile View \(390px\)/i);
      fireEvent.click(mobileBtn);
      expect(frameContainer.className).toContain('max-w-[420px]');

      // Click Tablet viewport button
      const tabletBtn = screen.getByTitle(/Tablet View \(768px\)/i);
      fireEvent.click(tabletBtn);
      expect(frameContainer.className).toContain('max-w-[820px]');
    });

    it('should switch between compatible design styles for a role and render the styled template', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { username: 'testuser', isPro: true },
      });

      render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/showcase/frontend-developer']}>
            <Routes>
              <Route path="/showcase/:roleId" element={<RoleShowcasePage />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      );

      // Verify that compatible styles are displayed (Glassmorphism, Neo-Brutalism, etc.)
      const glassBtn = screen.getByRole('button', { name: /Glassmorphism/i });
      expect(glassBtn).toBeInTheDocument();

      // Click Glassmorphism style variant button
      fireEvent.click(glassBtn);
      expect(screen.getByText(/GLASSMORPHISM \/\//i)).toBeInTheDocument();

      // Click Neo-Brutalism style variant button if present
      const brutalBtn = screen.getByRole('button', { name: /Neo-Brutalism/i });
      fireEvent.click(brutalBtn);
      expect(screen.getByText(/NEO-BRUTALISM \/\//i)).toBeInTheDocument();
    });
  });

  describe('4. Master UI/UX Design Styles (PDF Engineering Matrix)', () => {
    const allStyles = [
      { id: 'glassmorphism', name: 'Glassmorphism', Component: GlassmorphismLayout },
      { id: 'skeuomorphism', name: 'Skeuomorphism', Component: SkeuomorphismLayout },
      { id: 'neobrutalism', name: 'Neo-Brutalism', Component: NeoBrutalismLayout },
      { id: 'claymorphism', name: 'Claymorphism', Component: ClaymorphismLayout },
      { id: 'minimalism', name: 'Minimalism', Component: MinimalismStyleLayout },
      { id: 'liquid-glass', name: 'Liquid Glass', Component: LiquidGlassLayout },
      { id: 'bento-grid', name: 'Bento Grid', Component: BentoGridStyleLayout },
      { id: 'barely-there', name: "'Barely There' UI", Component: BarelyThereLayout },
      { id: 'aurora-mesh', name: 'Aurora & Mesh Gradients', Component: AuroraMeshLayout },
      { id: 'metalmorphism', name: 'Metalmorphism', Component: MetalmorphismLayout },
      { id: 'archival-index', name: 'The Archival Index', Component: ArchivalIndexLayout },
    ];

    it('should register all 11 design styles in DESIGN_STYLE_COMPONENTS and templateMap', () => {
      allStyles.forEach(({ id }) => {
        expect(DESIGN_STYLE_COMPONENTS[id]).toBeDefined();
        expect(templateMap[id]).toBeDefined();
      });
    });

    it('should render all 11 design style components with sample data without crashing', () => {
      allStyles.forEach(({ name, Component }) => {
        const { container } = render(
          <Component data={samplePayload} roleConfig={getRoleConfig('frontend-developer')} />
        );
        expect(container).toBeDefined();
      });
    });

    it('should generate multiple templates for roles with multiple compatible design styles', () => {
      // Frontend Developer has multiple compatible styles: Glassmorphism, Bento, Liquid Glass, Aurora Mesh, Neo-Brutalism
      const frontendStyles = getRoleCompatibleStyles('frontend-developer');
      expect(frontendStyles.length).toBeGreaterThanOrEqual(4);

      frontendStyles.forEach((style) => {
        const compoundKey = `frontend-developer--${style.id}`;
        expect(templateMap[compoundKey]).toBeDefined();

        const ResolvedComp = resolveTemplateComponent(compoundKey);
        expect(ResolvedComp).toBeDefined();

        const { container } = render(
          <ResolvedComp data={samplePayload} />
        );
        expect(container).toBeDefined();
      });

      // Backend Engineer has multiple compatible styles: Archival Index, Metalmorphism, Minimalism, Barely There
      const backendStyles = getRoleCompatibleStyles('backend-engineer');
      expect(backendStyles.length).toBeGreaterThanOrEqual(3);

      backendStyles.forEach((style) => {
        const compoundKey = `backend-engineer--${style.id}`;
        expect(templateMap[compoundKey]).toBeDefined();
      });
    });
  });

  describe('5. Mobile App Developer App Store & Play Store Links Integrity', () => {
    it('should selectively render App Store and Play Store buttons according to project availability', () => {
      const mobileData = {
        user: { username: 'mobiledev', isPro: true },
        portfolio: {
          profile: { name: 'Mobile Artisan', bio: 'Native iOS & Android developer.' },
          projects: [
            {
              title: 'iOS Solo App',
              description: 'Exclusive to iOS ecosystem.',
              techStack: ['SwiftUI'],
              appStoreLink: 'https://apps.apple.com/app/solo-ios',
              playStoreLink: '',
            },
            {
              title: 'Android Solo App',
              description: 'Exclusive to Google Play ecosystem.',
              techStack: ['Kotlin'],
              appStoreLink: '',
              playStoreLink: 'https://play.google.com/store/apps/details?id=solo.android',
            },
            {
              title: 'Cross Platform Duo',
              description: 'Available on both stores.',
              techStack: ['Flutter'],
              appStoreLink: 'https://apps.apple.com/app/duo',
              playStoreLink: 'https://play.google.com/store/apps/details?id=duo',
            },
          ],
        },
      };

      render(<FeatureCarouselLayout data={mobileData} />);

      // First project (iOS Solo App): should show App Store, NOT Google Play
      expect(screen.getByText('App Store')).toBeInTheDocument();
      expect(screen.queryByText('Google Play')).not.toBeInTheDocument();

      // Click Next project: Android Solo App
      const nextBtn = screen.getByLabelText('Next Project');
      fireEvent.click(nextBtn);

      // Now should show Google Play, NOT App Store
      expect(screen.getByText('Google Play')).toBeInTheDocument();
      expect(screen.queryByText('App Store')).not.toBeInTheDocument();

      // Click Next project: Cross Platform Duo
      fireEvent.click(nextBtn);

      // Now should show BOTH App Store and Google Play
      expect(screen.getByText('App Store')).toBeInTheDocument();
      expect(screen.getByText('Google Play')).toBeInTheDocument();
    });
  });
});
