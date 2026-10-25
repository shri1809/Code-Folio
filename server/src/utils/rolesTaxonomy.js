/**
 * Exhaustive Directory of Professional Roles & Allowed Template IDs (Backend Taxonomy)
 * Mirrors frontend taxonomy to ensure strict whitelist validation
 * Supports:
 * 1. Base 38 Specialized Professional Roles
 * 2. 11 Master UI/UX Design Styles (PDF Specification)
 * 3. Role + Style Compound Templates (e.g. frontend-developer--glassmorphism)
 * 4. 3 Legacy Themes (minimalist, cyberpunk, corporate)
 */

const BASE_ROLE_IDS = [
  // 1. Tech & Digital Product Development
  'backend-engineer',
  'frontend-developer',
  'fullstack-developer',
  'mobile-developer',
  'data-scientist',
  'devops-engineer',
  'uiux-designer',
  'product-designer',
  'interaction-designer',
  'info-architect',

  // 2. Visual Communication & Creative Arts
  'graphic-designer',
  'brand-designer',
  'motion-designer',
  'packaging-designer',
  'concept-artist',
  'animator',
  '3d-artist',
  'game-designer',
  'storyboard-artist',

  // 3. Media, Fine Arts & Lifestyle Services
  'photographer',
  'wedding-photographer',
  'videographer',
  'film-editor',
  'architect',
  'interior-designer',
  'fashion-designer',
  'fashion-model',
  'makeup-artist',
  'tattoo-artist',
  'culinary-artist',

  // 4. Writing, Marketing & Strategy Roles
  'copywriter',
  'content-writer',
  'technical-writer',
  'scriptwriter',
  'growth-marketer',
  'social-media-manager',
  'pr-specialist',
  'seo-specialist',

  // Legacy templates (preserved for backward compatibility)
  'minimalist',
  'cyberpunk',
  'corporate',
];

const DESIGN_STYLE_IDS = [
  'glassmorphism',
  'skeuomorphism',
  'neobrutalism',
  'claymorphism',
  'minimalism',
  'liquid-glass',
  'bento-grid',
  'barely-there',
  'aurora-mesh',
  'metalmorphism',
  'archival-index',
];

// Generate compound templates: ${role}--${style}
const COMBINED_ROLE_STYLE_IDS = [];
BASE_ROLE_IDS.forEach((role) => {
  DESIGN_STYLE_IDS.forEach((style) => {
    COMBINED_ROLE_STYLE_IDS.push(`${role}--${style}`);
  });
});

const ROLE_IDS = [
  ...BASE_ROLE_IDS,
  ...DESIGN_STYLE_IDS,
  ...COMBINED_ROLE_STYLE_IDS,
];

const isValidTemplateId = (templateId) => {
  if (!templateId || typeof templateId !== 'string') return false;
  return ROLE_IDS.includes(templateId.toLowerCase().trim());
};

module.exports = {
  ROLE_IDS,
  DESIGN_STYLE_IDS,
  isValidTemplateId,
};
