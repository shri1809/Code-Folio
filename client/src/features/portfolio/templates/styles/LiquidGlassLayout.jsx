import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Droplets,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const LiquidGlassLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 font-sans selection:bg-pink-500/30 selection:text-white relative overflow-hidden p-4 sm:p-8">
      {/* Morphing Liquid Ambient Light Gradients */}
      <div className="fixed top-1/4 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/25 via-fuchsia-500/20 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-10 -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-violet-600/25 via-pink-500/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Liquid Glass Fluid Header */}
        <header className="rounded-[40px] border border-white/25 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] backdrop-blur-3xl p-6 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden">
          {/* Iridescent Sheen Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-pink-400 to-indigo-500 opacity-80" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-mono text-cyan-300 mb-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span className="uppercase font-bold tracking-wider">
                  LIQUID GLASS // {roleConfig?.title || 'Creative Frontend Specialist'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                {profile.name || user.username || 'Fluid Creative'}
              </h1>
              <p className="text-cyan-400 text-sm mt-1 font-mono">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-5 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-xs font-bold text-white backdrop-blur-xl shadow-lg transition-all flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5 text-pink-400" />
                    <span>CURRICULUM.PDF</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:shadow-[0_0_35px_rgba(217,70,239,0.6)] border border-white/30 transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>LIQUID INQUIRY</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Organic fluid curves, high refractive sheen, and iridescent transparent surfaces.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.15] border border-white/20 text-slate-300 hover:text-white transition-all shadow-md"
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
                  className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.15] border border-white/20 text-slate-300 hover:text-white transition-all shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Refractive Liquid Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Fluid Showcase Works</span>
            </h2>
            <span className="text-xs font-mono text-cyan-300">
              Refraction Index: 1.52 (Crown Glass)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-[36px] border border-white/20 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent backdrop-blur-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:border-pink-400/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {proj.screenshot && (
                    <div className="rounded-[28px] overflow-hidden aspect-video mb-5 border border-white/20 bg-black/60 relative">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                  )}

                  <span className="text-[10px] font-mono font-bold uppercase text-pink-400 tracking-wider block mb-1">
                    FLUID PIECE // 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.techStack || []).map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/[0.08] text-cyan-200 border border-white/15"
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
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                    >
                      <span>Experience</span>
                      <ArrowUpRight className="w-4 h-4" />
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
        username={user.username || 'creator'}
      />
    </div>
  );
};

export default LiquidGlassLayout;

