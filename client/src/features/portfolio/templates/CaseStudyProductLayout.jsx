import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Figma,
  Layers,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Github,
  Linkedin,
  Twitter,
  Globe,
  CheckCircle2,
  Users,
  Compass,
  Layout,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const CaseStudyProductLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  const handleOpenContact = () => {
    if (onOpenContact) onOpenContact();
    else setIsContactOpen(true);
  };

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const activeProject = projects[selectedCaseIdx] || projects[0] || null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 sm:p-10 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <Layout className="w-3.5 h-3.5" />
                  {roleConfig?.title || 'Product & UX Designer'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#0c1df2] to-cyan-500 text-white uppercase tracking-wider shadow-[0_0_12px_rgba(12,29,242,0.5)]">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Product Designer'}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 flex items-center gap-2">
                <span>@{user.username}</span>
                {user.customDomain && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-mono text-xs">{user.customDomain}</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Design Resume</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenContact}
                className="gap-2 text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Book Inquiry</span>
              </Button>
            </div>
          </div>

          {/* Bio & UX Impact Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#4251f7]" />
                <span>Design Philosophy & Approach</span>
              </h3>
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Crafting intuitive, accessible digital experiences through rigorous user research, wireframing, interactive prototyping, and data-driven product iteration.
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Website / Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* UX Metric Badges */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Impact Milestones</span>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-300">Conversion Uplift</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">+42.6%</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs text-slate-300">Design System Adoption</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">100% Core</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Accessibility Rating</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">WCAG 2.1 AAA</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Validated with unmoderated user tests</span>
              </div>
            </div>
          </div>
        </header>

        {/* Design Tooling & Methodologies */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Figma className="w-4 h-4 text-[#4251f7]" />
            <span>Design Skills & Toolkit</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 block">
                UX Research & Discovery
              </span>
              <div className="flex flex-wrap gap-2">
                {(skills.frontend?.length > 0
                  ? skills.frontend
                  : ['User Personas', 'Journey Mapping', 'Usability Testing', 'Information Architecture', 'Jobs-To-Be-Done']
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-200 border border-white/5 hover:border-indigo-500/30 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 block">
                UI & Design Systems
              </span>
              <div className="flex flex-wrap gap-2">
                {(skills.backend?.length > 0
                  ? skills.backend
                  : ['Figma Tokens', 'Micro-Interactions', 'Responsive Layouts', 'Typography Systems', 'Component Libraries']
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-200 border border-white/5 hover:border-cyan-500/30 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 block">
                Prototyping & Tools
              </span>
              <div className="flex flex-wrap gap-2">
                {(skills.devops?.length > 0
                  ? skills.devops
                  : ['Framer', 'Protopie', 'Storybook', 'FigJam', 'Hotjar']
                ).map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-200 border border-white/5 hover:border-emerald-500/30 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Studies Header & Selector */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#4251f7]" />
                <span>Selected Product Case Studies</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Deep dive into user research, wireframes, iteration loops, and business results.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} {projects.length === 1 ? 'Case' : 'Cases'}
            </span>
          </div>

          {/* Case Studies Grid / Deep Dives */}
          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <Layout className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No case studies added yet.</p>
              <p className="text-slate-600 text-xs mt-1">Add your product design work in the dashboard editor.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {projects.map((project, idx) => {
                const isSelected = selectedCaseIdx === idx;
                const screenshotUrl =
                  project.screenshot ||
                  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&q=80';

                return (
                  <article
                    key={idx}
                    className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl hover:border-white/20 transition-all duration-300"
                  >
                    {/* Visual Preview Showcase */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-slate-950 group">
                      <img
                        src={screenshotUrl}
                        alt={project.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&q=80';
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c1df2] text-white uppercase tracking-wider shadow-sm">
                              Case Study #{idx + 1}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                            {project.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="primary" size="sm" className="gap-2 text-xs">
                                <span>Prototype Preview</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </a>
                          )}
                          {project.repoLink && (
                            <a
                              href={project.repoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="glass" size="sm" className="gap-2 text-xs">
                                <Github className="w-3.5 h-3.5" />
                                <span>Specs</span>
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Case Study Content Breakdown */}
                    <div className="p-8 sm:p-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Section 1: Challenge */}
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            <span>1. The Challenge</span>
                          </span>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {project.description ||
                              'Complex onboarding flows were driving high drop-off and friction across primary transactional milestones.'}
                          </p>
                        </div>

                        {/* Section 2: Strategy & Execution */}
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5" />
                            <span>2. Strategy & UX Flow</span>
                          </span>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Conducted iterative usability tests, simplified the mental model to 3 frictionless steps, and unified components into a zero-latency design token system.
                          </p>
                        </div>

                        {/* Section 3: Measurable Outcomes */}
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>3. Key Results</span>
                          </span>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Resulted in a 44% increase in completion rate and a 2.3x drop in customer support escalations post-release.
                          </p>
                        </div>
                      </div>

                      {/* Tech Stack & Design Tags */}
                      {project.techStack?.length > 0 && (
                        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-500 mr-2 font-mono">Tools & Tags:</span>
                          {project.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#0c1df2]/10 text-cyan-300 border border-[#0c1df2]/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer Inquiry CTA */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All design rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Powered by CodeFolio Pro</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Contact Designer</span>
            </Button>
          </div>
        </footer>
      </div>

      {!onOpenContact && (
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          recipientEmail={user.email}
          username={user.username}
        />
      )}
    </div>
  );
};

export default CaseStudyProductLayout;

