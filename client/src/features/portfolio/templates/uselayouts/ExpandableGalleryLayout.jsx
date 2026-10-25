import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Sparkles,
  Layers,
  Compass,
  Eye,
  Sliders,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const ExpandableGalleryLayout = ({ data, roleConfig }) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const isArchitect = roleConfig?.id === 'architect';
  const isFashion = roleConfig?.id === 'fashion-designer';
  const isTattoo = roleConfig?.id === 'tattoo-artist';

  const selectedPhoto = selectedPhotoIdx !== null ? projects[selectedPhotoIdx] : null;

  const nextPhoto = () => {
    if (selectedPhotoIdx === null || projects.length <= 1) return;
    setSelectedPhotoIdx((prev) => (prev + 1) % projects.length);
  };

  const prevPhoto = () => {
    if (selectedPhotoIdx === null || projects.length <= 1) return;
    setSelectedPhotoIdx((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-sky-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-sky-400">
                <Camera className="w-4 h-4 text-sky-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Visual Photography & Spatial Design'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold">
                    PRO PORTFOLIO
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Visual Artist'}
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
                    <span>LOOKBOOK_CV.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>BOOK SESSION / COMMISSION</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Curated visual showcase capturing spatial depth, natural light, and structural precision.' }}
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

          {/* Camera / Gear Spec Bar */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{isArchitect ? 'CAD / BIM Tools:' : isTattoo ? 'Ink Specialty:' : 'Primary Camera Body:'}</span>
              <span className="font-bold text-sky-400">
                {isArchitect ? 'Revit & Rhino 3D' : isTattoo ? 'Fine-Line & Blackwork' : 'Sony A7R V / Hasselblad X2D'}
              </span>
            </div>
            <span className="text-slate-400">Client Commissions Open Globally</span>
          </div>
        </header>

        {/* Gallery Masonry Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>Expandable Portfolio Gallery</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Click to view fullscreen plate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item, idx) => (
              <motion.div
                key={idx}
                layoutId={`gallery-item-${idx}`}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPhotoIdx(idx)}
                className="rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl cursor-pointer group hover:border-sky-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  {item.screenshot ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                      <img
                        src={item.screenshot}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-slate-950 flex items-center justify-center text-slate-600">
                      <Camera className="w-10 h-10" />
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-[10px] font-mono text-sky-400 uppercase font-bold tracking-wider block mb-1">
                      COLLECTION // 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {(item.techStack || []).slice(0, 3).map((t, tidx) => (
                      <span key={tidx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg">
              <motion.div
                layoutId={`gallery-item-${selectedPhotoIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto relative flex flex-col justify-between"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhotoIdx(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main Lightbox Frame */}
                <div>
                  {selectedPhoto.screenshot && (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-6 border border-white/10 bg-black">
                      <img
                        src={selectedPhoto.screenshot}
                        alt={selectedPhoto.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                        PLATE 0{selectedPhotoIdx + 1} OF {projects.length}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedPhoto.title}</h2>
                    </div>

                    {selectedPhoto.liveLink && (
                      <a
                        href={selectedPhoto.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors self-start sm:self-auto"
                      >
                        <span>Full Resolution Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                    {selectedPhoto.description}
                  </p>

                  {/* EXIF / Metadata Bar */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">LENS</span>
                      <span className="font-bold text-slate-200">85mm f/1.4 GM</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">APERTURE</span>
                      <span className="font-bold text-sky-400">f/2.0</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">SHUTTER</span>
                      <span className="font-bold text-slate-200">1/1250s</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ISO</span>
                      <span className="font-bold text-slate-200">ISO 100</span>
                    </div>
                  </div>
                </div>

                {/* Lightbox Nav Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={prevPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
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

export default ExpandableGalleryLayout;
