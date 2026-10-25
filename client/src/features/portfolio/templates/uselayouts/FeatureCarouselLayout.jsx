import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Wifi,
  Battery,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Apple,
  Play,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const FeatureCarouselLayout = ({ data, roleConfig }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeDeviceTab, setActiveDeviceTab] = useState('screens');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const activeProject = projects[currentIdx] || {
    title: 'Flagship Mobile App',
    description: 'Native iOS & Android mobile application with fluid gesture interactions and offline-first persistence.',
    techStack: ['SwiftUI', 'Kotlin Multiplatform', 'Firebase', 'CoreData'],
    screenshot: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    liveLink: 'https://apps.apple.com',
    appStoreLink: 'https://apps.apple.com',
    playStoreLink: 'https://play.google.com',
  };

  // Support granular app store, play store, and web links (both optional, either or both)
  const appStoreUrl =
    activeProject.appStoreLink ||
    (activeProject.liveLink &&
    (activeProject.liveLink.includes('apple.com') || activeProject.liveLink.includes('itunes'))
      ? activeProject.liveLink
      : null);

  const playStoreUrl =
    activeProject.playStoreLink ||
    (activeProject.liveLink &&
    (activeProject.liveLink.includes('play.google.com') || activeProject.liveLink.includes('google.com/store'))
      ? activeProject.liveLink
      : null);

  const webDemoUrl =
    activeProject.liveLink &&
    activeProject.liveLink !== appStoreUrl &&
    activeProject.liveLink !== playStoreUrl
      ? activeProject.liveLink
      : null;

  const nextSlide = () => {
    if (projects.length <= 1) return;
    setCurrentIdx((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (projects.length <= 1) return;
    setCurrentIdx((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Guard against out-of-range index when projects change dynamically (e.g. sample loaded)
  useEffect(() => {
    if (currentIdx >= projects.length && projects.length > 0) {
      setCurrentIdx(0);
    }
  }, [projects.length, currentIdx]);

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white relative">
      {/* Background glow radial - scoped absolute to avoid bleeding into parent dashboard preview */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/25 via-cyan-950/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Top Header */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Mobile Software Engineer (iOS / Android)'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                    FEATURED DEVELOPER
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {profile.name || user.username || 'Mobile Engineer'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>RESUME.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE / HIRE</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specializing in SwiftUI, Jetpack Compose, and cross-platform native architectures.' }}
            />
            <div className="flex items-center gap-2">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
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
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Feature Carousel Main Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Device Mockup Shell (Left/Center Column) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Native Phone Frame */}
            <div className="relative w-[280px] sm:w-[320px] rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.15)] border-4 border-slate-700/60">
              {/* Speaker Notch / Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 inline-block mr-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-900/80 inline-block" />
              </div>

              {/* Screen Bezel & Canvas */}
              <div className="relative rounded-[38px] overflow-hidden bg-slate-950 aspect-[9/19] flex flex-col justify-between border border-white/10">
                {/* Phone Status Bar */}
                <div className="px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20 bg-slate-950/80 backdrop-blur-md">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3 text-slate-300" />
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Animated Screen Carousel Content */}
                <div className="relative flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIdx}
                      initial={{ opacity: 0, scale: 0.95, x: 40 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -40 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="absolute inset-0 flex flex-col"
                    >
                      {activeProject.screenshot ? (
                        <div className="relative w-full h-full">
                          <img
                            src={activeProject.screenshot}
                            alt={activeProject.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/80 text-white font-bold">
                              FEATURED
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1 drop-shadow-md">
                              {activeProject.title}
                            </h4>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                          <Smartphone className="w-10 h-10 text-cyan-400 mb-2" />
                          <h4 className="font-bold text-white text-sm">{activeProject.title}</h4>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Home Indicator Bar */}
                <div className="py-2.5 flex justify-center bg-slate-950 z-20">
                  <span className="w-24 h-1 rounded-full bg-slate-600 inline-block" />
                </div>
              </div>
            </div>

            {/* Carousel Control Dots & Arrows */}
            {projects.length > 1 && (
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10"
                  aria-label="Previous Project"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  {projects.map((_, pidx) => (
                    <button
                      key={pidx}
                      onClick={() => setCurrentIdx(pidx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIdx === pidx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Slide ${pidx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/10"
                  aria-label="Next Project"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Project Details & App Specs (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  APP BUILD // 0{currentIdx + 1} OF {projects.length || 1}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9 (12k Ratings)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeProject.title}</h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                {activeProject.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="mt-5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold tracking-wider">
                  Mobile Architecture & Frameworks
                </span>
                <div className="flex flex-wrap gap-2">
                  {(activeProject.techStack || []).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: App Store & Play Store (independent & optional) */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
                {appStoreUrl && (
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors border border-white/15 shadow-md hover:border-white/30"
                    title="Download on Apple App Store"
                  >
                    <Apple className="w-3.5 h-3.5 text-white" />
                    <span>App Store</span>
                  </a>
                )}
                {playStoreUrl && (
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-white font-semibold text-xs transition-colors border border-emerald-500/30 shadow-md shadow-emerald-500/10"
                    title="Get it on Google Play Store"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                    <span>Google Play</span>
                  </a>
                )}
                {webDemoUrl && (
                  <a
                    href={webDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-600/30"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                    <span>Live Demo</span>
                  </a>
                )}
                {activeProject.repoLink && (
                  <a
                    href={activeProject.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors border border-white/5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>SDK Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Highlights Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Mobile Engineering Standards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Offline Sync & Local SQLite Caching</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Biometric FaceID & Keychain Sec</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>120Hz ProMotion Fluid Gestures</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Memory Leaks & 60 FPS Scroll</span>
                </div>
              </div>
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

export default FeatureCarouselLayout;
