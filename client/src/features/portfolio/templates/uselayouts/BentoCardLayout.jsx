import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  TrendingUp,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  CheckCircle2,
  Share2,
  Search,
  Megaphone,
  Box,
  Palette,
  BarChart3,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const BentoCardLayout = ({ data, roleConfig }) => {
  const [activeTier, setActiveTier] = useState('growth');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const isMarketing = ['growth-marketer', 'social-media-manager', 'pr-specialist', 'seo-specialist'].includes(roleConfig?.id);
  const isCopywriter = roleConfig?.id === 'copywriter';

  return (
    <div className="min-h-screen bg-[#080a10] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-white relative">
      {/* Background radial spotlights */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Hero */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-purple-400">
                <LayoutGrid className="w-4 h-4 text-purple-400" />
                <span className="font-semibold tracking-wider uppercase">
                  {roleConfig?.title || 'Brand, Growth & Design Strategist'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Creative Strategist'}
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
                    <span>PRESS_KIT.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 text-xs bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/25"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>BOOK STRATEGY CALL</span>
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'High-converting brand identities, measurable growth campaigns, and impactful visual assets.' }}
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

        {/* Magnified Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Featured Project / Main Spotlight (Spans 2 cols, 2 rows) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 lg:col-span-2 md:row-span-2 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  FLAGSHIP SHOWCASE
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>

              {projects[0]?.screenshot && (
                <div className="rounded-2xl overflow-hidden aspect-video mb-5 border border-white/10 relative">
                  <img
                    src={projects[0].screenshot}
                    alt={projects[0]?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-purple-300 transition-colors">
                {projects[0]?.title || 'Multi-Channel Brand Scale'}
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                {projects[0]?.description || 'Complete end-to-end design identity, conversion copywriting, and viral campaign scaling across global platforms.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(projects[0]?.techStack || ['Figma', 'Brand Identity', 'Conversion Rate Opt']).map((t, tidx) => (
                  <span key={tidx} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
              {projects[0]?.liveLink && (
                <a
                  href={projects[0].liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
                >
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Card 2: Strategic KPI & Growth Matrix (Col 3) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-1 lg:col-span-1 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase mb-4">
                <BarChart3 className="w-4 h-4" />
                <span>Impact & Metrics</span>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Conversion Uplift</span>
                  <span className="text-2xl font-black text-emerald-400">+148%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Total Organic Impressions</span>
                  <span className="text-2xl font-black text-cyan-400">14.8M+</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">Average ROAS</span>
                  <span className="text-2xl font-black text-purple-400">4.6x</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Deliverables & Capabilities (Col 4) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-1 lg:col-span-1 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold uppercase mb-4">
                <Layers className="w-4 h-4" />
                <span>Core Capabilities</span>
              </div>
              <div className="space-y-2 text-xs">
                {(skills.frontend || ['Brand Guidelines', 'Logo Design', 'Packaging Dielines', 'Ad Copywriting', 'SEO Optimization']).map((cap, cidx) => (
                  <div key={cidx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Secondary Project / Portfolio Card (Spans 2 cols) */}
          {projects[1] && (
            <motion.div
              whileHover={{ y: -4 }}
              className="md:col-span-2 lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl hover:border-purple-500/40 transition-colors group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">
                  PROJECT SPEC // 02
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {projects[1].title}
                </h3>
                <p className="text-slate-300 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {projects[1].description}
                </p>
                {projects[1].screenshot && (
                  <div className="rounded-xl overflow-hidden aspect-[21/9] mt-4 border border-white/10">
                    <img
                      src={projects[1].screenshot}
                      alt={projects[1].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(projects[1].techStack || []).slice(0, 3).map((t, tidx) => (
                    <span key={tidx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
                {projects[1].liveLink && (
                  <a
                    href={projects[1].liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Card 5: Service Package Tiers (Spans 2 cols) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-purple-400">
                  ENGAGEMENT PACKAGES
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl">
                  {['starter', 'growth', 'enterprise'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setActiveTier(tier)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-colors ${
                        activeTier === tier ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                {activeTier === 'starter' && (
                  <div>
                    <h4 className="text-base font-bold text-white">Brand Foundation Sprint</h4>
                    <p className="text-slate-300 text-xs mt-1">Core logo mark, typography hierarchy, primary color tokens & brand voice guidelines.</p>
                    <span className="text-xs font-mono text-purple-400 font-bold block mt-3">2-Week Turnaround • Full Vector Deliverables</span>
                  </div>
                )}
                {activeTier === 'growth' && (
                  <div>
                    <h4 className="text-base font-bold text-white">Full-Funnel Growth & Identity Overhaul</h4>
                    <p className="text-slate-300 text-xs mt-1">Complete brand identity, high-converting copy decks, social media assets & conversion landing pages.</p>
                    <span className="text-xs font-mono text-purple-400 font-bold block mt-3">4-Week Engagement • Unlimited Concept Revisions</span>
                  </div>
                )}
                {activeTier === 'enterprise' && (
                  <div>
                    <h4 className="text-base font-bold text-white">Global Creative & Performance Retainer</h4>
                    <p className="text-slate-300 text-xs mt-1">Dedicated strategic creative direction, multi-channel campaign scaling, ongoing A/B testing & press kits.</p>
                    <span className="text-xs font-mono text-purple-400 font-bold block mt-3">Monthly Retainer • Priority SLA & Direct Slack Access</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Custom scopes available upon request</span>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300"
              >
                Inquire Rates &rarr;
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'creator'}
      />
    </div>
  );
};

export default BentoCardLayout;
