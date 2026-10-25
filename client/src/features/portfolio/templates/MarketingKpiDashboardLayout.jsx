import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  ExternalLink,
  Mail,
  FileDown,
  Linkedin,
  Twitter,
  Globe,
  ArrowUpRight,
  PieChart,
  Megaphone,
  CheckCircle2,
  DollarSign,
  Users,
  Search,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const MarketingKpiDashboardLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeCampaignIdx, setActiveCampaignIdx] = useState(0);

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

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative">
      {/* Ambient Grid Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#0c1df2_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Growth Strategist Header */}
        <header className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 sm:p-10 mb-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c1df2]/20 text-[#4251f7] border border-[#0c1df2]/30 flex items-center gap-1.5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {roleConfig?.title || 'Growth & Performance Marketer'}
                </span>
                {user.isPro && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0c1df2] text-white">
                    PRO STRATEGIST
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Growth Marketer'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                @{user.username} {user.customDomain && `• ${user.customDomain}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 text-xs font-mono">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>GROWTH RESUME</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenContact}
                className="gap-2 text-xs font-mono"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>BOOK AUDIT</span>
              </Button>
            </div>
          </div>

          {/* Bio & Social Channels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <div className="lg:col-span-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-[#4251f7]" />
                <span>Growth Strategy & Acquisition Edge</span>
              </h3>
              {safeBio ? (
                <div
                  className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3"
                  dangerouslySetInnerHTML={{ __html: safeBio }}
                />
              ) : (
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Scaling customer acquisition and revenue efficiency via paid search, programmatic SEO, high-converting copywriting, and funnel conversion optimization.
                </p>
              )}

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
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
                {profile.socialLinks?.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
                    title="Agency / Newsletter"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Growth Channels & Toolkit */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Acquisition Channels & Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ...(skills.frontend || []),
                  ...(skills.backend || []),
                  ...(skills.devops || []),
                ].length > 0 ? (
                  [
                    ...(skills.frontend || []),
                    ...(skills.backend || []),
                    ...(skills.devops || []),
                  ].map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  ['Google Ads', 'Meta Ads', 'Technical SEO', 'Klaviyo', 'Segment', 'HubSpot', 'Conversion Rate Optimization'].map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </header>

        {/* HIGH-IMPACT KPI PERFORMANCE TILES */}
        <section className="mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Average ROAS</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono flex items-center gap-1">
                <span>+380%</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Blended paid ad spend</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">CAC Reduction</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono flex items-center gap-1">
                <span>-42.5%</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Payback period: &lt;60 days</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Organic Traffic</span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono flex items-center gap-1">
                <span>1.8M/mo</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Zero ad spend SEO</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-1">
              <span className="text-xs font-mono text-slate-400 uppercase">Revenue Generated</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono flex items-center gap-1">
                <span>$4.2M+</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-500">Trackable pipeline attribution</p>
            </div>
          </div>
        </section>

        {/* CAMPAIGN CASE STUDIES & A/B TEST BREAKDOWNS */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4251f7]" />
              <span>Proven Growth Case Studies</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {projects.length} Campaigns
            </span>
          </div>

          <div className="space-y-8">
            {projects.map((proj, idx) => {
              const screenshotUrl =
                proj.screenshot ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80';

              return (
                <article
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10">
                    {/* Left: Campaign Screenshot / Graph */}
                    <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video lg:aspect-auto">
                      <img
                        src={screenshotUrl}
                        alt={proj.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80';
                        }}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* Right: Growth Narrative & Funnel Breakdown */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                          <span className="px-2 py-0.5 rounded bg-[#0c1df2] text-white font-bold">
                            CAMPAIGN #{idx + 1}
                          </span>
                          <span>•</span>
                          <span>PERFORMANCE VERIFIED</span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-white mb-3">
                          {proj.title}
                        </h3>

                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                          {proj.description ||
                            'Restructured acquisition channels, eliminated unprofitable keyword bidding, and deployed modular landing pages that increased conversion by 54%.'}
                        </p>

                        {/* Funnel Metric Pills */}
                        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">CTR Lift</span>
                            <span className="text-emerald-400 font-bold text-sm">+85.4%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Conv. Rate</span>
                            <span className="text-cyan-400 font-bold text-sm">4.8% vs 2.1%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Payback</span>
                            <span className="text-indigo-400 font-bold text-sm">38 Days</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.techStack?.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {proj.liveLink && (
                          <a
                            href={proj.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="primary" size="sm" className="gap-2 text-xs font-mono">
                              <span>VIEW CASE</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. Growth portfolio verified.</p>
          <div className="flex items-center gap-3">
            <span>Powered by CodeFolio Performance Engine</span>
            <Button
              variant="glass"
              size="sm"
              onClick={handleOpenContact}
              className="text-xs gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Request Growth Audit</span>
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

export default MarketingKpiDashboardLayout;

