import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  BookOpen,
  Feather,
  Quote,
  Sparkles,
  ExternalLink,
  Mail,
  FileDown,
  Linkedin,
  Twitter,
  Globe,
  Clock,
  Bookmark,
  Share2,
  Newspaper,
  Award,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const EditorialPublicationLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedArticleIdx, setSelectedArticleIdx] = useState(0);

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

  const featuredStory = projects[selectedArticleIdx] || projects[0] || null;

  return (
    <div className="min-h-screen bg-[#0b0d14] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Editorial Watermark Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.05]" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Masthead Header */}
        <header className="border-b border-white/10 pb-10 mb-12">
          {/* Top Volume / Date Bar */}
          <div className="flex items-center justify-between py-2 border-y border-white/10 text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-[#4251f7] font-bold">VOL. XXIV</span>
              <span>•</span>
              <span>SPECIAL EDITION // {roleConfig?.title || 'EDITORIAL WRITER'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span className="text-cyan-400">INDEX REF: #{user.username?.toUpperCase() || 'EDITORIAL'}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <Feather className="w-3.5 h-3.5" />
                  {roleConfig?.badge || 'Author & Critic'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c1df2] text-white">
                    PRO BYLINE
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight">
                {profile.name || user.username || 'Editorial Author'}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 font-serif italic">
                Byline: @{user.username} {user.customDomain && `• ${user.customDomain}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Selected Bibliography</span>
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
                <span>Editorial Inquiry</span>
              </Button>
            </div>
          </div>

          {/* Bio & Lead Paragraph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 mt-6 border-t border-white/5">
            <div className="lg:col-span-8">
              {safeBio ? (
                <div
                  className="font-serif text-slate-300 text-base sm:text-lg leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="font-serif text-slate-300 text-base sm:text-lg leading-relaxed">
                  Investigating contemporary culture, culinary narratives, literary screenplays, and luxury design through long-form investigative journalism and essays.
                </p>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
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
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Publication / Substack"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Editorial Beats / Competencies */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 font-mono">
                  Editorial Beats & Topics
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
                    ].map((beat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-serif bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {beat}
                      </span>
                    ))
                  ) : (
                    ['Longform Essays', 'Cultural Commentary', 'Culinary Menus', 'Screenwriting', 'Feature Profiles', 'Press Statements'].map((beat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-serif bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {beat}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center gap-2">
                <Quote className="w-3.5 h-3.5 text-[#4251f7]" />
                <span className="font-serif italic">"Words that command attention."</span>
              </div>
            </div>
          </div>
        </header>

        {/* FEATURED COVER STORY / PUBLICATION */}
        {featuredStory && (
          <section className="mb-14">
            <article className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-slate-950">
                <img
                  src={
                    featuredStory.screenshot ||
                    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80'
                  }
                  alt={featuredStory.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80';
                  }}
                  className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2 text-xs font-mono text-cyan-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0c1df2] text-white font-bold uppercase tracking-wider">
                      Cover Feature
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>6 MIN READ</span>
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                    {featuredStory.title}
                  </h2>
                </div>
              </div>

              {/* Story Narrative Excerpt */}
              <div className="p-8 sm:p-10 space-y-6">
                <div className="border-l-4 border-[#0c1df2] pl-6 py-1">
                  <p className="font-serif text-lg sm:text-xl text-slate-200 italic leading-relaxed">
                    {featuredStory.description ||
                      'An excerpt from the published manuscript exploring sensory immersion, tactile textiles, and the architecture of taste.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    {featuredStory.techStack?.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {featuredStory.liveLink && (
                    <a
                      href={featuredStory.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm" className="gap-2 text-xs font-serif">
                        <span>Read Full Piece</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* PUBLISHED ARCHIVE / STORIES LIST */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4251f7]" />
              <span>Published Works & Archives</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {projects.length} Folios
            </span>
          </div>

          <div className="space-y-6">
            {projects.map((proj, idx) => {
              const isSelected = selectedArticleIdx === idx;
              return (
                <article
                  key={idx}
                  onClick={() => setSelectedArticleIdx(idx)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-[#0c1df2] bg-[#0c1df2]/5 shadow-lg'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-cyan-400">ARTICLE #{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-xs font-mono text-slate-500">READ TIME: ~4 MIN</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white mb-2 hover:text-[#4251f7] transition">
                    {proj.title}
                  </h3>

                  {proj.description && (
                    <p className="font-serif text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <div className="flex flex-wrap gap-2">
                      {proj.techStack?.map((tag, tIdx) => (
                        <span key={tIdx} className="text-slate-400 font-mono text-[11px]">
                          • {tag}
                        </span>
                      ))}
                    </div>
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4251f7] hover:text-white font-serif font-bold flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Open Story</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All essays and editorial materials reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-serif">Curated with CodeFolio Pro</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5 font-serif"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Contact Writer</span>
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

export default EditorialPublicationLayout;

