import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Code,
  Cpu,
  Monitor,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';
import ImageWithFallback from '../../../../components/ImageWithFallback';

export const GlassmorphismLayout = ({ data, roleConfig, isMobilePreview = false }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white relative overflow-hidden">
      {/* Radiant Glass Ambient Orbs */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-indigo-600/15 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-purple-600/20 via-pink-600/15 to-transparent rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Subtle Glass Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {/* Frosted Glass Header Card */}
        <header className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-4 sm:p-8 md:p-10 mb-6 sm:mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] relative overflow-hidden">
          {/* Top highlight specular reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className={`flex flex-col justify-between gap-5 pb-6 border-b border-white/10 ${isMobilePreview ? '' : 'md:flex-row md:items-center'}`}>
            <div className="min-w-0 max-w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse shrink-0" />
                <span className="font-semibold tracking-wider uppercase break-words">
                  GLASSMORPHISM // {roleConfig?.title || 'UI Specialist & Frontend Architect'}
                </span>
                {user.isPro && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)] shrink-0">
                    PRO GLASS
                  </span>
                )}
              </div>
              <h1 className={`font-black text-white tracking-tight drop-shadow-sm break-words leading-tight ${
                isMobilePreview ? 'text-2xl sm:text-3xl' : 'text-2xl sm:text-4xl lg:text-5xl'
              }`}>
                {profile.name || user.username || 'Glassmorphism Architect'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 font-mono break-words">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs border-white/20 bg-white/5 backdrop-blur-xl">
                    <FileDown className="w-3.5 h-3.5 text-cyan-300" />
                    <span>CV / RESUME</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/30"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INITIATE CONTACT</span>
              </Button>
            </div>
          </div>

          <div className={`mt-5 flex flex-col justify-between gap-4 ${isMobilePreview ? '' : 'md:flex-row md:items-center'}`}>
            <div
              className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-3xl break-words"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Crafting ethereal, multi-layered interfaces with depth, frosted glass dispersion, and tactile glow.' }}
            />
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all border border-white/10 backdrop-blur-md shadow-sm"
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
                  className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-all border border-white/10 backdrop-blur-md shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Glass Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl w-fit max-w-full">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-cyan-500/80 to-indigo-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Showcase Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-cyan-500/80 to-indigo-600/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Glassmorphic Toolset
          </button>
        </div>

        {/* Content Pane */}
        {activeTab === 'projects' ? (
          <div className={`grid grid-cols-1 gap-5 sm:gap-6 ${isMobilePreview ? '' : 'md:grid-cols-2'}`}>
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-400/40 hover:shadow-[0_20px_45px_rgba(6,182,212,0.15)] transition-all group min-w-0"
              >
                <div>
                  <div className="rounded-2xl overflow-hidden aspect-video mb-5 border border-white/15 relative bg-slate-950/60 shadow-inner">
                    <ImageWithFallback
                      src={proj.screenshot || ''}
                      alt={proj.title || 'Project thumbnail'}
                      fallbackTitle={proj.title || 'Project Preview'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070913]/80 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      SPEC // 0{idx + 1}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors break-words">
                    {proj.title}
                  </h3>

                  <p className="text-slate-300 text-xs mt-2 leading-relaxed line-clamp-3 break-words">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    {(proj.techStack || []).map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.06] text-cyan-200 border border-white/10 break-words"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {proj.repoLink && (
                      <a
                        href={proj.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                        title="Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        <span>Live</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-5 sm:p-8 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Full-Stack &amp; Design System Capabilities</span>
            </h3>

            <div className={`grid grid-cols-1 gap-5 sm:gap-6 font-mono text-xs ${isMobilePreview ? '' : 'md:grid-cols-3'}`}>
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 min-w-0">
                <span className="text-cyan-400 font-bold block mb-3 uppercase text-[11px]">Frontend &amp; UI</span>
                <div className="flex flex-wrap gap-1.5">
                  {(skills.frontend || ['React', 'TypeScript', 'Tailwind', 'Glassmorphism UI', 'Framer Motion']).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 break-words">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 min-w-0">
                <span className="text-indigo-400 font-bold block mb-3 uppercase text-[11px]">Backend &amp; Data</span>
                <div className="flex flex-wrap gap-1.5">
                  {(skills.backend || ['Node.js', 'Express', 'PostgreSQL', 'GraphQL']).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 break-words">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 min-w-0">
                <span className="text-purple-400 font-bold block mb-3 uppercase text-[11px]">DevOps &amp; Cloud</span>
                <div className="flex flex-wrap gap-1.5">
                  {(skills.devops || ['Docker', 'AWS', 'Vercel', 'CI/CD']).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 break-words">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'creator'}
      />
    </div>
  );
};

export default GlassmorphismLayout;

