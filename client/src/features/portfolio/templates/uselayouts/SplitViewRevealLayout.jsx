import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  Palette,
  Film,
  Compass,
  Scissors,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const SplitViewRevealLayout = ({ data, roleConfig }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const isFilm = roleConfig?.id === 'film-editor';
  const isInterior = roleConfig?.id === 'interior-designer';
  const isMUA = roleConfig?.id === 'makeup-artist';

  const activeProject = projects[0] || {
    title: 'Flagship Transformation Project',
    description: 'Interactive before & after color grade, interior transition, and aesthetic makeover reveal.',
    techStack: ['DaVinci Resolve', 'ACEScc Color Science', 'Arri Alexa 35', 'Film Print LUT'],
    screenshot: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80',
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-teal-500/30 selection:text-white relative">
      {/* Ambient gradient lighting */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[400px] bg-teal-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-teal-400">
                <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Editorial & Spatial Transformation'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold">
                    PRO SPECIALIST
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Transformation Artist'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>CREDITS_CV.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE / BOOK DATES</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specializing in transformative visual split-views, before/after contrast, and meticulous aesthetic executions.' }}
            />
            <div className="flex items-center gap-2">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Interactive Before / After Split Slider Stage */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest">
                INTERACTIVE COMPARISON ENGINE // SPLIT: {sliderPosition}%
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{activeProject.title}</h2>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-white/5 font-mono text-xs self-start sm:self-auto">
              <button
                onClick={() => setSliderPosition(0)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sliderPosition === 0 ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                100% {isFilm ? 'Raw Log' : 'Before'}
              </button>
              <button
                onClick={() => setSliderPosition(50)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sliderPosition === 50 ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                50/50 Split
              </button>
              <button
                onClick={() => setSliderPosition(100)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  sliderPosition === 100 ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                100% {isFilm ? 'Final Grade' : 'After'}
              </button>
            </div>
          </div>

          {/* Interactive Split View Box */}
          <div className="relative aspect-[21/9] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 bg-black select-none">
            {/* Base / After Image (Full width underneath) */}
            <img
              src={activeProject.screenshot || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80'}
              alt="Final Transformed Output"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-600/80 backdrop-blur-md text-white uppercase tracking-wider shadow-md">
                {isFilm ? 'FINAL GRADE (REC.709)' : isInterior ? 'AFTER (FURNISHED)' : 'AFTER (EDITORIAL)'}
              </span>
            </div>

            {/* Before Layer (Clipped by sliderPosition) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeProject.screenshot || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=80'}
                alt="Original Before State"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-75 brightness-125"
                style={{ width: '100%', maxWidth: 'none', objectPosition: 'left center' }}
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-slate-300 uppercase tracking-wider border border-white/10">
                  {isFilm ? 'RAW ARRI LOG C' : isInterior ? 'BEFORE (RAW SPACE)' : 'BEFORE (RAW FACE)'}
                </span>
              </div>
            </div>

            {/* Split Divider Vertical Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
                &harr;
              </div>
            </div>

            {/* Transparent Range Input Slider Over Image */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Before/After Split Slider"
            />
          </div>

          {/* Description & Tech Tags */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {activeProject.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(activeProject.techStack || []).map((t, tidx) => (
                <span key={tidx} className="px-3 py-1 rounded-lg text-xs font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Other Projects in Directory */}
        {projects.length > 1 && (
          <section>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>More Projects in Transformation Portfolio</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(1).map((proj, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl hover:border-teal-500/40 transition-colors"
                >
                  {proj.screenshot && (
                    <div className="rounded-xl overflow-hidden aspect-video mb-4 border border-white/10">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h4 className="text-base font-bold text-white">{proj.title}</h4>
                  <p className="text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'artist'}
      />
    </div>
  );
};

export default SplitViewRevealLayout;
