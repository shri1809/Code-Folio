import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  ArrowUpRight,
  Crosshair,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const BarelyThereLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-300 font-sans selection:bg-slate-700 selection:text-white p-4 sm:p-10 relative">
      {/* Strict Cartesian Hairline Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Subtle Hairline Header */}
        <header className="border-[0.5px] border-white/10 bg-black/40 backdrop-blur-sm p-6 sm:p-12 relative">
          {/* Corner Crosshair Markers */}
          <span className="absolute -top-1.5 -left-1.5 text-slate-500 font-mono text-[10px] select-none">+</span>
          <span className="absolute -top-1.5 -right-1.5 text-slate-500 font-mono text-[10px] select-none">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-slate-500 font-mono text-[10px] select-none">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-slate-500 font-mono text-[10px] select-none">+</span>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-[0.5px] border-white/10">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-1">
                // SPEC: 'BARELY THERE' // {roleConfig?.title || 'AI & Machine Learning Engineer'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-extralight text-white tracking-wide">
                {profile.name || user.username || 'System Intelligence'}
              </h1>
              <p className="text-slate-500 text-xs font-mono mt-1">
                {user.customDomain ? `@${user.username} :: ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-3.5 py-1.5 border-[0.5px] border-white/20 hover:border-white/50 text-xs font-mono text-slate-300 hover:text-white transition-colors">
                    DOCUMENT.PDF
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-4 py-1.5 border-[0.5px] border-white/40 hover:border-white bg-white/5 text-white font-mono text-xs transition-colors"
              >
                DISPATCH_MSG
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-light text-sm">
            <div
              className="text-slate-400 max-w-3xl leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Ultra-fine hairline borders, strict Cartesian coordinates, and distraction-free cognitive focus.' }}
            />
            <div className="flex items-center gap-4 text-xs font-mono">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  [git]
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  [in]
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Minimal Projects Matrix */}
        <section className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pb-2 border-b-[0.5px] border-white/10">
            <span>INDEXED WORKSPACES</span>
            <span>COUNT: {projects.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="border-[0.5px] border-white/10 p-6 bg-black/30 hover:border-white/30 transition-colors relative flex flex-col justify-between"
              >
                <div>
                  {proj.screenshot && (
                    <div className="aspect-[21/9] overflow-hidden mb-4 border-[0.5px] border-white/10 bg-black">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-slate-500 block mb-1">
                    OBJ_ID // {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <h3 className="text-xl font-light text-white tracking-wide">{proj.title}</h3>
                  <p className="text-slate-400 text-xs mt-2 font-light leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-[0.5px] border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-wrap gap-2 text-slate-500">
                    {(proj.techStack || []).map((t, tidx) => (
                      <span key={tidx}>#{t}</span>
                    ))}
                  </div>

                  {proj.liveLink && (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <span>VIEW</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'engineer'}
      />
    </div>
  );
};

export default BarelyThereLayout;

