import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Monitor,
  Code,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Cpu,
  Layers,
  Palette,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const AccordionOSLayout = ({ data, roleConfig }) => {
  const [openSections, setOpenSections] = useState({
    projects: true,
    components: true,
    stack: false,
    playground: false,
  });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [playgroundState, setPlaygroundState] = useState('idle');

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white relative">
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* OS Window Shell */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* OS Window Titlebar */}
          <div className="px-5 py-3.5 bg-slate-950/70 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
              <span className="ml-3 font-mono text-xs text-slate-400 font-medium hidden sm:inline-block">
                AccordionOS v4.2 // workspace ~ {profile.name || user.username || 'developer'}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              {user.isPro && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                  PRO ENGINEER
                </span>
              )}
              <span className="text-slate-500">|</span>
              <span className="text-indigo-400 font-semibold">{roleConfig?.title || 'Web & Full-Stack'}</span>
            </div>
          </div>

          {/* Window Hero Profile Section */}
          <div className="p-6 sm:p-8 border-b border-white/10 bg-slate-900/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <span>{profile.name || user.username || 'Frontend / Full-Stack Engineer'}</span>
                  <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse hidden sm:inline" />
                </h1>
                <p className="text-indigo-400 text-sm font-mono mt-1">
                  {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
                </p>
                <div
                  className="text-slate-300 text-sm mt-3 leading-relaxed max-w-3xl"
                  dangerouslySetInnerHTML={{ __html: safeBio || 'Crafting fluid, responsive web applications and component-driven frontends.' }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="glass" size="sm" className="gap-2 text-xs">
                      <FileDown className="w-3.5 h-3.5" />
                      <span>CV / RESUME</span>
                    </Button>
                  </a>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsContactOpen(true)}
                  className="gap-2 text-xs shadow-lg shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-500"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>CONNECT</span>
                </Button>
              </div>
            </div>

            {/* Socials & Badges */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-white transition-colors border border-white/5"
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
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 text-slate-300 hover:text-white transition-colors border border-white/5"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="font-mono text-xs text-slate-400 flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available for contracts
                </span>
                <span>•</span>
                <span>React 18 / 19 & Next.js</span>
              </div>
            </div>
          </div>

          {/* Accordion OS Folders Directory */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* Section 1: Production Applications */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => toggleSection('projects')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {openSections.projects ? (
                    <FolderOpen className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Folder className="w-5 h-5 text-indigo-400" />
                  )}
                  <span className="font-bold text-white text-sm sm:text-base">
                    ~/apps/production-showcase ({projects.length})
                  </span>
                </div>
                {openSections.projects ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {openSections.projects && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="p-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {projects.length === 0 ? (
                      <p className="text-slate-400 text-xs font-mono col-span-2 text-center py-6">
                        No projects cataloged in this directory.
                      </p>
                    ) : (
                      projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-white/5 bg-slate-900/80 p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
                        >
                          <div>
                            {proj.screenshot && (
                              <div className="rounded-lg overflow-hidden mb-3 aspect-video border border-white/10 relative">
                                <img
                                  src={proj.screenshot}
                                  alt={proj.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {proj.title}
                            </h3>
                            <p className="text-slate-300 text-xs mt-2 leading-relaxed line-clamp-3">
                              {proj.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-3">
                            <div className="flex flex-wrap gap-1.5">
                              {(proj.techStack || []).map((tech, tidx) => (
                                <span
                                  key={tidx}
                                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3">
                              {proj.repoLink && (
                                <a
                                  href={proj.repoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  <span>Source</span>
                                </a>
                              )}
                              {proj.liveLink && (
                                <a
                                  href={proj.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                                >
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 2: Component Architecture & Tokens */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => toggleSection('components')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {openSections.components ? (
                    <FolderOpen className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Folder className="w-5 h-5 text-purple-400" />
                  )}
                  <span className="font-bold text-white text-sm sm:text-base">
                    ~/design-system/tokens-and-primitives
                  </span>
                </div>
                {openSections.components ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {openSections.components && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="p-5 border-t border-white/10 space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase">Color Primitives</span>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-500 shadow-md" title="Indigo 500" />
                          <span className="w-6 h-6 rounded-md bg-purple-500 shadow-md" title="Purple 500" />
                          <span className="w-6 h-6 rounded-md bg-cyan-400 shadow-md" title="Cyan 400" />
                          <span className="w-6 h-6 rounded-md bg-slate-900 border border-white/20" title="Slate 900" />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase">Motion & Physics</span>
                        <p className="text-slate-300 text-[11px]">
                          cubic-bezier(0.16, 1, 0.3, 1)<br />
                          spring (damping: 24, mass: 0.6)
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-slate-900/60 border border-white/5">
                        <span className="text-[11px] text-slate-400 block mb-2 font-bold uppercase">Accessibility</span>
                        <p className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> WCAG 2.2 AAA Compliant
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 3: Tech Stack & End-to-End Tooling */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => toggleSection('stack')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {openSections.stack ? (
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Folder className="w-5 h-5 text-cyan-400" />
                  )}
                  <span className="font-bold text-white text-sm sm:text-base">
                    ~/environment/fullstack-toolchain
                  </span>
                </div>
                {openSections.stack ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {openSections.stack && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="p-5 border-t border-white/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-indigo-400 font-bold block mb-2">Frontend</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.frontend || ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Framer Motion']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-purple-400 font-bold block mb-2">Backend & APIs</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.backend || ['Node.js', 'Express', 'GraphQL', 'PostgreSQL', 'Redis']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold block mb-2">Testing & Infra</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.devops || ['Vite', 'Vitest', 'Playwright', 'Docker', 'Vercel']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section 4: Interactive Micro-Interaction Playground */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => toggleSection('playground')}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {openSections.playground ? (
                    <FolderOpen className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Folder className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="font-bold text-white text-sm sm:text-base">
                    ~/sandbox/micro-interactions-tester
                  </span>
                </div>
                {openSections.playground ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {openSections.playground && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="p-5 border-t border-white/10"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs">
                      <span className="text-slate-400">Trigger State:</span>
                      <button
                        onClick={() => setPlaygroundState('idle')}
                        className={`px-3 py-1 rounded-md transition-colors ${playgroundState === 'idle' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
                      >
                        Idle
                      </button>
                      <button
                        onClick={() => setPlaygroundState('hover')}
                        className={`px-3 py-1 rounded-md transition-colors ${playgroundState === 'hover' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
                      >
                        Hover Glow
                      </button>
                      <button
                        onClick={() => setPlaygroundState('loading')}
                        className={`px-3 py-1 rounded-md transition-colors ${playgroundState === 'loading' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-300'}`}
                      >
                        Active Loading
                      </button>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center min-h-[100px]">
                      {playgroundState === 'idle' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25"
                        >
                          Interactive Primary Button
                        </motion.button>
                      )}
                      {playgroundState === 'hover' && (
                        <motion.button
                          animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 0px #6366f1', '0 0 20px #6366f1', '0 0 0px #6366f1'] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs"
                        >
                          Pulse Hover Simulation
                        </motion.button>
                      )}
                      {playgroundState === 'loading' && (
                        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs">
                          <RotateCcw className="w-4 h-4 animate-spin" />
                          <span>Dispatching asynchronous hydration payload...</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'developer'}
      />
    </div>
  );
};

export default AccordionOSLayout;
