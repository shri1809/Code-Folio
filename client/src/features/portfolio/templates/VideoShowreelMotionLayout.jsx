import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Film,
  Play,
  Pause,
  Maximize2,
  Volume2,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Sliders,
  Clapperboard,
  Video,
  MonitorPlay,
  Clock,
  Layers,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const VideoShowreelMotionLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

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

  const featuredProject = projects[activeVideoIdx] || projects[0] || null;

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Cinema Stage Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Production Studio Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-8 sm:p-10 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <Clapperboard className="w-3.5 h-3.5" />
                  {roleConfig?.title || 'Motion & Cinema Director'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                  4K UHD • 60 FPS
                </span>
                {user.isPro && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0c1df2] text-white">
                    PRO STUDIO
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Motion Designer'}
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
                    <span>Credits & CV</span>
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
                <span>Book Production</span>
              </Button>
            </div>
          </div>

          {/* Director Bio & Social Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-8">
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Crafting cinematic title sequences, 3D broadcast graphics, dynamic brand motion identities, and high-energy showreels.
                </p>
              )}

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                {profile.socialLinks?.youtube && (
                  <a
                    href={profile.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="YouTube Reel"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Instagram / Clips"
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
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Production Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Studio Specs */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Production Pipeline
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
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  ['After Effects', 'Cinema 4D', 'Blender', 'DaVinci Resolve', 'Octane Render', 'Redshift', 'Figma Motion'].map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* HERO SHOWREEL PLAYER */}
        <section className="mb-14">
          <div className="rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl relative group">
            <div className="relative aspect-video max-h-[580px] w-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src={
                  featuredProject?.screenshot ||
                  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80'
                }
                alt={featuredProject?.title || 'Featured Showreel'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80';
                }}
                className={`w-full h-full object-cover transition duration-700 ${
                  isPlaying ? 'scale-105 filter brightness-110' : 'filter brightness-75'
                }`}
              />

              {/* Central Cinema Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="pointer-events-auto w-20 h-20 rounded-full bg-[#0c1df2]/90 hover:bg-[#0c1df2] text-white flex items-center justify-center shadow-[0_0_40px_rgba(12,29,242,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>
              </div>

              {/* Player Chrome Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 flex flex-col gap-3">
                {/* Progress Scrub Bar */}
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className={`bg-gradient-to-r from-[#0c1df2] to-cyan-400 h-full transition-all duration-300 ${
                      isPlaying ? 'w-2/3' : 'w-1/4'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">
                      {isPlaying ? 'PLAYING 01:42' : 'PAUSED 00:00'}
                    </span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-400">03:15</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 text-[10px]">
                      PRORES 422 HQ
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {featuredProject?.liveLink && (
                      <a
                        href={featuredProject.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0c1df2] text-white font-sans text-xs font-bold hover:bg-[#0c1df2]/90 transition"
                      >
                        <span>Watch on Vimeo / YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <Maximize2 className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Reel Details */}
            {featuredProject && (
              <div className="p-6 bg-slate-900/80 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    {featuredProject.description || 'Motion graphics montage, procedural typography, and sound design sync.'}
                  </p>
                </div>
                {featuredProject.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {featuredProject.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.05] text-cyan-300 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* REEL BREAKDOWN / PROJECT REEL GRID */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-[#4251f7]" />
              <span>Project Reels & Shot Breakdowns</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} Works Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => {
              const isSelected = activeVideoIdx === idx;
              const screenshotUrl =
                proj.screenshot ||
                'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80';

              return (
                <div
                  key={idx}
                  onClick={() => setActiveVideoIdx(idx)}
                  className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 bg-slate-900/50 ${
                    isSelected
                      ? 'border-[#0c1df2] ring-2 ring-[#0c1df2]/50 shadow-[0_0_25px_rgba(12,29,242,0.3)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-video overflow-hidden bg-black group">
                    <img
                      src={screenshotUrl}
                      alt={proj.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center group-hover:scale-110 transition">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-300 backdrop-blur-sm">
                      Shot #{idx + 1}
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
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All motion reels copyright protected.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Powered by CodeFolio Pro</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Contact Director</span>
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

export default VideoShowreelMotionLayout;
