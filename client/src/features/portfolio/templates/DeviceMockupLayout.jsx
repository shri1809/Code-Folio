import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Smartphone,
  Tablet,
  Github,
  Linkedin,
  Globe,
  FileDown,
  Mail,
  ExternalLink,
  Download,
  Star,
  Shield,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Apple,
  Play,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const DeviceMockupLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');
  const activeProject = projects[activeProjectIdx] || projects[0] || null;

  // Support granular app store, play store, and web links (both optional, either or both)
  const appStoreUrl =
    activeProject?.appStoreLink ||
    (activeProject?.liveLink &&
    (activeProject.liveLink.includes('apple.com') || activeProject.liveLink.includes('itunes'))
      ? activeProject.liveLink
      : null);

  const playStoreUrl =
    activeProject?.playStoreLink ||
    (activeProject?.liveLink &&
    (activeProject.liveLink.includes('play.google.com') || activeProject.liveLink.includes('google.com/store'))
      ? activeProject.liveLink
      : null);

  const webDemoUrl =
    activeProject?.liveLink &&
    activeProject.liveLink !== appStoreUrl &&
    activeProject.liveLink !== playStoreUrl
      ? activeProject.liveLink
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-[#0c1df2]/40 selection:text-white">
      {/* Ambient Radial Lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#0c1df2]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#4251f7]">
              <Smartphone className="w-4 h-4 text-[#0c1df2]" />
              <span className="font-semibold tracking-wider">{roleConfig?.title || 'Mobile & Interaction Engineer'}</span>
              {user.isPro && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-[#0c1df2] to-cyan-500 text-white font-bold tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {profile.name || user.username || 'Mobile Engineer'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="sm" className="gap-2">
                  <FileDown className="w-3.5 h-3.5" />
                  <span>CV / Resume</span>
                </Button>
              </a>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsContactOpen(true)}
              className="gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Developer</span>
            </Button>
          </div>
        </header>

        {/* HERO: Interactive Phone Mockup Shell & Featured App Stage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Hero Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1df2]/15 border border-[#0c1df2]/30 text-xs font-mono text-[#4251f7]">
              <Sparkles className="w-3.5 h-3.5 text-[#0c1df2]" />
              <span>NATIVE MOBILE EXPERIENCE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Crafting tactile, fluid mobile software with native precision.
            </h2>

            {safeBio ? (
              <div
                className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: safeBio }}
              />
            ) : (
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Specializing in production-grade mobile applications with responsive gesture physics, offline-first architectures, and smooth 120Hz display refresh rates.
              </p>
            )}

            {/* App Store, Play Store & Live Badge CTAs (both optional, either or both) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {appStoreUrl && (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-bold flex items-center gap-2 transition text-white shadow-sm"
                  title="Download on Apple App Store"
                >
                  <Apple className="w-4 h-4 text-white" />
                  <span>App Store</span>
                </a>
              )}
              {playStoreUrl && (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition text-emerald-300 shadow-sm"
                  title="Get it on Google Play Store"
                >
                  <Play className="w-4 h-4 fill-current text-emerald-400" />
                  <span>Google Play</span>
                </a>
              )}
              {webDemoUrl && (
                <a
                  href={webDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0c1df2]/20 hover:bg-[#0c1df2]/30 border border-[#0c1df2]/40 text-xs font-bold flex items-center gap-2 transition text-cyan-300"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  <span>Live Demo</span>
                </a>
              )}
              {activeProject?.repoLink && (
                <a
                  href={activeProject.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold flex items-center gap-2 transition text-slate-300 hover:text-white"
                >
                  <Github className="w-4 h-4 text-slate-300" />
                  <span>View Source Code</span>
                </a>
              )}
            </div>

            {/* Carousel navigation controls if multiple projects */}
            {projects.length > 1 && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <span className="text-xs text-slate-400 font-mono">
                  App {activeProjectIdx + 1} of {projects.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveProjectIdx((prev) => (prev > 0 ? prev - 1 : projects.length - 1))}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition"
                    title="Previous App"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveProjectIdx((prev) => (prev < projects.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition"
                    title="Next App"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Phone Frame Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[300px] h-[600px] rounded-[48px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(12,29,242,0.25)] border-[4px] border-slate-700/80">
              {/* Device Bevel Outer Glass */}
              <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-slate-950 flex flex-col justify-between border border-white/10">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                  <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-emerald-500/40"></span>
                </div>

                {/* Status Bar */}
                <div className="w-full h-10 pt-2 px-6 flex items-center justify-between font-mono text-[10px] text-slate-400 z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                      <div className="w-full h-full bg-slate-200 rounded-xs"></div>
                    </div>
                  </div>
                </div>

                {/* Screen Content */}
                <div className="flex-1 w-full relative overflow-hidden flex flex-col justify-center items-center p-4">
                  {activeProject?.screenshot ? (
                    <img
                      src={activeProject.screenshot}
                      alt={activeProject.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-3 z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0c1df2] to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg">
                        <Smartphone className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {activeProject?.title || 'Featured App'}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {activeProject?.description || 'Interactive native mobile interface demo.'}
                      </p>
                    </div>
                  )}

                  {/* Gradient shadow over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                  {/* Floating Action Card in screen */}
                  <div className="absolute bottom-6 left-4 right-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 z-20 text-left">
                    <h5 className="text-xs font-bold text-white truncate">
                      {activeProject?.title || 'Interactive Screen'}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {(activeProject?.techStack || ['SwiftUI', 'UIKit']).join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-full h-6 flex justify-center items-center pb-2 z-20">
                  <div className="w-32 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Platform Capabilities */}
        <section className="mb-14">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#4251f7] font-bold mb-6">
            Technical Stack &amp; Mobile Frameworks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0c1df2]" />
                <span>Mobile UI &amp; Frameworks</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.frontend?.length > 0 ? skills.frontend : ['SwiftUI', 'Kotlin', 'React Native']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Architecture &amp; State</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.backend?.length > 0 ? skills.backend : ['Clean Architecture', 'Offline SQLite', 'GraphQL']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Deployment &amp; Tooling</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.devops?.length > 0 ? skills.devops : ['Fastlane', 'TestFlight', 'CI/CD Pipelines']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* All App Showcases */}
        <section className="mb-14">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#4251f7] font-bold mb-6">
            All Mobile Deployments ({projects.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                onClick={() => setActiveProjectIdx(idx)}
                className={`p-6 rounded-2xl glass-card border transition-all cursor-pointer ${
                  activeProjectIdx === idx
                    ? 'border-[#0c1df2] bg-[#0c1df2]/5 shadow-[0_0_25px_rgba(12,29,242,0.2)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-lg font-bold text-white">{proj.title}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                    APP #{idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {proj.description}
                </p>
                {proj.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 font-mono text-xs text-slate-500">
          <p>CODEFOLIO // {roleConfig?.title?.toUpperCase() || 'MOBILE ARCHITECTURE'}</p>
        </footer>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'developer'}
      />
    </div>
  );
};

export default DeviceMockupLayout;

