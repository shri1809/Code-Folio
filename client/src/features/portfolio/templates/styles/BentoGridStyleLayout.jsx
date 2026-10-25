import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  ArrowUpRight,
  Activity,
  Cpu,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const BentoGridStyleLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Minimal Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-indigo-400">
            <LayoutGrid className="w-4 h-4" />
            <span className="font-bold tracking-wider uppercase">
              BENTO SPECIFICATION // {roleConfig?.title || 'SaaS & Product Architect'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-300">
                Resume.pdf
              </a>
            )}
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Asymmetric Bento Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Hero Identity (2 Cols, 2 Rows) */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 rounded-3xl bg-slate-900/70 border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest inline-block mb-4">
                CORE PROFILE // 01
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Product Engineer'}
              </h1>
              <p className="text-indigo-400 text-sm font-mono mt-1">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
              <div
                className="text-slate-300 text-sm mt-4 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: safeBio || 'Asymmetrical modular layouts transforming complex systems into intuitive visual tiles.' }}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active for Q3/Q4 contracts
              </span>
            </div>
          </div>

          {/* Card 2: Performance Telemetry (1 Col, 1 Row) */}
          <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Conversion Velocity</span>
            </span>
            <div className="my-4">
              <span className="text-4xl font-black text-emerald-400">+182%</span>
              <p className="text-slate-400 text-xs mt-1">User retention &amp; engagement jump</p>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-4/5" />
            </div>
          </div>

          {/* Card 3: Stack Badges (1 Col, 1 Row) */}
          <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Core Stack</span>
            </span>
            <div className="flex flex-wrap gap-1.5 my-3">
              {(skills.frontend || ['Next.js', 'React', 'TypeScript', 'Tailwind', 'GraphQL']).map((s, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-200">
                  {s}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Production Certified</span>
          </div>

          {/* Card 4: Primary Project (2 Cols, 1 Row) */}
          {projects[0] && (
            <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                {projects[0].screenshot && (
                  <div className="rounded-2xl overflow-hidden aspect-[21/9] mb-4 border border-white/10">
                    <img
                      src={projects[0].screenshot}
                      alt={projects[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{projects[0].title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{projects[0].description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">FEATURED APPLICATION</span>
                {projects[0].liveLink && (
                  <a href={projects[0].liveLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Card 5: Secondary Project (2 Cols, 1 Row) */}
          {projects[1] && (
            <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-slate-900/70 border border-white/10 p-6 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                {projects[1].screenshot && (
                  <div className="rounded-2xl overflow-hidden aspect-[21/9] mb-4 border border-white/10">
                    <img
                      src={projects[1].screenshot}
                      alt={projects[1].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{projects[1].title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{projects[1].description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">SCALE // NODE 02</span>
                {projects[1].liveLink && (
                  <a href={projects[1].liveLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
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

export default BentoGridStyleLayout;

