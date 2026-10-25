import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Play,
  RotateCcw,
  Sparkles,
  Maximize2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Gamepad2,
  Layers,
  Box,
  Eye,
  Sliders,
  Flame,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const HoverDragRevealLayout = ({ data, roleConfig }) => {
  const [activeMode, setActiveMode] = useState('final'); // 'final' or 'wireframe'
  const [isPlayingShowreel, setIsPlayingShowreel] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 font-sans selection:bg-rose-600/30 selection:text-white relative">
      {/* Background ambient red/rose glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-rose-400">
                <Gamepad2 className="w-4 h-4 text-rose-500" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Motion & 3D Interactive Animation'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold">
                    PRO STUDIO
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || '3D Motion Artist'}
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
                className="gap-2 text-xs bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE SHOWREEL</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specializing in real-time 3D animation, clay wireframe breakdowns, and cinematic game mechanics.' }}
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

          {/* Engine Specs Strip */}
          <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">PIPELINE ENGINE</span>
              <span className="font-bold text-rose-400">Unreal Engine 5.4</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">FRAME TARGET</span>
              <span className="font-bold text-white">60 / 120 FPS Realtime</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">TEXTURE PIPELINE</span>
              <span className="font-bold text-amber-400">8K Nanite & UDIM</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">PHYSICS & RIGGING</span>
              <span className="font-bold text-white">Houdini Vellum & Chaos</span>
            </div>
          </div>
        </header>

        {/* 4K Showreel Stage with Mode Switcher (Wireframe vs Final Render) */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-rose-400 tracking-wider">
                FEATURED CINEMATIC SHOWREEL
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">Interactive Viewport & Shader Pass</h2>
            </div>

            {/* Toggle Wireframe vs Final */}
            <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-white/5 self-start sm:self-auto font-mono text-xs">
              <button
                onClick={() => setActiveMode('final')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeMode === 'final' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lit Final Render
              </button>
              <button
                onClick={() => setActiveMode('wireframe')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeMode === 'wireframe' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clay / Wireframe
              </button>
            </div>
          </div>

          {/* Viewport Frame */}
          <div className="relative aspect-[21/9] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-950 group">
            <img
              src={projects[0]?.screenshot || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80'}
              alt="Cinematic Showreel"
              className={`w-full h-full object-cover transition-all duration-500 ${
                activeMode === 'wireframe' ? 'grayscale contrast-200 invert' : ''
              }`}
            />

            {/* Overlay Shader Mode Badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                SHADER: {activeMode.toUpperCase()}
              </span>
            </div>

            {/* Centered Play Pulse Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlayingShowreel(!isPlayingShowreel)}
                className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/40"
              >
                <Play className="w-6 h-6 ml-1 fill-white" />
              </motion.button>
            </div>

            {/* Bottom Scrubber simulation */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>01:42 / 03:15 (4K 60FPS Pro-Res 4444)</span>
              </div>
              <span>HDR10 REC.2020</span>
            </div>
          </div>
        </section>

        {/* Draggable Interactive Asset Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <span>Interactive Assets & Character Models (Drag to Interact)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Physics enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                drag
                dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ cursor: 'grabbing' }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl hover:border-rose-500/40 transition-colors flex flex-col justify-between cursor-grab"
              >
                <div>
                  {proj.screenshot && (
                    <div className="rounded-xl overflow-hidden aspect-video mb-4 border border-white/10 relative">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-rose-300 border border-white/10">
                        ASSET 0{idx + 1}
                      </div>
                    </div>
                  )}

                  <h4 className="text-lg font-bold text-white">{proj.title}</h4>
                  <p className="text-slate-300 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                      <span key={tidx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.liveLink && (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <span>Showreel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'artist'}
      />
    </div>
  );
};

export default HoverDragRevealLayout;
