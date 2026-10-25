import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Power,
  RotateCw,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  Sparkles,
  Gauge,
  Cpu,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const SkeuomorphismLayout = ({ data, roleConfig }) => {
  const [powerOn, setPowerOn] = useState(true);
  const [knobLevel, setKnobLevel] = useState(75);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#1c1e24] text-slate-200 font-sans selection:bg-amber-600/30 selection:text-white relative">
      {/* Matte Leather / Brushed Surface Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#2d313b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Skeuomorphic Hardware Console Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#2c303a] to-[#1e2128] p-6 sm:p-10 mb-8 border border-white/10 shadow-[inset_0_2px_1px_rgba(255,255,255,0.25),inset_0_-3px_4px_rgba(0,0,0,0.8),0_25px_60px_rgba(0,0,0,0.7)] relative">
          {/* Metallic Corner Screws */}
          <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <span className="w-2 h-0.5 bg-slate-800 rotate-45 block" />
          </div>
          <div className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <span className="w-2 h-0.5 bg-slate-800 -rotate-12 block" />
          </div>
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <span className="w-2 h-0.5 bg-slate-800 rotate-90 block" />
          </div>
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <span className="w-2 h-0.5 bg-slate-800 rotate-30 block" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/40">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setPowerOn(!powerOn)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    powerOn
                      ? 'bg-emerald-500 shadow-[0_0_12px_#10b981,inset_0_1px_2px_rgba(255,255,255,0.8)]'
                      : 'bg-red-900/60 shadow-inner'
                  }`}
                  title="Toggle Hardware Power"
                >
                  <Power className="w-3 h-3 text-black" />
                </button>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400/90 drop-shadow">
                  TACTILE // {roleConfig?.title || 'Product & Hardware Industrial Designer'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.5)]">
                    PREMIUM GRADE
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {profile.name || user.username || 'Industrial Specialist'}
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-mono">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2.5 rounded-xl font-bold font-mono text-xs text-slate-200 bg-gradient-to-b from-[#3a3f4b] to-[#252830] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.6)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] transition-all flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>SPEC_SHEET.PDF</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs text-amber-200 bg-gradient-to-b from-[#c27803] to-[#8a5200] border border-amber-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_6px_14px_rgba(0,0,0,0.7)] active:translate-y-0.5 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ENGAGE CONSOLE</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Tactile industrial design, skeuomorphic physical instruments, and dimensional product architectures.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#383d47] to-[#22252c] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_6px_rgba(0,0,0,0.6)] active:translate-y-0.5 flex items-center justify-center text-slate-300 hover:text-white"
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
                  className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#383d47] to-[#22252c] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_6px_rgba(0,0,0,0.6)] active:translate-y-0.5 flex items-center justify-center text-slate-300 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Physical Instrument Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="rounded-3xl bg-gradient-to-b from-[#282c35] to-[#1c1f26] p-6 border border-white/10 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.6),0_15px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between relative"
            >
              <div>
                {proj.screenshot && (
                  <div className="rounded-2xl overflow-hidden aspect-video mb-5 border-2 border-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.1)] relative bg-black">
                    <img
                      src={proj.screenshot}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
                    MODULE // MOD-0{idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                </div>

                <h3 className="text-lg font-bold text-slate-100 drop-shadow">
                  {proj.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#181a20] text-slate-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {proj.liveLink && (
                  <a
                    href={proj.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>ACTIVATE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'creator'}
      />
    </div>
  );
};

export default SkeuomorphismLayout;

