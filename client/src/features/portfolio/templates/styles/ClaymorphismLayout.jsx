import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smile,
  Heart,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const ClaymorphismLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#e8edfc] text-slate-800 font-sans selection:bg-purple-300 selection:text-purple-900 relative p-4 sm:p-8">
      {/* Soft Ambient Clay Glows */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Soft Clay Puffy Hero Card */}
        <header className="rounded-[36px] sm:rounded-[44px] bg-[#f0f4ff] p-6 sm:p-12 shadow-[inset_0_8px_16px_rgba(255,255,255,0.9),inset_0_-8px_16px_rgba(166,175,200,0.4),0_20px_45px_rgba(115,130,175,0.25)] relative border border-white/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-indigo-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.06)] text-xs font-bold text-indigo-600 mb-3">
                <Smile className="w-4 h-4 text-pink-500" />
                <span className="uppercase">CLAYMORPHISM // {roleConfig?.title || 'Interactive & Product Designer'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight">
                {profile.name || user.username || 'Interactive Builder'}
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-mono">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-5 py-3 rounded-2xl bg-white text-slate-700 font-bold text-xs shadow-[inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.08),0_10px_20px_rgba(0,0,0,0.08)] active:scale-95 transition-all flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-indigo-500" />
                    <span>RESUME.PDF</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-b from-[#818cf8] to-[#6366f1] text-white font-bold text-xs shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.2),0_12px_25px_rgba(99,102,241,0.35)] active:scale-95 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>SAY HELLO!</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Playful, volumetric clay interfaces with pillowy tactile curves and friendly interactions.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-white text-slate-700 shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(0,0,0,0.06),0_6px_15px_rgba(0,0,0,0.08)] active:scale-95 flex items-center justify-center transition-all"
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
                  className="w-11 h-11 rounded-2xl bg-white text-slate-700 shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(0,0,0,0.06),0_6px_15px_rgba(0,0,0,0.08)] active:scale-95 flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Claymorphic Projects Grid */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Volumetric Clay Creations</span>
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
              {projects.length} Interactive Cases
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-[36px] bg-[#f2f6ff] p-6 shadow-[inset_0_6px_12px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(166,175,200,0.35),0_18px_35px_rgba(115,130,175,0.2)] border border-white/70 flex flex-col justify-between"
              >
                <div>
                  {proj.screenshot && (
                    <div className="rounded-3xl overflow-hidden aspect-video mb-5 shadow-[inset_0_3px_6px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.08)] bg-white">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    CREATION 0{idx + 1}
                  </span>

                  <h3 className="text-lg font-black text-slate-800">{proj.title}</h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_5px_rgba(0,0,0,0.06)]"
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
                      className="p-2 rounded-xl bg-indigo-600 text-white shadow-md active:scale-90 transition-transform"
                      title="Open Experience"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
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

export default ClaymorphismLayout;

