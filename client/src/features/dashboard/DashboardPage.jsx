import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { templateMap, DefaultLayout, resolveTemplateComponent } from '../portfolio/templates';
import { ROLES, CATEGORIES, getRoleConfig, getRoleCompatibleStyles, DESIGN_STYLES, isSampleRoleName, getAuthenticUserName } from '../portfolio/rolesConfig';
import Button from '../../components/ui/Button';
import ErrorBoundary from '../../components/ErrorBoundary';
import { TemplateGalleryModal } from '../portfolio/TemplateGalleryModal';
import { ShareModal } from '../../components/ShareModal';
import { ProjectScreenshotUploader } from '../../components/ProjectScreenshotUploader';
import {
  Save,
  ExternalLink,
  Sparkles,
  Layers,
  User,
  Wrench,
  FolderGit2,
  Globe,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  Monitor,
  Smartphone,
  ShieldCheck,
  Search,
  Check,
  RotateCcw,
  Image as ImageIcon,
  Palette,
  Share2,
  Settings,
  Apple,
  Play,
  Code2,
} from 'lucide-react';

// Curated stock mockup presets for fast 1-click project styling (Canva / Adobe Portfolio style)
export const SCREENSHOT_PRESETS = [
  {
    name: 'Web App',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mobile UI',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Analytics',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Design System',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cloud Infra',
    url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cinema Reel',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  },
];

export const DashboardPage = () => {
  const { user, updateUserLocal } = useAuth();
  const [activeTab, setActiveTab] = useState('template'); // 'template' | 'profile' | 'skills' | 'projects'
  const [saveStatus, setSaveStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [mobileViewMode, setMobileViewMode] = useState('edit'); // 'edit' | 'preview'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { register, control, handleSubmit, watch, reset, setValue, getValues, formState: { isDirty } } = useForm({
    defaultValues: {
      templateId: user?.templateId || 'minimalist',
      customDomain: user?.customDomain || '',
      profile: {
        name: getAuthenticUserName(user?.name, user),
        bio: '',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          website: '',
        },
        resumeUrl: '',
      },
      skills: {
        frontendInput: '',
        backendInput: '',
        devopsInput: '',
      },
      projects: [],
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject, replace: replaceProjects } = useFieldArray({
    control,
    name: 'projects',
  });

  // Fetch initial portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await apiClient.get('/portfolio');
        if (res.data?.success && res.data.portfolio) {
          const p = res.data.portfolio;
          const u = res.data.user || {};

          // Determine authentic user Name: guarantees neither sample persona nor raw handle is used
          const authenticName = getAuthenticUserName(p.profile?.name, u.username ? u : user);

          reset({
            templateId: u.templateId || 'minimalist',
            customDomain: u.customDomain || '',
            profile: {
              name: authenticName,
              bio: p.profile?.bio || '',
              socialLinks: {
                github: p.profile?.socialLinks?.github || '',
                linkedin: p.profile?.socialLinks?.linkedin || '',
                twitter: p.profile?.socialLinks?.twitter || '',
                website: p.profile?.socialLinks?.website || '',
              },
              resumeUrl: p.profile?.resumeUrl || '',
            },
            skills: {
              frontendInput: (p.skills?.frontend || []).join(', '),
              backendInput: (p.skills?.backend || []).join(', '),
              devopsInput: (p.skills?.devops || []).join(', '),
            },
            projects: (p.projects || []).map((proj) => ({
              title: proj.title || '',
              description: proj.description || '',
              techStackInput: (proj.techStack || []).join(', '),
              repoLink: proj.repoLink || '',
              liveLink: proj.liveLink || '',
              appStoreLink: proj.appStoreLink || '',
              playStoreLink: proj.playStoreLink || '',
              screenshot: proj.screenshot || '',
            })),
          });
        }
      } catch (err) {
        console.error('Failed to load portfolio:', err.message);
      }
    };

    fetchPortfolio();
  }, [reset]);

  // Watch form state for real-time live preview
  const watchedValues = watch();

  // Authentic user display Name: guarantees neither sample persona nor raw handle is used
  const authenticUserName = getAuthenticUserName(watchedValues.profile?.name, user);

  // Convert watched inputs into portfolio format for LivePreview
  const livePreviewData = {
    user: {
      username: user?.username || 'developer',
      isPro: !!user?.isPro,
      templateId: watchedValues.templateId || 'minimalist',
      customDomain: watchedValues.customDomain || null,
    },
    portfolio: {
      profile: {
        name: authenticUserName,
        bio: watchedValues.profile?.bio || '',
        socialLinks: watchedValues.profile?.socialLinks || {},
        resumeUrl: watchedValues.profile?.resumeUrl || '',
      },
      skills: {
        frontend: (watchedValues.skills?.frontendInput || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        backend: (watchedValues.skills?.backendInput || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        devops: (watchedValues.skills?.devopsInput || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
      projects: (watchedValues.projects || []).map((p, idx) => ({
        id: idx,
        title: p.title || 'Untitled Project',
        description: p.description || '',
        techStack: (p.techStackInput || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        repoLink: p.repoLink || '',
        liveLink: p.liveLink || '',
        appStoreLink: p.appStoreLink || '',
        playStoreLink: p.playStoreLink || '',
        screenshot: p.screenshot || '',
      })),
    },
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    setSaveStatus({ type: '', text: '' });

    try {
      const authenticName = getAuthenticUserName(formData.profile?.name, user);

      const payload = {
        templateId: formData.templateId || 'minimalist',
        customDomain: formData.customDomain?.trim() || null,
        profile: {
          name: authenticName,
          bio: formData.profile?.bio || '',
          socialLinks: {
            github: formData.profile?.socialLinks?.github?.trim() || '',
            linkedin: formData.profile?.socialLinks?.linkedin?.trim() || '',
            twitter: formData.profile?.socialLinks?.twitter?.trim() || '',
            website: formData.profile?.socialLinks?.website?.trim() || '',
          },
          resumeUrl: formData.profile?.resumeUrl?.trim() || '',
        },
        skills: {
          frontend: (formData.skills?.frontendInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          backend: (formData.skills?.backendInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          devops: (formData.skills?.devopsInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        },
        projects: (formData.projects || [])
          .filter((p) => p && (p.title?.trim() || p.description?.trim()))
          .map((p) => ({
            title: p.title?.trim() || 'Untitled Project',
            description: p.description?.trim() || '',
            techStack: (p.techStackInput || '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            repoLink: p.repoLink?.trim() || '',
            liveLink: p.liveLink?.trim() || '',
            appStoreLink: p.appStoreLink?.trim() || '',
            playStoreLink: p.playStoreLink?.trim() || '',
            screenshot: p.screenshot?.trim() || '',
          })),
      };

      const res = await apiClient.put('/portfolio', payload);
      if (res.data?.success) {
        setSaveStatus({ type: 'success', text: 'Portfolio changes securely saved!' });
        updateUserLocal({
          templateId: formData.templateId,
          customDomain: formData.customDomain,
        });

        // HabitForge-style celebratory confetti shower!
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#0c1df2', '#00f3ff', '#38bdf8', '#818cf8', '#ffffff'],
        });

        // Gracefully clear success banner after 4 seconds
        setTimeout(() => {
          setSaveStatus((prev) => (prev.type === 'success' ? { type: '', text: '' } : prev));
        }, 4000);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to save portfolio changes.';
      setSaveStatus({
        type: 'error',
        text: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLoadRoleSampleData = (roleId) => {
    const config = getRoleConfig(roleId);
    if (!config || !config.sampleData) return;

    const sample = config.sampleData;
    setValue('templateId', roleId);

    // CRITICAL: Retain the user's authentic Name (e.g. 'Shridhar' or 'Shridhar Sharma'), NEVER raw username!
    const currentName = (getValues ? getValues('profile.name') : watchedValues.profile?.name)?.trim();
    const userRealName = getAuthenticUserName(currentName, user);

    setValue('profile.name', userRealName);

    if (sample.profile) {
      setValue('profile.bio', sample.profile.bio || '');
      setValue('profile.socialLinks.github', sample.profile.socialLinks?.github || '');
      setValue('profile.socialLinks.linkedin', sample.profile.socialLinks?.linkedin || '');
      setValue('profile.socialLinks.twitter', sample.profile.socialLinks?.twitter || '');
      setValue('profile.socialLinks.website', sample.profile.socialLinks?.website || '');
      if (sample.profile.resumeUrl) {
        setValue('profile.resumeUrl', sample.profile.resumeUrl);
      }
    }

    if (sample.skills) {
      setValue('skills.frontendInput', (sample.skills.frontend || []).join(', '));
      setValue('skills.backendInput', (sample.skills.backend || []).join(', '));
      setValue('skills.devopsInput', (sample.skills.devops || []).join(', '));
    }

    if (sample.projects) {
      const formattedProjects = sample.projects.map((proj) => ({
        title: proj.title || '',
        description: proj.description || '',
        techStackInput: (proj.techStack || []).join(', '),
        repoLink: proj.repoLink || '',
        liveLink: proj.liveLink || '',
        appStoreLink: proj.appStoreLink || '',
        playStoreLink: proj.playStoreLink || '',
        screenshot: proj.screenshot || '',
      }));
      setValue('projects', formattedProjects, { shouldDirty: true });
      if (replaceProjects) {
        replaceProjects(formattedProjects);
      }
    }

    setSaveStatus({
      type: 'success',
      text: `Loaded starter preset for ${config.title}! Click "Save Changes" to publish.`,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0c1df2', '#00f3ff', '#38bdf8'],
    });
  };

  const handleSelectTemplateFromGallery = (roleId, withSample) => {
    setValue('templateId', roleId);
    if (withSample) {
      handleLoadRoleSampleData(roleId);
    } else {
      setSaveStatus({
        type: 'success',
        text: `Applied template layout: ${roleId}! Click "Save Portfolio" to commit.`,
      });
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#0c1df2', '#00f3ff'],
      });
    }
  };

  const handleLoadRoleProjects = () => {
    const config = getRoleConfig(watchedValues.templateId);
    if (config?.sampleData?.projects?.length) {
      const formattedProjects = config.sampleData.projects.map((proj) => ({
        title: proj.title || '',
        description: proj.description || '',
        techStackInput: (proj.techStack || []).join(', '),
        repoLink: proj.repoLink || '',
        liveLink: proj.liveLink || '',
        appStoreLink: proj.appStoreLink || '',
        playStoreLink: proj.playStoreLink || '',
        screenshot: proj.screenshot || '',
      }));
      setValue('projects', formattedProjects, { shouldDirty: true });
      if (replaceProjects) {
        replaceProjects(formattedProjects);
      }
      setSaveStatus({
        type: 'success',
        text: `Pre-filled ${config.sampleData.projects.length} sample projects for ${config.title}!`,
      });
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#0c1df2', '#00f3ff', '#38bdf8'],
      });
    }
  };

  const filteredRoles = useMemo(() => {
    return ROLES.filter((role) => {
      const matchesCategory =
        selectedCategory === 'all' || role.category === selectedCategory;
      const q = roleSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        role.title.toLowerCase().includes(q) ||
        role.badge.toLowerCase().includes(q) ||
        role.strategy.toLowerCase().includes(q) ||
        role.archetype.toLowerCase().includes(q) ||
        (role.sampleData?.profile?.bio && role.sampleData.profile.bio.toLowerCase().includes(q)) ||
        (role.sampleData?.skills?.frontend && role.sampleData.skills.frontend.some((s) => s.toLowerCase().includes(q))) ||
        (role.sampleData?.skills?.backend && role.sampleData.skills.backend.some((s) => s.toLowerCase().includes(q))) ||
        (role.sampleData?.skills?.devops && role.sampleData.skills.devops.some((s) => s.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, roleSearchQuery]);

  const currentTemplate = watchedValues.templateId || 'fullstack-developer';
  const activeRoleBaseId = currentTemplate.includes('--')
    ? currentTemplate.split('--')[0]
    : currentTemplate;

  const { ActiveLayout, activeRoleConfig, compatibleDesignStyles } = useMemo(() => {
    return {
      ActiveLayout: resolveTemplateComponent(currentTemplate),
      activeRoleConfig: getRoleConfig(activeRoleBaseId),
      compatibleDesignStyles: getRoleCompatibleStyles(activeRoleBaseId),
    };
  }, [currentTemplate, activeRoleBaseId]);

  return (
    <div className="h-screen max-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Ambient Glass Glow Lighting (restrained, modern developer tool atmosphere) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0c1df2]/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px]" />
      </div>

      {/* Top Action Bar */}
      <div className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between shrink-0 relative z-20 shadow-sm min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group mr-1 shrink-0" title="Back to CodeFolio Home">
            <div className="p-1.5 bg-gradient-to-br from-[#0c1df2] to-[#2031f4] rounded-lg text-white shadow-sm border border-white/20 group-hover:scale-105 transition-transform duration-200">
              <Code2 className="w-4 h-4 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
            </div>
            <span className="hidden sm:inline text-sm font-bold tracking-tight text-white group-hover:text-blue-400 transition">
              Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Folio</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono shrink-0">
            <span className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} aria-hidden="true"></span>
            <span className="text-slate-300 font-medium truncate max-w-[90px] sm:max-w-none">
              BUILDER // @{user?.username}
            </span>
          </div>

          {isDirty && !saving && saveStatus.type !== 'success' && (
            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true"></span>
              <span>Unsaved changes</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-[11px] font-mono text-cyan-300 transition shrink-0"
            title="Click to copy & share portfolio link"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>/u/{user?.username}</span>
          </button>

          {saveStatus.text && (
            <div
              role={saveStatus.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={`flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl backdrop-blur-md shrink-0 animate-fade-in ${
                saveStatus.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'bg-red-500/15 text-red-300 border border-red-500/30'
              }`}
            >
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="font-medium truncate max-w-[100px] sm:max-w-xs">{saveStatus.text}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setIsGalleryOpen(true)}
            className="gap-1.5 text-cyan-300 hover:text-white border-cyan-500/30 px-2 sm:px-3"
            title="Template Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-medium">Template Studio</span>
          </Button>

          <a
            href={`/u/${user?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="glass" size="sm" className="gap-1.5" title="Public View">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-medium">Public View</span>
            </Button>
          </a>

          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setIsShareOpen(true)}
            className="hidden sm:inline-flex gap-1.5 text-slate-200 hover:text-white"
            title="Share portfolio link"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline font-medium">Share</span>
          </Button>

          <Link to="/settings" title="Profile & Account Settings">
            <Button
              type="button"
              variant="glass"
              size="sm"
              className="gap-1.5 text-slate-300 hover:text-white px-2 sm:px-3"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </Button>
          </Link>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            loading={saving}
            variant="primary"
            size="sm"
            aria-label="Save Portfolio"
            className="gap-1.5 px-3 sm:px-3.5 font-semibold"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Portfolio</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Mobile Segmented View Switcher: Edit | Preview (Visible only on < lg screens) */}
      <div className="lg:hidden border-b border-white/10 bg-slate-950/90 backdrop-blur-xl px-4 py-2 shrink-0 z-20">
        <div
          className="flex p-1 bg-slate-900/80 rounded-xl border border-white/10 max-w-xs mx-auto"
          role="tablist"
          aria-label="Mobile workspace view mode"
        >
          <button
            type="button"
            role="tab"
            id="mobile-view-tab-edit"
            aria-selected={mobileViewMode === 'edit'}
            aria-controls="mobile-view-panel-edit"
            onClick={() => setMobileViewMode('edit')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 ${
              mobileViewMode === 'edit'
                ? 'bg-[#0c1df2] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            role="tab"
            id="mobile-view-tab-preview"
            aria-selected={mobileViewMode === 'preview'}
            aria-controls="mobile-view-panel-preview"
            onClick={() => setMobileViewMode('preview')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 ${
              mobileViewMode === 'preview'
                ? 'bg-[#0c1df2] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10">
        {/* LEFT PANE: FORM BUILDER */}
        <div
          id="mobile-view-panel-edit"
          role="region"
          aria-labelledby="mobile-view-tab-edit"
          className={`lg:col-span-5 min-w-0 border-r border-white/10 bg-slate-900/50 backdrop-blur-xl flex-col h-full lg:h-full min-h-0 overflow-y-auto overflow-x-hidden ${
            mobileViewMode === 'edit' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Section Tabs */}
          <div
            className="flex border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 shrink-0"
          >
            <button
              type="button"
              id="builder-tab-template"
              aria-pressed={activeTab === 'template'}
              onClick={() => setActiveTab('template')}
              className={`flex-1 py-3 sm:py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                activeTab === 'template'
                  ? 'border-[#0c1df2] text-white bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Theme &amp; Pro</span>
            </button>
            <button
              type="button"
              id="builder-tab-profile"
              aria-pressed={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 sm:py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                activeTab === 'profile'
                  ? 'border-[#0c1df2] text-white bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Profile</span>
            </button>
            <button
              type="button"
              id="builder-tab-skills"
              aria-pressed={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-3 sm:py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                activeTab === 'skills'
                  ? 'border-[#0c1df2] text-white bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Skills</span>
            </button>
            <button
              type="button"
              id="builder-tab-projects"
              aria-pressed={activeTab === 'projects'}
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-3 sm:py-3.5 text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                activeTab === 'projects'
                  ? 'border-[#0c1df2] text-white bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Projects</span>
            </button>
          </div>

          {/* Form Content */}
          <form className="p-6 space-y-6">
            {/* TAB 1: TEMPLATE & PRO SETTINGS */}
            {activeTab === 'template' && (
              <div role="tabpanel" id="builder-panel-template" aria-labelledby="builder-tab-template" className="space-y-6">
                {/* Canva / Wix Inspired Template Studio Banner */}
                <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/80 backdrop-blur-md mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                        <span>Canva &amp; Wix Studio</span>
                      </span>
                      <span className="text-xs font-mono text-cyan-300 font-semibold">38 Curated Layouts</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Visual Template Library &amp; Device Previews</h3>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      Explore rich templates across Tech, Visual Arts, Media &amp; Writing with real-time mobile/desktop simulators and 1-click starter content.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setIsGalleryOpen(true)}
                    className="gap-2 text-xs font-semibold shrink-0 shadow-sm whitespace-nowrap"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Browse Template Library</span>
                  </Button>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Choose Portfolio Theme & Role Template (38 Roles)</h3>
                      <p className="text-xs text-slate-400">
                        Tailors your layout architecture, telemetry, and portfolio presentation.
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 font-medium">
                      Active: {activeRoleConfig?.title || watchedValues.templateId}
                    </span>
                  </div>

                  {/* Active Role Preset Action Banner */}
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30">
                          {activeRoleConfig?.badge || 'Selected Preset'}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {activeRoleConfig?.title || watchedValues.templateId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {activeRoleConfig?.strategy || 'Customized portfolio structure and layout.'}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleLoadRoleSampleData(watchedValues.templateId)}
                      className="gap-2 text-xs font-mono shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Load Sample Content</span>
                    </Button>
                  </div>

                  {/* Compatible Design Style Variants (PDF Specification) */}
                  {compatibleDesignStyles.length > 0 && (
                    <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md mb-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-semibold text-slate-200">
                            Design Style Variants for {activeRoleConfig?.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 font-medium">
                          {compatibleDesignStyles.length} Styles Compatible
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">
                        Choose a distinct visual design language defined in the Master UI/UX Compatibility Matrix:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {/* Default Interactive button */}
                        <button
                          type="button"
                          onClick={() => setValue('templateId', activeRoleBaseId, { shouldDirty: true })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            currentTemplate === activeRoleBaseId
                              ? 'bg-[#0c1df2] text-white shadow-sm border border-blue-400/40'
                              : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-white/10'
                          }`}
                        >
                          Default Interactive
                        </button>

                        {/* Compatible Design Style Buttons */}
                        {compatibleDesignStyles.map((style) => {
                          const styleCompoundId = `${activeRoleBaseId}--${style.id}`;
                          const isStyleActive =
                            currentTemplate === styleCompoundId ||
                            currentTemplate === style.id;

                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => setValue('templateId', styleCompoundId, { shouldDirty: true })}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                                isStyleActive
                                  ? 'bg-[#0c1df2] text-white shadow-sm border border-blue-400/40'
                                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-white/10'
                              }`}
                              title={style.driver}
                            >
                              <span>{style.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search roles (e.g. Backend, UI/UX, Photographer, SEO)..."
                      value={roleSearchQuery}
                      onChange={(e) => setRoleSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900/70 border border-white/10 hover:border-white/20 focus:border-[#0c1df2] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          selectedCategory === cat.id
                            ? 'bg-[#0c1df2] text-white font-medium shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable Role Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {filteredRoles.map((role) => {
                      const isSelected = watchedValues.templateId === role.id;
                      return (
                        <div
                          key={role.id}
                          onClick={() => setValue('templateId', role.id)}
                          className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                            isSelected
                              ? 'border-[#0c1df2] bg-[#0c1df2]/10 text-white shadow-sm ring-1 ring-[#0c1df2]'
                              : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:bg-slate-800/40 hover:text-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1.5">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-cyan-300 border border-white/5">
                                {role.badge}
                              </span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-[#0c1df2] text-white flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                            <h4 className="text-xs font-semibold text-white leading-snug">
                              {role.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                            <span className="text-slate-400 font-mono capitalize">
                              {role.archetype.replace('-', ' ')}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadRoleSampleData(role.id);
                              }}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition"
                              title="Pre-fill sample data for this role"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Sample</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legacy Themes Section */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold text-slate-300 block mb-2.5">
                    Minimalist &amp; Legacy Themes
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Minimalist */}
                    <button
                      type="button"
                      onClick={() => setValue('templateId', 'minimalist')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                        watchedValues.templateId === 'minimalist'
                          ? 'border-[#0c1df2] bg-[#0c1df2]/10 text-white shadow-sm ring-1 ring-[#0c1df2]'
                          : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold text-white">Minimalist</span>
                      <span className="text-[11px] text-slate-400">Clean typography</span>
                    </button>

                    {/* Cyberpunk */}
                    <button
                      type="button"
                      onClick={() => setValue('templateId', 'cyberpunk')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                        watchedValues.templateId === 'cyberpunk'
                          ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-sm ring-1 ring-cyan-500'
                          : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold text-cyan-400">Cyberpunk</span>
                      <span className="text-[11px] text-slate-400">Neon grid</span>
                    </button>

                    {/* Corporate */}
                    <button
                      type="button"
                      onClick={() => setValue('templateId', 'corporate')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                        watchedValues.templateId === 'corporate'
                          ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm ring-1 ring-blue-500'
                          : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold text-blue-400">Corporate</span>
                      <span className="text-[11px] text-slate-400">Executive grid</span>
                    </button>
                  </div>
                </div>

                {/* Color Accent Palette Inspiration */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-semibold text-slate-300">
                        Color Harmonies &amp; Accents
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Adaptive Style Tokens</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { name: 'HabitForge Cobalt', color: 'bg-[#0c1df2]' },
                      { name: 'Cyber Cyan', color: 'bg-cyan-400' },
                      { name: 'Emerald Matrix', color: 'bg-emerald-500' },
                      { name: 'Electric Violet', color: 'bg-purple-500' },
                      { name: 'Sunset Rose', color: 'bg-rose-500' },
                      { name: 'Solar Amber', color: 'bg-amber-500' },
                    ].map((palette) => (
                      <div
                        key={palette.name}
                        className="p-2 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center gap-1.5 text-center group hover:bg-slate-800/50 hover:border-white/10 transition cursor-default"
                        title={palette.name}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${palette.color} shadow-sm group-hover:scale-110 transition`} />
                        <span className="text-[10px] text-slate-400 font-mono leading-tight truncate w-full">
                          {palette.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Custom Domain */}
                <div className="pt-5 border-t border-white/10">
                  <div className="p-4 rounded-xl border border-white/10 bg-slate-900/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-semibold text-white">Custom Domain Mapping</h4>
                      </div>
                      {user?.isPro ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PRO ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/10">
                          PRO REQUIRED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-3">
                      Map your vanity domain (e.g., <code>john.com</code>) directly to your portfolio.
                    </p>

                    <input
                      type="text"
                      disabled={!user?.isPro}
                      placeholder={user?.isPro ? "e.g. yourname.com" : "Upgrade to Pro to map custom domains"}
                      {...register('customDomain')}
                      className="w-full px-3.5 py-2.5 glass-input disabled:opacity-50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    />
                    {!user?.isPro && (
                      <p className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Custom domains require an active CodeFolio Pro subscription.</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <div role="tabpanel" id="builder-panel-profile" aria-labelledby="builder-tab-profile" className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder={getAuthenticUserName(user?.name, user) || 'Your Full Name'}
                    {...register('profile.name')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Bio &amp; Professional Statement
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Senior Full-Stack Engineer specializing in scalable web systems..."
                    {...register('profile.bio')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition resize-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      {...register('profile.socialLinks.github')}
                      className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      {...register('profile.socialLinks.linkedin')}
                      className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Twitter / X URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/username"
                      {...register('profile.socialLinks.twitter')}
                      className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1.5">
                      Personal Website
                    </label>
                    <input
                      type="text"
                      placeholder="https://yoursite.com"
                      {...register('profile.socialLinks.website')}
                      className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1.5">
                    Resume / CV Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://codefolio.dev/resumes/my-resume.pdf"
                    {...register('profile.resumeUrl')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS SETTINGS */}
            {activeTab === 'skills' && (
              <div role="tabpanel" id="builder-panel-skills" aria-labelledby="builder-tab-skills" className="space-y-4">
                <p className="text-xs text-slate-400">
                  Separate each skill with a comma (e.g., <code>React, TypeScript, Next.js</code>).
                </p>

                <div>
                  <label className="block text-xs font-medium text-cyan-300 mb-1.5">
                    Frontend Skills
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Next.js, Tailwind CSS"
                    {...register('skills.frontendInput')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-blue-300 mb-1.5">
                    Backend Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Node.js, Express, MongoDB, PostgreSQL"
                    {...register('skills.backendInput')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-300 mb-1.5">
                    DevOps &amp; Cloud Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Docker, Kubernetes, AWS, CI/CD"
                    {...register('skills.devopsInput')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: PROJECTS SETTINGS */}
            {activeTab === 'projects' && (
              <div role="tabpanel" id="builder-panel-projects" aria-labelledby="builder-tab-projects" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Project Showcase</h4>
                    <p className="text-xs text-slate-400">Highlight your best software contributions</p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      appendProject({
                        title: '',
                        description: '',
                        techStackInput: '',
                        repoLink: '',
                        liveLink: '',
                        appStoreLink: '',
                        playStoreLink: '',
                        screenshot: '',
                      })
                    }
                    className="gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </Button>
                </div>

                {projectFields.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center flex flex-col items-center justify-center gap-3">
                    <p className="text-xs text-slate-500 italic">No projects added yet.</p>
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      onClick={handleLoadRoleProjects}
                      className="gap-2 text-xs font-mono text-cyan-300 border-cyan-500/30"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Quick Start: Load 3 Projects for {activeRoleConfig?.title || 'Selected Role'}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 glass-card rounded-2xl space-y-3.5 relative border border-white/10 hover:border-white/15 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold font-mono text-blue-400 tracking-wider">
                            PROJECT #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-slate-400 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-500/10"
                            title="Remove project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-200 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Distributed Task Queue"
                            {...register(`projects.${index}.title`)}
                            className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-200 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Brief architectural overview..."
                            {...register(`projects.${index}.description`)}
                            className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-200 mb-1">
                            Tech Stack (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="React, Go, Redis"
                            {...register(`projects.${index}.techStackInput`)}
                            className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-200 mb-1">
                              Repo Link
                            </label>
                            <input
                              type="text"
                              placeholder="https://github.com/..."
                              {...register(`projects.${index}.repoLink`)}
                              className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-200 mb-1">
                              Live Demo Link
                            </label>
                            <input
                              type="text"
                              placeholder="https://app.demo.com"
                              {...register(`projects.${index}.liveLink`)}
                              className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                            />
                          </div>
                        </div>

                        {/* Mobile App Store & Google Play Store Links (Optional for iOS / Android deployments) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-slate-200 mb-1 flex items-center gap-1.5">
                              <Apple className="w-3 h-3 text-slate-300" />
                              <span>App Store Link (iOS - Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://apps.apple.com/app/..."
                              {...register(`projects.${index}.appStoreLink`)}
                              className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-200 mb-1 flex items-center gap-1.5">
                              <Play className="w-3 h-3 fill-current text-emerald-400" />
                              <span>Play Store Link (Android - Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="https://play.google.com/store/apps/..."
                              {...register(`projects.${index}.playStoreLink`)}
                              className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <ProjectScreenshotUploader
                            value={watchedValues.projects?.[index]?.screenshot || ''}
                            onChange={(newUrl) => setValue(`projects.${index}.screenshot`, newUrl, { shouldDirty: true })}
                            username={user?.username}
                            index={index}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT PANE: REAL-TIME LIVE PREVIEW */}
        <div
          id="mobile-view-panel-preview"
          role="region"
          aria-labelledby="mobile-view-tab-preview"
          className={`lg:col-span-7 min-w-0 bg-slate-950 flex-col h-full lg:h-full min-h-0 overflow-hidden ${
            mobileViewMode === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="h-11 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Eye className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-white shrink-0">Real-Time Live Preview</span>
              <span className="text-[10px] text-slate-400 font-mono truncate hidden sm:inline">
                [Theme: <span className="text-cyan-400 font-medium">{watchedValues.templateId}</span>]
              </span>
            </div>

            <div
              role="group"
              aria-label="Preview device viewport"
              className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 shrink-0"
            >
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                aria-pressed={previewDevice === 'desktop'}
                className={`p-1.5 rounded-lg text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  previewDevice === 'desktop' ? 'bg-[#0c1df2] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Desktop View"
                aria-label="Desktop Preview Device"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                aria-pressed={previewDevice === 'mobile'}
                className={`p-1.5 rounded-lg text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  previewDevice === 'mobile' ? 'bg-[#0c1df2] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Mobile View"
                aria-label="Mobile Preview Device"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 flex justify-center bg-slate-950/90">
            <div
              className={`transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-white/10 bg-white [transform:translateZ(0)] isolate w-full ${
                previewDevice === 'mobile' ? 'max-w-[375px]' : 'max-w-none'
              }`}
            >
              <ErrorBoundary
                fallback={(error, resetError) => (
                  <div className="p-8 text-center text-slate-200 bg-slate-900 min-h-[300px] flex flex-col items-center justify-center rounded-xl">
                    <p className="font-bold text-amber-400 mb-1 text-sm">Preview Notice</p>
                    <p className="text-xs text-slate-400 mb-4 max-w-sm leading-relaxed">
                      Unable to render template with current inputs. Check project, skill, or profile details.
                    </p>
                    <button
                      type="button"
                      onClick={resetError}
                      className="px-3 py-1.5 bg-[#0c1df2] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Retry Preview
                    </button>
                  </div>
                )}
              >
                <ActiveLayout
                  data={livePreviewData}
                  roleConfig={activeRoleConfig}
                  isMobilePreview={previewDevice === 'mobile' || mobileViewMode === 'preview'}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* CANVA / WIX / ADOBE PORTFOLIO TEMPLATE GALLERY STUDIO MODAL */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        currentTemplateId={watchedValues.templateId}
        currentUserName={authenticUserName}
        onSelectTemplate={handleSelectTemplateFromGallery}
      />

      {/* SHARE PORTFOLIO MODAL */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={user?.username}
        customDomain={watchedValues.customDomain}
      />
    </div>
  );
};

export default DashboardPage;
