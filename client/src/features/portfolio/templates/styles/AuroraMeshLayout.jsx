import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const AuroraMeshLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#07050d] text-slate-100 font-sans selection:bg-fuchsia-500/30 selection:text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Dynamic Aurora Mesh Backing Blobs */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[450px] bg-gradient-to-r from-violet-600/30 via-fuchsia-600/25 to-pink-500/20 blur-[130px] rounded-full pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 -right-20 w-[600px] h-[500px] bg-gradient-to-l from-emerald-500/20 via-cyan-500/20 to-blue-600/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-10 w-[500px] h-[400px] bg-gradient-to-t from-pink-600/20 via-purple-600/20 to-transparent blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Aurora Translucent Card Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-2xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-pink-500/30 text-xs font-mono text-pink-300 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span className="uppercase font-bold tracking-wider">
                  AURORA MESH // {roleConfig?.title || 'Creative Technologist & UI Specialist'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-violet-200">
                {profile.name || user.username || 'Creative Technologist'}
              </h1>
              <p className="text-pink-400 text-sm mt-1 font-mono">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-5 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5 text-pink-400" />
                    <span>CURRICULUM.PDF</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>CONNECT DIRECT</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Rich ambient gradients, organic multi-stop aurora backing, and expressive typography.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all"
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
                  className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Aurora Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 shadow-xl hover:border-pink-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {proj.screenshot && (
                  <div className="rounded-2xl overflow-hidden aspect-video mb-5 border border-white/10 bg-slate-900 relative">
                    <img
                      src={proj.screenshot}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <span className="text-[10px] font-mono font-bold uppercase text-pink-400 tracking-wider block mb-1">
                  SPECTRUM // 0{idx + 1}
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
                  {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-white/[0.06] text-pink-200 border border-white/10"
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300"
                  >
                    <span>Launch</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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

export default AuroraMeshLayout;

