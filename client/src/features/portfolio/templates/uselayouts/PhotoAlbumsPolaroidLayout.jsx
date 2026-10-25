import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Maximize2,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Sparkles,
  Layers,
  Brush,
  Camera,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const PhotoAlbumsPolaroidLayout = ({ data, roleConfig }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  // Realistic slight rotational tilts for polaroids
  const rotations = [-2.5, 3.2, -1.8, 2.7, -3.4, 1.9];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-white relative">
      {/* Background canvas grain texture simulation */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#262c3b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400">
                <Palette className="w-4 h-4 text-amber-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Concept Artist & Visual Illustrator'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
                    STUDIO LEAD
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Concept Artist'}
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
                    <span>ART_CV.PDF</span>
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
                <span>INQUIRE COMMISSIONS</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specializing in environmental worldbuilding, key art visual storytelling, and creature designs for entertainment studios.' }}
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

          {/* Tools & Palette Strip */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Primary Medium:</span>
              {(skills.frontend || ['Photoshop CC', 'Procreate', 'Blender 3D', '3DCoat', 'Substance']).map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-white/5">
                  {t}
                </span>
              ))}
            </div>
            <span className="text-slate-400">Available for Freelance & Feature Film Concept Art</span>
          </div>
        </header>

        {/* Polaroid Album Deck */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Visual Gallery & Polaroid Stacks (Click to Inspect)</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">High-Resolution Canvas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {projects.map((proj, idx) => {
              const rotation = rotations[idx % rotations.length];
              return (
                <motion.div
                  key={idx}
                  style={{ rotate: `${rotation}deg` }}
                  whileHover={{ rotate: 0, scale: 1.04, zIndex: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedArtwork(proj)}
                  className="rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] text-slate-900 shadow-2xl cursor-pointer select-none group border border-slate-300"
                >
                  {/* Polaroid Image Frame */}
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 relative shadow-inner">
                    <img
                      src={proj.screenshot || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Polaroid Handwritten Style Caption */}
                  <div className="pt-4 pb-2 px-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-black text-lg text-slate-900 tracking-tight">
                        {proj.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        PLATE 0{idx + 1}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Color Swatch Bar */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
                        <span className="w-3.5 h-3.5 rounded-full bg-orange-600 shadow-sm" />
                        <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-sm" />
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-700 shadow-sm" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">RGB 16-BIT</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Artwork Inspection Modal */}
        <AnimatePresence>
          {selectedArtwork && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {selectedArtwork.screenshot && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] mb-6 border border-white/10 bg-black">
                    <img
                      src={selectedArtwork.screenshot}
                      alt={selectedArtwork.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedArtwork.title}</h2>
                  {selectedArtwork.liveLink && (
                    <a
                      href={selectedArtwork.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
                    >
                      <span>Full Resolution Art</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  {selectedArtwork.description}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {(selectedArtwork.techStack || []).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'artist'}
      />
    </div>
  );
};

export default PhotoAlbumsPolaroidLayout;
