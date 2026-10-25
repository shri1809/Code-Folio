import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clapperboard,
  Sparkles,
  Users,
  Layers,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  BookOpen,
  Award,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const DiscreteTabsLayout = ({ data, roleConfig }) => {
  const [activeTab, setActiveTab] = useState('script');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const tabs = [
    { id: 'script', label: 'Screenplay Scene Draft', icon: FileText },
    { id: 'beat-sheet', label: '3-Act Beat Sheet', icon: Layers },
    { id: 'characters', label: 'Character Bible', icon: Users },
    { id: 'pitch', label: 'Pitch Deck & Logline', icon: Clapperboard },
  ];

  const activeProject = projects[0] || {
    title: 'THE CHRONO ENGINE (Feature Spec)',
    description: 'When an atmospheric physicist discovers a temporal echo inside an Antarctic ice core, she must outrun a rogue private military consortium before the timeline collapses.',
    techStack: ['Sci-Fi Thriller', 'Feature Film', '114 Pages', 'WGA West Registered'],
    screenshot: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1000&q=80',
  };

  return (
    <div className="min-h-screen bg-[#07090f] text-slate-100 font-sans selection:bg-yellow-500/30 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 right-1/3 w-[600px] h-[350px] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-yellow-400">
                <Clapperboard className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Screenwriter & Dramatic Playwright'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold">
                    WGA CREDITED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
                {profile.name || user.username || 'Dramatic Playwright'}
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
                    <span>FEATURE_SPEC.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-500/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE REPS / OPTIONS</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-2xl font-serif"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Feature specs, TV pilots, and dramatic theatre plays written in standard industry screenplay formatting.' }}
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

          {/* Script Spec Bar */}
          <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">PRIMARY GENRE</span>
              <span className="font-bold text-yellow-400">Sci-Fi & Thriller</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">DRAFT STATUS</span>
              <span className="font-bold text-white">Polish Draft v3.2</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">PAGE COUNT</span>
              <span className="font-bold text-white">114 Pages</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
              <span className="text-[10px] text-slate-500 block">REPRESENTATION</span>
              <span className="font-bold text-emerald-400">Available</span>
            </div>
          </div>
        </header>

        {/* Discrete Tabs Switcher */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-white/10 font-mono text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/40 shadow-md shadow-yellow-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Discrete Tab Contents */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'script' && (
              <motion.div
                key="script"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider">
                    EXCERPT: ACT II // SCENE 42
                  </span>
                  <span className="text-xs font-mono text-slate-500">COURIER 12PT STANDARD</span>
                </div>

                {/* Formal Screenplay Block */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#fdfbf7] text-slate-900 font-mono text-xs sm:text-sm leading-relaxed shadow-inner max-w-2xl mx-auto border border-amber-200">
                  <p className="font-bold uppercase tracking-wider mb-4">
                    EXT. ANTARCTIC RESEARCH DRILL SITE - NIGHT
                  </p>
                  <p className="mb-4">
                    A violent katabatic gale screams across the whiteout expanse.
                    Floodlights shudder violently against their steel moorings.
                  </p>
                  <p className="mb-4">
                    DR. ELENA VANCE (30s), wearing frosted glacier goggles, watches
                    the acoustic telemetry monitor flicker wildly.
                  </p>
                  <div className="text-center my-4">
                    <p className="font-bold tracking-wider">ELENA</p>
                    <p className="italic text-xs text-slate-700">(into satellite comms)</p>
                    <p className="max-w-md mx-auto text-left pl-6 pr-6 mt-1">
                      Control, the seismic frequency isn't echoing down. It's radiating
                      UP from inside the ice core. It's alive.
                    </p>
                  </div>
                  <p className="mb-4">
                    A heavy metallic CLANK echoes from behind the generator bay.
                    Elena spins around. The snow illuminates two laser targeting dots.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'beat-sheet' && (
              <motion.div
                key="beat-sheet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 font-mono text-xs"
              >
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-yellow-400 font-bold uppercase block mb-1">ACT I: THE STATUS QUO & INCITING INCIDENT</span>
                  <p className="text-slate-300">Elena isolates an anomalous acoustic signature deep inside ice sediment older than human civilization.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-yellow-400 font-bold uppercase block mb-1">ACT II (PART 1): RISING COMPLICATIONS & THE MIDPOINT</span>
                  <p className="text-slate-300">A black-budget PMC seals off the research facility. Elena decodes the temporal signal and realizes it's a message from 48 hours into the future.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-yellow-400 font-bold uppercase block mb-1">ACT II (PART 2): ALL HOPE IS LOST & DARK NIGHT OF THE SOUL</span>
                  <p className="text-slate-300">Her transport is shot down over the polar ice shelf. Freezing and cornered, she must trigger the engine pulse herself.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                  <span className="text-yellow-400 font-bold uppercase block mb-1">ACT III: THE CLIMAX & RESOLUTION</span>
                  <p className="text-slate-300">A race against both the strike team and temporal collapse resets the timeline, preserving the future at personal cost.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'characters' && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs font-mono font-bold text-yellow-400 uppercase">PROTAGONIST</span>
                  <h3 className="text-lg font-bold text-white mt-1">Dr. Elena Vance</h3>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                    Brilliant atmospheric physicist driven by the unresolved loss of her research partner. Skeptical of military authority; hyper-observant under mortal pressure.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs font-mono font-bold text-yellow-400 uppercase">ANTAGONIST</span>
                  <h3 className="text-lg font-bold text-white mt-1">Commander Sterling Hayes</h3>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                    Ruthless PMC director who believes temporal preemptive strikes are the only path to national survival. Methodical, calm, and fanatically mission-focused.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'pitch' && (
              <motion.div
                key="pitch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-xs font-mono font-bold text-yellow-400 uppercase block mb-2">
                    ONE-LINE LOGLINE
                  </span>
                  <p className="text-lg font-serif italic text-white leading-relaxed">
                    "{activeProject.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 uppercase block mb-1">COMPARABLE TITLES</span>
                    <span className="text-slate-200 font-bold">ARRIVAL meets THE THING</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-slate-500 uppercase block mb-1">TARGET MARKET</span>
                    <span className="text-slate-200 font-bold">Theatrical / Prestige Streaming</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'writer'}
      />
    </div>
  );
};

export default DiscreteTabsLayout;
