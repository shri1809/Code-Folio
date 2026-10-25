import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Eye,
  Award,
  Palette,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const VisualMasonryGalleryLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  // Filter projects by tag or search
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    const tags = (project.techStack || []).map((t) => t.toLowerCase());
    return tags.some((t) => t.includes(activeFilter.toLowerCase()));
  });

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null && filteredProjects.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredProjects.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null && filteredProjects.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + filteredProjects.length) % filteredProjects.length);
    }
  };

  const currentLightboxProject =
    lightboxIndex !== null ? filteredProjects[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Visual Accent Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#0c1df2]/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Gallery Artist Hero Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <Palette className="w-3.5 h-3.5" />
                  {roleConfig?.title || 'Visual Artist & Creator'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#0c1df2] to-pink-500 text-white uppercase tracking-wider shadow-sm">
                    GALLERY PRO
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Visual Creator'}
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
                    <span>Exhibition CV</span>
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
                <span>Book Commissions</span>
              </Button>
            </div>
          </div>

          {/* Artist Bio & Mediums */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-[#4251f7]" />
                <span>Artist Statement</span>
              </h3>
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Specializing in evocative visual narratives, photographic compositions, character concept art, and high-impact editorial creative directions.
                </p>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Website / Studio"
                  >
                    <Globe className="w-4 h-4" />
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
              </div>
            </div>

            {/* Disciplines & Mediums Box */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Disciplines & Mediums</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...(skills.frontend || []),
                    ...(skills.backend || []),
                    ...(skills.devops || []),
                  ].length > 0 ? (
                    [
                      ...(skills.frontend || []),
                      ...(skills.backend || []),
                      ...(skills.devops || []),
                    ].map((item, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-200 border border-white/5"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    ['Digital Illustration', 'Editorial Photography', 'Concept Art', 'Lightroom Classic', 'Capture One', 'Photoshop'].map((m, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.04] text-slate-200 border border-white/5"
                      >
                        {m}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
                <span>Available for Commissions</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        {/* Gallery Filter & Count Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'editorial', 'commercial', 'concept', 'series'].map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  activeFilter === filterKey
                    ? 'bg-[#0c1df2] text-white shadow-[0_0_15px_rgba(12,29,242,0.4)]'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#4251f7]" />
            <span>Showing {filteredProjects.length} Works</span>
          </div>
        </div>

        {/* Masonry Image Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No artworks found in this category.</p>
            <p className="text-slate-600 text-xs mt-1">Select "all" or add visual projects in your dashboard.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredProjects.map((project, idx) => {
              const screenshotUrl =
                project.screenshot ||
                `https://images.unsplash.com/photo-${1550000000000 + (idx % 10) * 1000000}?w=800&q=80`;

              return (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-300"
                >
                  <img
                    src={screenshotUrl}
                    alt={project.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80';
                    }}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay with Metadata */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                        Plate #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <ZoomIn className="w-4 h-4 text-white/80" />
                    </div>

                    <h4 className="text-base font-bold text-white mb-1 leading-snug">
                      {project.title}
                    </h4>

                    {project.description && (
                      <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/20 text-white backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All visual works protected by copyright.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Curated with CodeFolio</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Commission Work</span>
            </Button>
          </div>
        </footer>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxProject && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-400">
                {lightboxIndex + 1} / {filteredProjects.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold">{currentLightboxProject.title}</h3>
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Image with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center p-4 min-h-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightbox();
              }}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition z-10"
              title="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={
                currentLightboxProject.screenshot ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80'
              }
              alt={currentLightboxProject.title}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightbox();
              }}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition z-10"
              title="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Info Bar */}
          <div className="max-w-4xl mx-auto w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <p className="line-clamp-2 text-slate-400 max-w-xl">
              {currentLightboxProject.description || 'Visual piece created for exhibition & editorial feature.'}
            </p>
            <div className="flex items-center gap-3">
              {currentLightboxProject.liveLink && (
                <a
                  href={currentLightboxProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c1df2] hover:bg-[#0c1df2]/80 text-white rounded-lg font-bold transition"
                >
                  <span>View Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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

export default VisualMasonryGalleryLayout;

