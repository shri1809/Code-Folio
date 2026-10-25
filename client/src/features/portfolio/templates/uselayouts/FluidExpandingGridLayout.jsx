import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  LineChart,
  Brain,
  Sparkles,
  Maximize2,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  CheckCircle2,
  Database,
  Layers,
  Utensils,
  Award,
  Calendar,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const FluidExpandingGridLayout = ({ data, roleConfig }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const isModel = roleConfig?.id === 'fashion-model';
  const isChef = roleConfig?.id === 'culinary-artist';

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-white relative">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 mb-10 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400">
                {isModel ? (
                  <Sparkles className="w-4 h-4 text-pink-400" />
                ) : isChef ? (
                  <Utensils className="w-4 h-4 text-amber-400" />
                ) : (
                  <Brain className="w-4 h-4 text-emerald-400" />
                )}
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Data Science & Analytical Engineering'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold">
                    VERIFIED EXPERT
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Analyst / Specialist'}
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
                    <span>{isModel ? 'COMP_CARD.PDF' : isChef ? 'TASTING_MENU.PDF' : 'VITAE_CV.PDF'}</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE / COLLABORATE</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Specialized portfolio showcasing fluid case studies, dimensional metrics, and project distributions.' }}
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

          {/* Special Dimension Badges (Model / Chef / Data Science) */}
          {isModel ? (
            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">HEIGHT</span>
                <span className="font-bold text-white">5'10" / 178 cm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">BUST / CHEST</span>
                <span className="font-bold text-white">34" / 86 cm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">WAIST</span>
                <span className="font-bold text-white">25" / 63 cm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">HIPS</span>
                <span className="font-bold text-white">35" / 89 cm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">SHOE</span>
                <span className="font-bold text-white">8.5 US / 39 EU</span>
              </div>
            </div>
          ) : isChef ? (
            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">CUISINE FOCUS</span>
                <span className="font-bold text-amber-400">Modern French & Pastry</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">MICHELIN EXP</span>
                <span className="font-bold text-white">2-Star Background</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">PRIVATE DINING</span>
                <span className="font-bold text-emerald-400">Available</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">CURRENT RESIDENCY</span>
                <span className="font-bold text-white">Atelier Botanica</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">MODEL METRIC</span>
                <span className="font-bold text-emerald-400">96.4% AUC-ROC</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">DATA VOLUME</span>
                <span className="font-bold text-white">100M+ Records</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">INFERENCE LATENCY</span>
                <span className="font-bold text-cyan-400">8.2ms Batch</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-500 block">FRAMEWORK</span>
                <span className="font-bold text-white">PyTorch & Spark</span>
              </div>
            </div>
          )}
        </header>

        {/* Fluid Expanding Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>{isModel ? 'Editorial & Runway Spreads' : isChef ? 'Culinary Portfolios & Menus' : 'Empirical Research & Case Studies'}</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">Click any card to expand deep view</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                layoutId={`card-${idx}`}
                onClick={() => setSelectedItem({ ...proj, index: idx })}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden cursor-pointer shadow-lg hover:border-emerald-500/40 transition-colors flex flex-col justify-between group"
              >
                <div>
                  {proj.screenshot ? (
                    <div className="aspect-[4/3] w-full overflow-hidden relative">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-slate-950 flex items-center justify-center text-slate-600">
                      <Layers className="w-10 h-10" />
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                      STUDY // 0{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-slate-300 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {(proj.techStack || []).slice(0, 3).map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                    {(proj.techStack || []).length > 3 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                        +{(proj.techStack || []).length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Fullscreen Fluid Expanding Card Modal */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
              <motion.div
                layoutId={`card-${selectedItem.index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {selectedItem.screenshot && (
                  <div className="rounded-xl overflow-hidden aspect-video mb-6 border border-white/10">
                    <img
                      src={selectedItem.screenshot}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  CASE STUDY SPECIFICATION // 0{selectedItem.index + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedItem.title}</h2>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2 font-bold">
                    Methodologies & Architecture
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedItem.techStack || []).map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  {selectedItem.repoLink && (
                    <a
                      href={selectedItem.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Notebook / Repo</span>
                    </a>
                  )}
                  {selectedItem.liveLink && (
                    <a
                      href={selectedItem.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live Experiment</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'specialist'}
      />
    </div>
  );
};

export default FluidExpandingGridLayout;
