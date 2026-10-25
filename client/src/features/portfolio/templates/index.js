import React from 'react';
import MinimalistLayout from './MinimalistLayout';
import CyberpunkLayout from './CyberpunkLayout';
import CorporateLayout from './CorporateLayout';
import CodeArchitectureLayout from './CodeArchitectureLayout';
import DeviceMockupLayout from './DeviceMockupLayout';
import DataAnalyticsLayout from './DataAnalyticsLayout';
import CaseStudyProductLayout from './CaseStudyProductLayout';
import VisualMasonryGalleryLayout from './VisualMasonryGalleryLayout';
import VideoShowreelMotionLayout from './VideoShowreelMotionLayout';
import BeforeAfterLookbookLayout from './BeforeAfterLookbookLayout';
import EditorialPublicationLayout from './EditorialPublicationLayout';
import TechnicalDocsLayout from './TechnicalDocsLayout';
import MarketingKpiDashboardLayout from './MarketingKpiDashboardLayout';

// Dedicated useLayouts modern animated components
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
} from './uselayouts';

// 11 Master UI/UX Design Styles (PDF Specification)
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
} from './styles';

import {
  ROLES,
  ARCHETYPES,
  DESIGN_STYLES,
  DESIGN_STYLES_LIST,
  getRoleConfig,
  getRoleCompatibleStyles,
} from '../rolesConfig';

// Map archetypes to layout components (preserves archetype test contracts)
export const ARCHETYPE_COMPONENTS = {
  [ARCHETYPES.CODE_ARCHITECTURE]: CodeArchitectureLayout,
  [ARCHETYPES.DEVICE_MOCKUP]: DeviceMockupLayout,
  [ARCHETYPES.DATA_ANALYTICS]: DataAnalyticsLayout,
  [ARCHETYPES.CASE_STUDY]: CaseStudyProductLayout,
  [ARCHETYPES.VISUAL_MASONRY]: VisualMasonryGalleryLayout,
  [ARCHETYPES.VIDEO_SHOWREEL]: VideoShowreelMotionLayout,
  [ARCHETYPES.BEFORE_AFTER]: BeforeAfterLookbookLayout,
  [ARCHETYPES.EDITORIAL]: EditorialPublicationLayout,
  [ARCHETYPES.TECHNICAL_DOCS]: TechnicalDocsLayout,
  [ARCHETYPES.MARKETING_KPI]: MarketingKpiDashboardLayout,
};

// Explicit mapping from Master Taxonomy Mapping Matrix (38 Roles -> 12 useLayouts templates)
export const ROLE_USELAYOUTS_MAP = {
  // 1. Tech & Digital Product Development
  'backend-engineer': VerticalTabsLayout,
  'frontend-developer': AccordionOSLayout,
  'fullstack-developer': AccordionOSLayout,
  'mobile-developer': FeatureCarouselLayout,
  'data-scientist': FluidExpandingGridLayout,
  'devops-engineer': VerticalTabsLayout,
  'uiux-designer': BentoCardLayout,
  'product-designer': BentoCardLayout,
  'interaction-designer': HoverDragRevealLayout,
  'info-architect': VerticalTabsLayout,

  // 2. Visual Communication & Creative Arts
  'graphic-designer': BentoCardLayout,
  'brand-designer': BentoCardLayout,
  'motion-designer': HoverDragRevealLayout,
  'packaging-designer': BentoCardLayout,
  'concept-artist': PhotoAlbumsPolaroidLayout,
  'animator': HoverDragRevealLayout,
  '3d-artist': HoverDragRevealLayout,
  'game-designer': HoverDragRevealLayout,
  'storyboard-artist': AnimatedCollectionLayout,

  // 3. Media, Fine Arts & Lifestyle Services
  'photographer': ExpandableGalleryLayout,
  'wedding-photographer': ExpandableGalleryLayout,
  'videographer': ExpandableGalleryLayout,
  'film-editor': SplitViewRevealLayout,
  'architect': ExpandableGalleryLayout,
  'interior-designer': SplitViewRevealLayout,
  'fashion-designer': ExpandableGalleryLayout,
  'fashion-model': FluidExpandingGridLayout,
  'makeup-artist': SplitViewRevealLayout,
  'tattoo-artist': ExpandableGalleryLayout,
  'culinary-artist': FluidExpandingGridLayout,

  // 4. Writing, Marketing & Strategy Roles
  'copywriter': BentoCardLayout,
  'content-writer': StackedListLayout,
  'technical-writer': StackedListLayout,
  'scriptwriter': DiscreteTabsLayout,
  'growth-marketer': BentoCardLayout,
  'social-media-manager': BentoCardLayout,
  'pr-specialist': BentoCardLayout,
  'seo-specialist': BentoCardLayout,
};

