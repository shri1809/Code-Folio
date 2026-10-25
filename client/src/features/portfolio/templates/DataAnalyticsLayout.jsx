import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  LineChart,
  BarChart2,
  PieChart,
  Database,
  Cpu,
  Github,
  Linkedin,
  FileDown,
  Mail,
  ExternalLink,
  Table,
  CheckCircle2,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const DataAnalyticsLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans relative selection:bg-[#0c1df2]/40 selection:text-white">
      {/* Background Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-cyan-400">
                <Brain className="w-4 h-4 text-[#0c1df2]" />
                <span className="font-semibold tracking-wider">{roleConfig?.title || 'Data Scientist & ML Engineer'}</span>
                {user.isPro && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-[#0c1df2] to-cyan-500 text-white font-bold tracking-wider">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Data Scientist'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="glass" size="sm" className="gap-2 font-mono text-xs">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>CURRICULUM VITAE</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 font-mono text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INQUIRE / CONSULT</span>
              </Button>
            </div>
          </div>

          <div className="pt-6">
            {safeBio ? (
              <div
                className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl"
                dangerouslySetInnerHTML={{ __html: safeBio }}
              />
            ) : (
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
                Developing predictive machine learning models, statistical causal inference frameworks, and production inference microservices at scale.
              </p>
            )}
          </div>
        </header>

        {/* Statistical KPI Metrics Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Model Precision</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">96.4%</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+4.2% vs Baseline</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Data Points Trained</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">14.8M+</div>
            <span className="text-[11px] text-cyan-400 font-mono mt-1">Multi-modal features</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Inference Latency</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">&lt; 14ms</div>
            <span className="text-[11px] text-[#4251f7] font-mono mt-1">TensorRT optimized</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Published Research</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">{projects.length} Studies</div>
            <span className="text-[11px] text-slate-400 font-mono mt-1">Open source notebooks</span>
          </div>
        </section>

        {/* Notebook Style Case Studies & Projects */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-[#0c1df2]" />
              <h2 className="text-lg font-bold text-white tracking-wide uppercase font-mono">
                Statistical Research &amp; Notebook Case Studies
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">JUPYTER / COLAB ARTIFACTS</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center glass-card">
              <p className="text-sm text-slate-500">No data studies published yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {projects.map((proj, idx) => {
                const safeDesc = DOMPurify.sanitize(proj.description || '');
                return (
                  <article
                    key={proj.id || idx}
                    className="rounded-2xl glass-card border border-white/10 overflow-hidden shadow-lg"
                  >
                    {/* Notebook Header Bar */}
                    <div className="px-6 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                        <span className="ml-2 font-semibold text-white">study_{idx + 1}.ipynb</span>
                      </div>
                      <span className="text-cyan-400 text-[11px]">Python 3.11 • PyTorch</span>
                    </div>

                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{proj.title}</h3>
                          {safeDesc && (
                            <div
                              className="text-sm text-slate-300 leading-relaxed mb-6"
                              dangerouslySetInnerHTML={{ __html: safeDesc }}
                            />
                          )}

                          {proj.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {proj.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-xs font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-cyan-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            {proj.repoLink && (
                              <a
                                href={proj.repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white transition"
                              >
                                <Github className="w-4 h-4" />
                                <span>Notebook Code</span>
                              </a>
                            )}
                            {proj.liveLink && (
                              <a
                                href={proj.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#4251f7] hover:text-white transition"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Kaggle / Live Demo</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {proj.screenshot && (
                          <div className="md:w-80 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                            <img
                              src={proj.screenshot}
                              alt={proj.title}
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Technical Data Tooling & Skills */}
        <section className="mb-14">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#4251f7] font-bold mb-6">
            Analytics Tooling &amp; Algorithmic Frameworks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#0c1df2]" />
                <span>ML &amp; Deep Learning</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.backend?.length > 0 ? skills.backend : ['PyTorch', 'TensorFlow', 'scikit-learn']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Visualization &amp; BI</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.frontend?.length > 0 ? skills.frontend : ['Streamlit', 'Plotly', 'D3.js']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Data Infra &amp; MLOps</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skills.devops?.length > 0 ? skills.devops : ['BigQuery', 'Snowflake', 'MLflow', 'Docker']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 font-mono text-xs text-slate-500">
          <p>CODEFOLIO // {roleConfig?.title?.toUpperCase() || 'DATA SCIENCE & AI'}</p>
        </footer>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'developer'}
      />
    </div>
  );
};

export default DataAnalyticsLayout;

