import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Sparkles,
  Check,
  ChevronDown,
  ExternalLink,
  Layers,
  ArrowRight,
  Palette,
} from 'lucide-react';
import {
  ROLES,
  CATEGORIES,
  DESIGN_STYLES,
  getRoleConfig,
  getRoleCompatibleStyles,
  getAuthenticUserName,
} from './rolesConfig';
import {
  templateMap,
  DefaultLayout,
  resolveTemplateComponent,
} from './templates';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

export const RoleShowcasePage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deviceViewport, setDeviceViewport] = useState('desktop'); // desktop | tablet | mobile
  const [activeStyleId, setActiveStyleId] = useState('default'); // 'default' or a design style id

  // Resolve base role config
  const activeRole = getRoleConfig(roleId) || ROLES[0];
  const compatibleStyles = getRoleCompatibleStyles(activeRole.id);

  // Compute active template key
  const activeTemplateKey =
    activeStyleId === 'default'
      ? activeRole.id
      : `${activeRole.id}--${activeStyleId}`;

  const ActiveLayoutComponent = resolveTemplateComponent(activeTemplateKey);

  // Build realistic sample data payload
  const sampleData = {
    user: {
      username:
        user?.username ||
        activeRole.sampleData?.profile?.name?.toLowerCase().replace(/\s+/g, '') ||
        'creator',
      isPro: true,
      templateId: activeTemplateKey,
      customDomain: null,
    },
    portfolio: {
      profile: {
        ...(activeRole.sampleData?.profile || {}),
        name: user?.username ? getAuthenticUserName(user?.name, user) : (activeRole.sampleData?.profile?.name || 'Creator'),
      },
      skills: activeRole.sampleData?.skills || { frontend: [], backend: [], devops: [] },
      projects: activeRole.sampleData?.projects || [],
      customCSS: '',
    },
  };

  const handleUseTemplate = () => {
    if (user) {
      navigate('/dashboard', { state: { preselectTemplate: activeTemplateKey } });
    } else {
      navigate('/register', { state: { preselectTemplate: activeTemplateKey } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Helmet>
        <title>{`${activeRole.title} Portfolio Template | CodeFolio`}</title>
        <meta
          name="description"
          content={`Live interactive showcase for ${activeRole.title} animated portfolio template with custom architecture and layouts.`}
        />
      </Helmet>

      {/* Floating Studio Control Topbar */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold uppercase">
                SHOWCASE
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {activeRole.title}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {activeRole.strategy}
            </p>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDeviceViewport('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceViewport('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceViewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceViewport('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Role Switcher & Use Button */}
        <div className="flex items-center gap-3">
          {/* Quick Role Selector Dropdown */}
          <div className="relative">
            <select
              value={activeRole.id}
              onChange={(e) => {
                setActiveStyleId('default');
                navigate(`/showcase/${e.target.value}`);
              }}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleUseTemplate}
            className="gap-2 text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Use This Template</span>
          </Button>
        </div>
      </div>

      {/* Sub-bar: Design Style Variants (PDF Specification) */}
      {compatibleStyles.length > 0 && (
        <div className="bg-slate-900/70 border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold uppercase text-[10px] tracking-wider text-slate-300">
              Design Style Variants ({compatibleStyles.length}):
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveStyleId('default')}
              className={`px-3 py-1 rounded-lg transition-all text-xs ${
                activeStyleId === 'default'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Default Interactive
            </button>

            {compatibleStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setActiveStyleId(style.id)}
                className={`px-3 py-1 rounded-lg transition-all text-xs flex items-center gap-1.5 ${
                  activeStyleId === style.id
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title={style.driver}
              >
                <span>{style.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex justify-center bg-slate-950 p-0 sm:p-4 transition-all">
        <div
          className={`w-full transition-all duration-300 ${
            deviceViewport === 'mobile'
              ? 'max-w-[420px] my-6 rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-black'
              : deviceViewport === 'tablet'
              ? 'max-w-[820px] my-6 rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-black'
              : 'max-w-full'
          }`}
        >
          <ActiveLayoutComponent data={sampleData} roleConfig={activeRole} />
        </div>
      </div>
    </div>
  );
};

export default RoleShowcasePage;
