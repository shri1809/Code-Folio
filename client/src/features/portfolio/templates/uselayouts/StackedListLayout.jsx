import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Search,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Tag,
  Feather,
  Copy,
  Check,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const StackedListLayout = ({ data, roleConfig }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [expandedArticleIdx, setExpandedArticleIdx] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCopyQuote = (quote) => {
    navigator.clipboard?.writeText(quote);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-100 font-sans selection:bg-orange-500/30 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[350px] bg-orange-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Editorial Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-orange-400">
                <Feather className="w-4 h-4 text-orange-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Editorial & Technical Documentation'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold">
                    BYLINE VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
                {profile.name || user.username || 'Staff Author'}
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
                    <span>CURRICULUM_VITAE.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>EDITORIAL INQUIRY</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-2xl font-serif"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Essays, investigative longform, and comprehensive developer documentation.' }}
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

        {/* Search & Tag Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search essays, guides & documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Showing {filteredProjects.length} published pieces</span>
          </div>
        </div>

        {/* Stacked Articles List */}
        <div className="space-y-4">
          {filteredProjects.map((article, idx) => {
            const isExpanded = expandedArticleIdx === idx;
            return (
              <motion.div
                key={idx}
                layout
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl hover:border-orange-500/30 transition-colors"
              >
                {/* List Item Summary Bar */}
                <div
                  onClick={() => setExpandedArticleIdx(isExpanded ? null : idx)}
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs font-mono text-orange-400 mb-1.5">
                      <span className="uppercase font-bold tracking-wider">ISSUE // 0{idx + 1}</span>
                      <span className="text-slate-500">•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> 6 min read
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-black text-white hover:text-orange-300 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Article Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 font-serif text-slate-300 text-sm leading-relaxed"
                    >
                      {article.screenshot && (
                        <div className="rounded-xl overflow-hidden aspect-[21/9] my-4 border border-white/10">
                          <img
                            src={article.screenshot}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-slate-950/60 border-l-4 border-orange-500 text-slate-200 italic font-serif my-4">
                        "{article.description}"
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 font-sans">
                        <div className="flex flex-wrap gap-1.5">
                          {(article.techStack || []).map((t, tidx) => (
                            <span
                              key={tidx}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-orange-500/10 text-orange-300 border border-orange-500/20"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {article.liveLink && (
                          <a
                            href={article.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
                          >
                            <span>Read Full Publication</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'author'}
      />
    </div>
  );
};

export default StackedListLayout;
