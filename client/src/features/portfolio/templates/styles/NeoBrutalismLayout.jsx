import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Sparkles,
  Layers,
  Code2,
  Terminal,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const NeoBrutalismLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-black font-mono selection:bg-yellow-300 selection:text-black relative p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brutalist Header Card */}
        <header className="rounded-2xl border-4 border-black bg-[#FFDE59] p-6 sm:p-10 shadow-[8px_8px_0px_#000000] relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-4 border-black">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-bold uppercase mb-3">
                <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>NEO-BRUTALISM // {roleConfig?.title || 'Creative & Web3 Engineer'}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none">
                {profile.name || user.username || 'Disruptive Builder'}
              </h1>
              <p className="text-black font-bold text-sm mt-2">
                {user.customDomain ? `@${user.username} /// ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2.5 rounded-xl border-3 border-black bg-white hover:bg-slate-100 text-black font-black text-xs uppercase shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2">
                    <FileDown className="w-4 h-4" />
                    <span>RESUME.RAW</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-5 py-2.5 rounded-xl border-3 border-black bg-[#FF3366] text-white hover:bg-[#ff1f57] font-black text-xs uppercase shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>HIRE / CONNECT</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans font-medium">
            <div
              className="text-black text-sm sm:text-base leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Unapologetic high-contrast brutalist design with raw asymmetrical grids and loud interactions.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border-3 border-black bg-white shadow-[3px_3px_0px_#000] hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-black"
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
                  className="p-3 rounded-xl border-3 border-black bg-white shadow-[3px_3px_0px_#000] hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-black"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Brutalist Raw Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 bg-black inline-block" />
              <span>PROJECT INVENTORY // ARCHIVE</span>
            </h2>
            <span className="text-xs font-bold uppercase bg-black text-white px-2 py-1">
              TOTAL: 0{projects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => {
              const bgColors = ['bg-[#00F0FF]', 'bg-[#FF90E8]', 'bg-[#4ECCA3]', 'bg-[#FFDE59]'];
              const cardBg = bgColors[idx % bgColors.length];

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border-4 border-black ${cardBg} p-6 shadow-[8px_8px_0px_#000000] flex flex-col justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all`}
                >
                  <div>
                    {proj.screenshot && (
                      <div className="rounded-xl overflow-hidden aspect-video mb-4 border-3 border-black bg-white shadow-[4px_4px_0px_#000]">
                        <img
                          src={proj.screenshot}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase">
                        INDEX // 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                      {proj.title}
                    </h3>
                    <p className="text-black font-sans text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-3 border-black flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.techStack || []).map((t, tidx) => (
                        <span
                          key={tidx}
                          className="px-2.5 py-1 rounded-lg border-2 border-black bg-white text-black text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-black text-white font-black text-xs uppercase hover:bg-white hover:text-black transition-colors"
                      >
                        <span>LAUNCH</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'builder'}
      />
    </div>
  );
};

export default NeoBrutalismLayout;

