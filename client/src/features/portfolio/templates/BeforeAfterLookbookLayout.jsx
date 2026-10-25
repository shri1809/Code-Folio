import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Layers,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  SlidersHorizontal,
  SplitSquareVertical,
  Compass,
  Palette,
  Eye,
  CheckCircle2,
  Box,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const BeforeAfterLookbookLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const handleOpenContact = () => {
    if (onOpenContact) onOpenContact();
    else setIsContactOpen(true);
  };

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const featuredProject = projects[activeProjectIdx] || projects[0] || null;

  const beforeImage =
    featuredProject?.screenshot ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80';
  // Use a stylized alternative or the same with filter for After
  const afterImage =
    featuredProject?.screenshot ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&q=80';

  return (
    <div className="min-h-screen bg-[#080a12] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Background Accent */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:26px_26px] opacity-[0.06]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Architect / Brand Identity Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                  {roleConfig?.title || 'Brand & Spatial Design Director'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c1df2] text-white">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Spatial Designer'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                @{user.username} {user.customDomain && `• ${user.customDomain}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Specifications & CV</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenContact}
                className="gap-2 text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inquire Project</span>
              </Button>
            </div>
          </div>

          {/* Bio & Philosophy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#4251f7]" />
                <span>Spatial & Visual Philosophy</span>
              </h3>
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Transforming abstract concepts into tangible spaces, structural identities, high-fidelity 3D renders, and award-winning packaging designs.
                </p>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Studio Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Material Swatch / Toolkit */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Materials & Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ...(skills.frontend || []),
                    ...(skills.backend || []),
                    ...(skills.devops || []),
                  ].length > 0 ? (
                    [
                      ...(skills.frontend || []),
                      ...(skills.backend || []),
                      ...(skills.devops || []),
                    ].map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    ['AutoCAD', 'Rhino 3D', 'V-Ray', 'Sketchup', 'Revit', 'BIM Architecture', 'C4D'].map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Swatch Palette Preview */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Design Palette
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0c1df2] shadow-sm border border-white/20" title="#0c1df2" />
                  <div className="w-7 h-7 rounded-lg bg-slate-900 shadow-sm border border-white/20" title="#0f172a" />
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 shadow-sm border border-white/20" title="#10b981" />
                  <div className="w-7 h-7 rounded-lg bg-amber-400 shadow-sm border border-white/20" title="#fbbf24" />
                  <div className="w-7 h-7 rounded-lg bg-stone-300 shadow-sm border border-white/20" title="#d6d3d1" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#4251f7]" />
                <span>Interactive Before & After Transformation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Drag the divider below to inspect the wireframe / raw blueprint vs final executed render.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                Split: {sliderPosition}%
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl relative select-none">
            {/* Split Comparison Stage */}
            <div className="relative aspect-[16/9] w-full max-h-[580px] overflow-hidden">
              {/* "After" Image (Full background) */}
              <img
                src={afterImage}
                alt="After Transformation"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80';
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* "Before" Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={beforeImage}
                  alt="Before Transformation"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80';
                  }}
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                  style={{ width: '100%', maxWidth: 'none', height: '100%' }}
                />

                {/* Before Label Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md border border-white/20">
                  Concept / Raw Blueprint
                </div>
              </div>

              {/* After Label Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/90 text-white backdrop-blur-md border border-white/20">
                Executed / Final Render
              </div>

              {/* Range Slider Overlay Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Drag to compare before and after"
              />

              {/* Slider Handle Pill in the center */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20"
                style={{ left: `calc(${sliderPosition}% - 18px)` }}
              >
                <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center font-bold text-xs border border-slate-300">
                  ↔
                </div>
              </div>
            </div>

            {/* Active Project Meta footer */}
            {featuredProject && (
              <div className="p-6 bg-slate-900/80 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {featuredProject.description || 'Full-scope architectural remodeling, spatial lighting analysis, and interior styling.'}
                  </p>
                </div>
                {featuredProject.liveLink && (
                  <a
                    href={featuredProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="gap-2 text-xs">
                      <span>View Case Specs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* LOOKBOOK GALLERY */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-[#4251f7]" />
              <span>Transformation Lookbook Collection</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} Works
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => {
              const isSelected = activeProjectIdx === idx;
              const screenshotUrl =
                proj.screenshot ||
                `https://images.unsplash.com/photo-${1600585154000 + (idx % 5) * 100000}?w=800&q=80`;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveProjectIdx(idx)}
                  className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 bg-slate-900/50 ${
                    isSelected
                      ? 'border-[#0c1df2] ring-2 ring-[#0c1df2]/50 shadow-[0_0_25px_rgba(12,29,242,0.3)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 group">
                    <img
                      src={screenshotUrl}
                      alt={proj.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                        Lookbook #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {proj.title}
                    </h4>
                    {proj.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All spatial designs and renders protected.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Powered by CodeFolio Pro</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Contact Architect</span>
            </Button>
          </div>
        </footer>
      </div>

      {!onOpenContact && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          recipientEmail={user.email}
          username={user.username}
        />
      )}
    </div>
  );
};

export default BeforeAfterLookbookLayout;

