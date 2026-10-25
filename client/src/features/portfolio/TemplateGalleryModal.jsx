import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Eye,
  Sparkles,
  Check,
  Monitor,
  Smartphone,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  Palette,
  Terminal,
  Compass,
  Film,
  Camera,
  Feather,
  BookOpen,
  TrendingUp,
  Layout,
  Filter,
  RotateCcw,
} from 'lucide-react';
import {
  ROLES,
  CATEGORIES,
  ARCHETYPES,
  getRoleConfig,
  getRoleCompatibleStyles,
  DESIGN_STYLES,
  isSampleRoleName,
  getAuthenticUserName,
} from './rolesConfig';
import { templateMap, DefaultLayout, resolveTemplateComponent } from './templates';
import Button from '../../components/ui/Button';
import ImageWithFallback from '../../components/ImageWithFallback';

// Metadata and styling descriptions for the 10 Archetypes
export const ARCHETYPE_METADATA = {
  [ARCHETYPES.CODE_ARCHITECTURE]: {
    name: 'Code Architecture & Telemetry',
    vibe: 'Dark Neo-Terminal',
    icon: Terminal,
    color: 'from-blue-600/30 to-indigo-600/30',
    features: ['System Uptime & Latency', 'Architecture Specs', 'Git Repo Matrix'],
  },
  [ARCHETYPES.DEVICE_MOCKUP]: {
    name: 'Interactive Device Mockup',
    vibe: 'Native iOS / Android Frame',
    icon: Smartphone,
    color: 'from-cyan-600/30 to-blue-600/30',
    features: ['Interactive iPhone Screen Carousel', 'Dynamic Island & Status Bar', 'Store Metrics'],
  },
  [ARCHETYPES.DATA_ANALYTICS]: {
    name: 'Jupyter Statistical Notebook',
    vibe: 'Data Science & Metrics',
    icon: TrendingUp,
    color: 'from-emerald-600/30 to-teal-600/30',
    features: ['Cell Code Blocks', 'Precision Statistical KPI Tiles', 'Formula Math Blocks'],
  },
  [ARCHETYPES.CASE_STUDY]: {
    name: 'Design Thinking Case Study',
    vibe: 'Figma & Design Systems',
    icon: Layout,
    color: 'from-purple-600/30 to-pink-600/30',
    features: ['User Research Personas', 'Wireframe Flow', 'Measurable Business Uplift'],
  },
  [ARCHETYPES.VISUAL_MASONRY]: {
    name: 'Curated Visual Masonry',
    vibe: 'Vogue Editorial / Lightbox',
    icon: Camera,
    color: 'from-amber-600/30 to-orange-600/30',
    features: ['Multi-Column Masonry', 'Fullscreen Lightbox Zoom', 'Plate Metadata Overlays'],
  },
  [ARCHETYPES.VIDEO_SHOWREEL]: {
    name: 'Cinema Video Showreel',
    vibe: 'Cinematic Cinema Stage',
    icon: Film,
    color: 'from-rose-600/30 to-red-600/30',
    features: ['4K Video Player with Scrub Bar', 'Timeline Shot Breakdown', 'Pipeline Tech Tags'],
  },
  [ARCHETYPES.BEFORE_AFTER]: {
    name: 'Interactive Before/After Lookbook',
    vibe: 'Draggable Comparison Slider',
    icon: Compass,
    color: 'from-sky-600/30 to-indigo-600/30',
    features: ['Realtime Draggable Split Divider', 'Blueprint vs Rendered', 'Color Swatches Palette'],
  },
  [ARCHETYPES.EDITORIAL]: {
    name: 'Luxury Editorial Publication',
    vibe: 'The New Yorker / Monocle',
    icon: Feather,
    color: 'from-stone-600/30 to-slate-600/30',
    features: ['Editorial Volume & Byline', 'Reading Time Estimates', 'Pull-Quote Narrative Highlights'],
  },
  [ARCHETYPES.TECHNICAL_DOCS]: {
    name: 'Developer Technical Documentation',
    vibe: 'GitBook / Docusaurus',
    icon: BookOpen,
    color: 'from-blue-600/30 to-cyan-600/30',
    features: ['Collapsible Navigation Tree', 'REST Endpoint Callout', 'Parameter Schema Tables'],
  },
  [ARCHETYPES.MARKETING_KPI]: {
    name: 'Performance Growth Dashboard',
    vibe: 'High-Impact Growth Metrics',
    icon: TrendingUp,
    color: 'from-emerald-600/30 to-cyan-600/30',
    features: ['High-Converting KPI Tiles', 'Acquisition Funnel Stages', 'A/B Test Creative Cards'],
  },
};

