import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Clapperboard,
  Camera,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const AnimatedCollectionLayout = ({ data, roleConfig }) => {
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('cinema'); // 'cinema' (2.39:1) or 'widescreen' (16:9)
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  // Auto-play animatic sequence stepper
  useEffect(() => {
    let interval;
    if (isPlaying && projects.length > 1) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % projects.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, projects.length]);

  const activeFrame = projects[currentFrameIdx] || {
    title: 'Scene 01: The Citadel Infiltration',
    description: 'Hero approaches perimeter parapet under torrential rain. Camera pans right to reveal mechanical sentry.',
    techStack: ['Wide Establishing Shot', 'Anamorphic 2.39:1', 'Heavy Rain FX', 'Storyboard Pro'],
    screenshot: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&q=80',
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-white relative">
      {/* Background film-grain grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1e2230_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400">
                <Clapperboard className="w-4 h-4 text-amber-500" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Storyboard Artist & Sequential Narrative'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold">
                    UNION CREDITED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Storyboard Artist'}
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
                    <span>PRODUCTION_RESUME.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>BOOK FOR PRODUCTION</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specializing in feature animatics, dynamic camera angles, and action sequences for major film and streaming productions.' }}
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

        {/* Interactive Animatic Player Stage */}
        <section className="mb-10 rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                SEQUENCE PLAYBACK // FRAME 0{currentFrameIdx + 1} OF {projects.length || 1}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">{activeFrame.title}</h2>
            </div>

            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5 font-mono text-xs self-start sm:self-auto">
              <button
                onClick={() => setAspectRatio('cinema')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  aspectRatio === 'cinema' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                2.39:1 CinemaScope
              </button>
              <button
                onClick={() => setAspectRatio('widescreen')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  aspectRatio === 'widescreen' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                16:9 Widescreen
              </button>
            </div>
          </div>

          {/* Main Storyboard Canvas */}
          <div
            className={`relative rounded-2xl overflow-hidden border border-white/15 bg-black w-full mx-auto transition-all duration-300 ${
              aspectRatio === 'cinema' ? 'aspect-[2.39/1]' : 'aspect-video'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFrameIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full relative"
              >
                <img
                  src={activeFrame.screenshot || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&q=80'}
                  alt={activeFrame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Subtitle / Dialogue Cues Bar */}
                <div className="absolute bottom-4 left-6 right-6 text-center">
                  <p className="text-amber-300 font-mono text-xs sm:text-sm drop-shadow-md">
                    [ACTION]: {activeFrame.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Player Transport Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentFrameIdx((prev) => (prev - 1 + projects.length) % projects.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Previous Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'PAUSE ANIMATIC' : 'PLAY ANIMATIC'}</span>
              </button>

              <button
                onClick={() => setCurrentFrameIdx((prev) => (prev + 1) % projects.length)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                aria-label="Next Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Scrubber Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {projects.map((_, sidx) => (
                <button
                  key={sidx}
                  onClick={() => {
                    setCurrentFrameIdx(sidx);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentFrameIdx === sidx
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  0{sidx + 1}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Thumbnail Sequence Strip Grid */}
        <section>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <span>Complete Production Board Sequence</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((frame, fidx) => (
              <div
                key={fidx}
                onClick={() => {
                  setCurrentFrameIdx(fidx);
                  setIsPlaying(false);
                }}
                className={`rounded-2xl border p-4 backdrop-blur-xl cursor-pointer transition-all ${
                  currentFrameIdx === fidx
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                {frame.screenshot && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 border border-white/10 bg-black">
                    <img
                      src={frame.screenshot}
                      alt={frame.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold mb-1">
                  <span>SHOT 0{fidx + 1}</span>
                  <span>{currentFrameIdx === fidx ? 'ACTIVE' : ''}</span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{frame.title}</h4>
                <p className="text-slate-300 text-xs mt-1 line-clamp-2">{frame.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'artist'}
      />
    </div>
  );
};

export default AnimatedCollectionLayout;
