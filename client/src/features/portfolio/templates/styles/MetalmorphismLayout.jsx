import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Shield,
  Layers,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const MetalmorphismLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#0e1014] text-slate-200 font-mono selection:bg-slate-300 selection:text-slate-900 p-4 sm:p-8">
      {/* Brushed Steel Hairline Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1c2029_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Titanium Brushed Chassis Header */}
        <header className="rounded-2xl border border-slate-400/30 bg-gradient-to-b from-[#2b303c] via-[#1a1d24] to-[#121419] p-6 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.8)] relative">
          {/* Chrome Edge Vector Highlights */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
                <Cpu className="w-4 h-4 text-slate-300" />
                <span className="uppercase tracking-widest text-slate-400">
                  METALMORPHISM // {roleConfig?.title || 'System Architect & Core Hardware Dev'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded text-[10px] bg-gradient-to-r from-slate-200 to-slate-400 text-black font-extrabold uppercase shadow-sm">
                    CHROME TIER
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {profile.name || user.username || 'Core Architect'}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                {user.customDomain ? `CHASSIS_ID: @${user.username} // ${user.customDomain}` : `CHASSIS_ID: @${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-b from-[#3a4050] to-[#20242e] border border-slate-400/40 text-xs text-slate-200 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.5)] active:translate-y-0.5 transition-all flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5 text-slate-300" />
                    <span>SYS_ARCH.PDF</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#e2e8f0] to-[#94a3b8] text-black font-extrabold text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_12px_rgba(0,0,0,0.7)] active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>LINK_COMMS</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'High-performance low-level systems, kernel optimization, and brushed titanium hardware aesthetics.' }}
            />
            <div className="flex items-center gap-3 font-mono">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-[#1a1d24] border border-slate-600/50 text-slate-300 hover:text-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
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
                  className="p-2.5 rounded-lg bg-[#1a1d24] border border-slate-600/50 text-slate-300 hover:text-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Metallic Cards Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-400/25 bg-gradient-to-b from-[#222732] to-[#151820] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.7),0_15px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between"
            >
              <div>
                {proj.screenshot && (
                  <div className="rounded-xl overflow-hidden aspect-video mb-4 border border-slate-500/30 bg-black">
                    <img
                      src={proj.screenshot}
                      alt={proj.title}
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    UNIT_NODE // 0{idx + 1}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                </div>

                <h3 className="text-lg font-bold text-white uppercase">{proj.title}</h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed font-sans">
                  {proj.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="px-2 py-0.5 rounded text-[10px] bg-[#111318] text-slate-300 border border-slate-600/30"
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-200 hover:text-white"
                  >
                    <span>TRACE</span>
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
        username={user.username || 'architect'}
      />
    </div>
  );
};

export default MetalmorphismLayout;