// 11 Design Style Component Dispatcher
export const DESIGN_STYLE_COMPONENTS = {
  'glassmorphism': GlassmorphismLayout,
  'skeuomorphism': SkeuomorphismLayout,
  'neobrutalism': NeoBrutalismLayout,
  'claymorphism': ClaymorphismLayout,
  'minimalism': MinimalismStyleLayout,
  'liquid-glass': LiquidGlassLayout,
  'bento-grid': BentoGridStyleLayout,
  'barely-there': BarelyThereLayout,
  'aurora-mesh': AuroraMeshLayout,
  'metalmorphism': MetalmorphismLayout,
  'archival-index': ArchivalIndexLayout,
};

// Build comprehensive templateMap covering:
// 1. Legacy themes (minimalist, cyberpunk, corporate)
// 2. Direct Archetypes
// 3. Direct Design Styles (glassmorphism, neobrutalism, etc.)
// 4. Base Role IDs (with designated useLayouts template)
// 5. Compound Role + Design Style combinations (e.g. frontend-developer--glassmorphism)
export const templateMap = {
  // Legacy themes
  minimalist: MinimalistLayout,
  cyberpunk: CyberpunkLayout,
  corporate: CorporateLayout,

  // Direct archetype keys for backward compatibility
  ...ARCHETYPE_COMPONENTS,

  // Direct design styles
  ...DESIGN_STYLE_COMPONENTS,
};

// Map each of the 38 role IDs to its designated useLayouts component (or archetype fallback) wrapped with roleConfig
ROLES.forEach((role) => {
  const Component = ROLE_USELAYOUTS_MAP[role.id] || ARCHETYPE_COMPONENTS[role.archetype] || CodeArchitectureLayout;

  // Wrap to inject default roleConfig if not explicitly provided
  const RoleWrappedComponent = (props) =>
    React.createElement(Component, {
      ...props,
      roleConfig: props.roleConfig || getRoleConfig(role.id),
    });
  RoleWrappedComponent.displayName = `RoleTemplate(${role.id})`;

  templateMap[role.id] = RoleWrappedComponent;

  // Generate multiple templates for this role using its compatible design styles (PDF Specification)
  DESIGN_STYLES_LIST.forEach((style) => {
    const StyleComponent = DESIGN_STYLE_COMPONENTS[style.id] || Component;

    const CompoundWrappedComponent = (props) =>
      React.createElement(StyleComponent, {
        ...props,
        roleConfig: props.roleConfig || getRoleConfig(role.id),
      });
    CompoundWrappedComponent.displayName = `RoleStyleTemplate(${role.id}--${style.id})`;

    templateMap[`${role.id}--${style.id}`] = CompoundWrappedComponent;
  });
});

export const DefaultLayout = MinimalistLayout;

/**
 * Robust dispatcher helper to resolve active template component
 * Handles base roles, style keys, compound strings (role--style), and fallbacks
 */
export const resolveTemplateComponent = (templateId) => {
  if (!templateId) return DefaultLayout;
  const clean = templateId.toLowerCase().trim();

  if (templateMap[clean]) return templateMap[clean];

  if (clean.includes('--')) {
    const [baseRole, styleId] = clean.split('--');
    if (DESIGN_STYLE_COMPONENTS[styleId]) {
      const StyleComp = DESIGN_STYLE_COMPONENTS[styleId];
      return (props) =>
        React.createElement(StyleComp, {
          ...props,
          roleConfig: props.roleConfig || getRoleConfig(baseRole),
        });
    }
    if (templateMap[baseRole]) return templateMap[baseRole];
  }

  return DefaultLayout;
};

export {
  MinimalistLayout,
  CyberpunkLayout,
  CorporateLayout,
  CodeArchitectureLayout,
  DeviceMockupLayout,
  DataAnalyticsLayout,
  CaseStudyProductLayout,
  VisualMasonryGalleryLayout,
  VideoShowreelMotionLayout,
  BeforeAfterLookbookLayout,
  EditorialPublicationLayout,
  TechnicalDocsLayout,
  MarketingKpiDashboardLayout,
  // 12 useLayouts templates
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
  // 11 Master Design Style Layouts
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
};
