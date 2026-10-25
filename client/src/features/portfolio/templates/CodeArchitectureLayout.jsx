import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  FileDown,
  Mail,
  ExternalLink,
  Terminal,
  Cpu,
  Server,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cloud,
  Layers,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const CodeArchitectureLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Background Matrix / Grid Accent */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Terminal Header Bar */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#4251f7]">
                <Terminal className="w-4 h-4 text-[#0c1df2]" />
                <span className="font-semibold tracking-wider">SYSTEM // {roleConfig?.title || 'Systems Architect'}</span>
                {user.isPro && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-[#0c1df2] to-cyan-500 text-white font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(12,29,242,0.6)]">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Systems Engineer'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 font-mono text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>SPEC / RESUME</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 font-mono text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INITIATE CONTACT</span>
              </Button>
            </div>
          </div>

          {/* Bio & System Metrics Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-8">
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-500 text-sm italic">
                  Architecting resilient microservices, high-throughput data layers, and automated cloud infrastructure.
                </p>
              )}

              {/* Social Connects */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-[#0c1df2] transition shadow-sm"
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
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-[#0c1df2] transition shadow-sm"
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
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-[#0c1df2] transition shadow-sm"
                    title="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-[#0c1df2] transition shadow-sm"
                    title="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Telemetry Box */}
            <div className="lg:col-span-4 rounded-xl p-4 bg-black/40 border border-white/10 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/5">
                <span>SYSTEM STATUS</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  99.99% HEALTHY
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>ACTIVE ARCHETYPE</span>
                <span className="text-white font-semibold">{roleConfig?.badge || 'Code & Systems'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>SECURITY ENCRYPTION</span>
                <span className="text-[#4251f7]">TLS 1.3 / AES-256</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>TOTAL SHOWCASES</span>
                <span className="text-white">{projects.length} Artifacts</span>
              </div>
            </div>
          </div>
        </header>

        {/* Skills & Tech Stack Section */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-[#0c1df2]" />
            <h2 className="text-lg font-bold text-white tracking-wide uppercase font-mono">
              Core Tech Stack &amp; Infrastructure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Backend / Core */}
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <div className="flex items-center gap-2 mb-4 text-[#4251f7] font-mono text-xs font-bold uppercase">
                <Database className="w-4 h-4" />
                <span>Backend &amp; Data</span>
              </div>
              {skills.backend?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No backend technologies specified.</p>
              )}
            </div>

            {/* Cloud & DevOps */}
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <div className="flex items-center gap-2 mb-4 text-cyan-400 font-mono text-xs font-bold uppercase">
                <Cloud className="w-4 h-4" />
                <span>DevOps &amp; Infra</span>
              </div>
              {skills.devops?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.devops.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No infrastructure technologies specified.</p>
              )}
            </div>

            {/* Frontend & Interfaces */}
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Layers className="w-4 h-4" />
                <span>Interface &amp; API</span>
              </div>
              {skills.frontend?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No interface technologies specified.</p>
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects & Architecture Repositories */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-[#0c1df2]" />
              <h2 className="text-lg font-bold text-white tracking-wide uppercase font-mono">
                Featured Engineering Architectures
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} {projects.length === 1 ? 'REPOSITORY' : 'REPOSITORIES'}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center glass-card">
              <p className="text-sm text-slate-500">No public engineering projects listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => {
                const safeDesc = DOMPurify.sanitize(proj.description || '');
                return (
                  <article
                    key={proj.id || idx}
                    className="rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#0c1df2]/50 transition-all duration-300 group shadow-lg"
                  >
                    {proj.screenshot && (
                      <div className="aspect-video w-full overflow-hidden bg-slate-900 border-b border-white/10 relative">
                        <img
                          src={proj.screenshot}
                          alt={proj.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#4251f7] transition">
                            {proj.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            {proj.repoLink && (
                              <a
                                href={proj.repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition"
                                title="Repository Link"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {proj.liveLink && (
                              <a
                                href={proj.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-[#4251f7] hover:text-white transition"
                                title="Live Endpoint"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        {safeDesc && (
                          <div
                            className="text-xs text-slate-400 leading-relaxed mb-4"
                            dangerouslySetInnerHTML={{ __html: safeDesc }}
                          />
                        )}
                      </div>

                      {proj.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0c1df2]/10 border border-[#0c1df2]/20 text-[#4251f7] font-semibold"
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

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 font-mono text-xs text-slate-500">
          <p>CODEFOLIO // {roleConfig?.title?.toUpperCase() || 'ENGINEERING ARCHITECTURE'}</p>
          <p className="mt-1 text-[11px] text-slate-600">Built with high-assurance security and clean design.</p>
        </footer>
      </div>

      {/* Contact Relay Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'developer'}
      />
    </div>
  );
};

export default CodeArchitectureLayout;