export const TemplateGalleryModal = ({
  isOpen,
  onClose,
  currentTemplateId,
  currentUserName,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArchetype, setSelectedArchetype] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewRole, setPreviewRole] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [includeSampleContent, setIncludeSampleContent] = useState(true);
  const [previewStyle, setPreviewStyle] = useState('default');

  // Keyboard navigation & accessibility: Close or go back on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (previewRole) {
          setPreviewRole(null);
          setPreviewStyle('default');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, previewRole, onClose]);

  // Filter templates based on category, archetype, and search query (memoized to eliminate repeated regex/strings work)
  const filteredRoles = useMemo(() => {
    return ROLES.filter((role) => {
      const matchesCategory =
        selectedCategory === 'all' || role.category === selectedCategory;
      const matchesArchetype =
        selectedArchetype === 'all' || role.archetype === selectedArchetype;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        role.title.toLowerCase().includes(q) ||
        role.badge.toLowerCase().includes(q) ||
        role.strategy.toLowerCase().includes(q) ||
        role.archetype.toLowerCase().includes(q) ||
        getRoleCompatibleStyles(role.id).some(
          (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
        ) ||
        (role.sampleData?.profile?.bio &&
          role.sampleData.profile.bio.toLowerCase().includes(q)) ||
        (role.sampleData?.skills?.frontend &&
          role.sampleData.skills.frontend.some((s) => s.toLowerCase().includes(q))) ||
        (role.sampleData?.skills?.backend &&
          role.sampleData.skills.backend.some((s) => s.toLowerCase().includes(q))) ||
        (role.sampleData?.skills?.devops &&
          role.sampleData.skills.devops.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesArchetype && matchesSearch;
    });
  }, [selectedCategory, selectedArchetype, searchQuery]);

  const previewCompatibleStyles = useMemo(() => {
    return previewRole ? getRoleCompatibleStyles(previewRole.id) : [];
  }, [previewRole?.id]);

  const activePreviewKey =
    previewStyle === 'default'
      ? previewRole?.id
      : `${previewRole?.id}--${previewStyle}`;

  // Preview Layout component memoized on active key
  const PreviewLayoutComponent = useMemo(() => {
    return previewRole ? resolveTemplateComponent(activePreviewKey) : null;
  }, [previewRole, activePreviewKey]);

  const previewRoleConfig = useMemo(() => {
    return previewRole ? getRoleConfig(activePreviewKey) : null;
  }, [previewRole, activePreviewKey]);

  if (!isOpen) return null;

  const totalCount = ROLES.length;
  const hasActiveFilters =
    selectedCategory !== 'all' || selectedArchetype !== 'all' || searchQuery.trim() !== '';

  const handleApplyTemplate = (role, withSample = true, styleId = 'default') => {
    const templateToApply = styleId !== 'default' ? `${role.id}--${styleId}` : role.id;
    onSelectTemplate(templateToApply, withSample);
    onClose();
  };

  const resolvedDisplayName =
    (currentUserName ? getAuthenticUserName(currentUserName, null) : '') ||
    previewRole?.sampleData?.profile?.name ||
    'Creator';

  const previewMockData = previewRole
    ? {
        user: {
          username:
            (currentUserName && !isSampleRoleName(currentUserName)
              ? currentUserName.toLowerCase().replace(/\s+/g, '')
              : '') ||
            previewRole.sampleData?.profile?.name?.toLowerCase().replace(/\s+/g, '') ||
            'developer',
          isPro: true,
          templateId: activePreviewKey,
          customDomain: null,
        },
        portfolio: {
          profile: {
            ...previewRole.sampleData?.profile,
            name: resolvedDisplayName,
          },
          skills: previewRole.sampleData?.skills || {
            frontend: [],
            backend: [],
            devops: [],
          },
          projects: previewRole.sampleData?.projects || [],
        },
      }
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-gallery-title"
      aria-describedby="template-gallery-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in select-none"
    >
      {/* Main Gallery Modal Window */}
      <div className="relative w-full max-w-7xl h-[94vh] sm:h-[90vh] bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-scale-in">
        {/* 1. TOP HEADER BAR */}
        <header className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>Canva &amp; Wix Inspired Studio</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {ROLES.length} Industry Layouts
              </span>
            </div>
            <h2
              id="template-gallery-title"
              className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight"
            >
              Professional Portfolio Template Library
            </h2>
            <p
              id="template-gallery-description"
              className="text-xs text-slate-400 hidden sm:block mt-0.5"
            >
              Select, preview, and apply tailored portfolio designs with responsive layouts and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 2. SEARCH BOX */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by role, style, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-900/80 border border-white/10 hover:border-white/20 focus:border-[#0c1df2] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0c1df2] transition font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition shrink-0 border border-white/10"
              title="Close Gallery (Esc)"
              aria-label="Close template gallery modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 3. FILTER NAVIGATION BAR & RESULT COUNTER */}
        <div className="px-5 sm:px-6 py-3 border-b border-white/10 bg-slate-950/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat.id === 'all'
                  ? ROLES.length
                  : ROLES.filter((r) => r.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-[#0c1df2] text-white shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.05] text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Archetype Quick Filter Dropdown & Match Count */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 text-xs">
            {/* Real-time Dynamic Result Count */}
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <span>{`Showing ${filteredRoles.length} of ${totalCount} templates`}</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedArchetype('all');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition text-xs ml-1"
                >
                  Reset all
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedArchetype}
                onChange={(e) => setSelectedArchetype(e.target.value)}
                aria-label="Filter by Layout Archetype"
                className="bg-slate-900 border border-white/10 hover:border-white/20 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#0c1df2] transition"
              >
                <option value="all">All Layout Archetypes</option>
                {Object.entries(ARCHETYPE_METADATA).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. TEMPLATE GRID CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70">
          {filteredRoles.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 sm:p-12">
              <div className="p-4 bg-slate-900 rounded-full border border-white/10 mb-3 text-slate-500">
                <Layers className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No templates found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                {searchQuery
                  ? `No templates matched "${searchQuery}". Try searching for another keyword or reset active filters.`
                  : 'No templates match your selected category and archetype filters.'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedArchetype('all');
                }}
                className="gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRoles.map((role) => {
                // Precise selection detection supporting default templates and compound variants
                const isExactCurrent = currentTemplateId === role.id;
                const isCompoundCurrent =
                  Boolean(currentTemplateId && currentTemplateId.startsWith(`${role.id}--`));
                const activeVariantId = isCompoundCurrent
                  ? currentTemplateId.split('--')[1]
                  : null;
                const activeVariantStyle = activeVariantId
                  ? getRoleCompatibleStyles(role.id).find((s) => s.id === activeVariantId)
                  : null;
                const isSelected = isExactCurrent || isCompoundCurrent;

                const meta =
                  ARCHETYPE_METADATA[role.archetype] ||
                  ARCHETYPE_METADATA[ARCHETYPES.CODE_ARCHITECTURE];
                const ArchetypeIcon = meta.icon;
                const compatibleStyles = getRoleCompatibleStyles(role.id);
                const thumbnailImage = role.sampleData?.projects?.[0]?.screenshot || '';

                return (
                  <div
                    key={role.id}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md hover:border-white/20 hover:shadow-lg ${
                      isSelected
                        ? 'border-[#0c1df2] ring-1 ring-[#0c1df2] shadow-sm'
                        : 'border-white/10'
                    }`}
                  >
                    {/* Visual Card Image Preview with ImageWithFallback */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 select-none">
                      <ImageWithFallback
                        src={thumbnailImage}
                        alt={`${role.title} template preview`}
                        fallbackTitle={role.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-950/85 backdrop-blur-md text-cyan-300 border border-white/10 flex items-center gap-1.5 shadow-sm">
                          <ArchetypeIcon className="w-3 h-3 text-blue-400" />
                          <span>{role.badge}</span>
                        </span>

                        {isSelected && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0c1df2] text-white flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" />
                            <span>
                              {isExactCurrent
                                ? 'Active'
                                : `Active: ${activeVariantStyle?.name || activeVariantId}`}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay with Action Buttons (Desktop enhancement) */}
                      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center gap-2.5 p-4">
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => setPreviewRole(role)}
                          className="gap-1.5 text-xs font-semibold shadow-md"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Interactive Preview</span>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApplyTemplate(role, includeSampleContent)}
                          className="gap-1.5 text-xs font-semibold shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </Button>
                      </div>
                    </div>

                    {/* Card Body Info */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>{meta.vibe}</span>
                          {compatibleStyles.length > 0 && (
                            <span className="text-[10px] text-cyan-400/90 font-mono">
                              +{compatibleStyles.length} style variants
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-white leading-snug group-hover:text-blue-400 transition">
                          {role.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {role.strategy}
                        </p>
                      </div>

                      {/* Feature Highlights Pills */}
                      <div className="pt-2.5 border-t border-white/5 flex flex-wrap gap-1">
                        {meta.features.slice(0, 2).map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-300 border border-white/5"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Direct CTA: Always visible for touch & mobile devices */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setPreviewRole(role)}
                          className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5 transition py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Interactive Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyTemplate(role, includeSampleContent)}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. FOOTER STATUS BAR */}
        <footer className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>✨ All 38 templates come pre-loaded with production assets &amp; responsive mobile frames.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs font-medium">
            Close Gallery
          </Button>
        </footer>
      </div>

      {/* FULLSCREEN INTERACTIVE LIVE PREVIEW SUB-MODAL */}
      {previewRole && PreviewLayoutComponent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${previewRole.title} live interactive preview`}
          className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-2xl flex flex-col animate-fadeIn select-none"
        >
          {/* Top Preview Control Bar */}
          <div className="h-16 px-4 sm:px-6 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-3 sm:gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => {
                  setPreviewRole(null);
                  setPreviewStyle('default');
                }}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white transition flex items-center gap-1.5 text-xs font-semibold shrink-0 border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Templates</span>
              </button>

              <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />

              <div className="min-w-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {previewRole.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-blue-300 border border-blue-500/30 shrink-0">
                    {previewRole.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block truncate">
                  {previewRole.strategy}
                </p>
              </div>
            </div>

            {/* Device Switcher, Sample Content Option & Apply Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Sample Content Option Switch */}
              <label
                className="hidden lg:flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition"
                title="When enabled, pre-fills projects and skills tailored to this role"
              >
                <input
                  type="checkbox"
                  checked={includeSampleContent}
                  onChange={(e) => setIncludeSampleContent(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#0c1df2] rounded cursor-pointer"
                />
                <span className="text-xs">Include sample content</span>
              </label>

              {/* Desktop / Mobile Viewport Switcher */}
              <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 px-2.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                    previewDevice === 'desktop'
                      ? 'bg-[#0c1df2] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop Viewport"
                  aria-label="Desktop Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 px-2.5 rounded-lg text-xs transition flex items-center gap-1.5 ${
                    previewDevice === 'mobile'
                      ? 'bg-[#0c1df2] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile Viewport"
                  aria-label="Mobile Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">Mobile</span>
                </button>
              </div>

              {/* Apply Template Primary Action CTA */}
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  handleApplyTemplate(previewRole, includeSampleContent, previewStyle)
                }
                className="gap-2 text-xs font-semibold shadow-sm shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Use This Template</span>
              </Button>

              <button
                type="button"
                onClick={() => {
                  setPreviewRole(null);
                  setPreviewStyle('default');
                }}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white transition border border-white/10"
                title="Close Preview (Esc)"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-bar: Compatible Design Style Variants */}
          {previewCompatibleStyles.length > 0 && (
            <div className="bg-slate-900/80 border-b border-white/10 px-4 sm:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto text-xs font-mono shrink-0">
              <div className="flex items-center gap-2 text-slate-400 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-xs text-slate-300 font-sans">
                  Design Variants ({previewCompatibleStyles.length} Compatible):
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setPreviewStyle('default')}
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
                    previewStyle === 'default'
                      ? 'bg-[#0c1df2] text-white font-medium shadow-sm border border-blue-400/40'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Default Interactive
                </button>
                {previewCompatibleStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setPreviewStyle(style.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                      previewStyle === style.id
                        ? 'bg-[#0c1df2] text-white font-medium shadow-sm border border-blue-400/40'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title={style.driver}
                  >
                    <span>{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Live Viewport Simulator */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex justify-center bg-slate-950">
            <div
              className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-white [transform:translateZ(0)] isolate ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-6xl'
              }`}
            >
              <PreviewLayoutComponent
                data={previewMockData}
                roleConfig={previewRoleConfig}
                isMobilePreview={previewDevice === 'mobile'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGalleryModal;
