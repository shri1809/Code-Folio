import React from 'react';
import DOMPurify from 'dompurify';
import { Terminal, Shield, Cpu, Zap, Github, Linkedin, Twitter, Globe, FileText, Send, Radio } from 'lucide-react';
import ImageWithFallback from '../../../components/ImageWithFallback';
import Button from '../../../components/ui/Button';

export const CyberpunkLayout = ({ data = {}, onOpenContact }) => {
  const user = data.user || {};
  const portfolio = data.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100 font-mono selection:bg-cyan-500 selection:text-black">
      {/* Scanline overlay pattern */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-pink-950/20 z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Terminal Header */}
        <header className="border border-cyan-500/30 bg-[#0d0f1a]/90 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-[0_0_25px_rgba(6,182,212,0.15)] mb-12">
          <div className="flex items-center justify-between border-b border-cyan-950 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              <span className="ml-2 text-xs text-cyan-400/80 font-bold tracking-widest flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                SYSTEM_NODE // {user.username?.toUpperCase() || 'NETRUNNER'}
              </span>
            </div>

            {user.isPro && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border border-pink-500/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                <Zap className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs font-bold text-pink-300 tracking-wider">CYBER_PRO_ACCESS</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm mb-1">
                <Terminal className="w-4 h-4" />
                <span>ROOT_IDENTITY:</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 tracking-tight">
                {profile.name || user.username || 'ANONYMOUS_AGENT'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                HOST: {user.customDomain || `codefolio.dev/u/${user.username || 'ghost'}`}
              </p>
            </div>

            {onOpenContact && (
              <Button
                variant="cyber"
                size="sm"
                onClick={onOpenContact}
                className="self-start md:self-auto gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>RELAY_TRANSMISSION</span>
              </Button>
            )}
          </div>

          {/* Bio */}
          {safeBio ? (
            <div
              className="mt-6 p-4 rounded bg-[#090b12] border-l-2 border-cyan-400 text-slate-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeBio }}
            />
          ) : (
            <p className="mt-6 text-xs text-slate-600 italic">
              // NO_BIO_PAYLOAD_LOADED
            </p>
          )}

          {/* Social Net */}
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 text-slate-300 rounded transition inline-flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GH://REPOS</span>
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 text-slate-300 rounded transition inline-flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>NET://LINKEDIN</span>
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 text-slate-300 rounded transition inline-flex items-center gap-1.5"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X://TELEMETRY</span>
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs border border-slate-700 hover:border-cyan-400 hover:text-cyan-400 text-slate-300 rounded transition inline-flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>HTTP://ORIGIN</span>
              </a>
            )}
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 rounded transition inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>DOSSIER.PDF</span>
              </a>
            )}
          </div>
        </header>

        {/* Skill Matrix */}
        <section className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-widest uppercase mb-4">
            <Cpu className="w-4 h-4" />
            <span>NEURAL_CAPABILITIES_MATRIX</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="p-5 border border-cyan-500/20 bg-[#0d0f1a]/80 rounded-lg">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-3">
                // UI_INTERFACES
              </h3>
              {skills.frontend?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.frontend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-cyan-950/50 text-cyan-300 border border-cyan-800/60 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-600 italic">EMPTY_SET</span>
              )}
            </div>

            {/* Backend */}
            <div className="p-5 border border-cyan-500/20 bg-[#0d0f1a]/80 rounded-lg">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                // ENGINE_CORE
              </h3>
              {skills.backend?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.backend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-indigo-950/50 text-indigo-300 border border-indigo-800/60 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-600 italic">EMPTY_SET</span>
              )}
            </div>

            {/* DevOps */}
            <div className="p-5 border border-cyan-500/20 bg-[#0d0f1a]/80 rounded-lg">
              <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">
                // INFRA_PERIMETER
              </h3>
              {skills.devops?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.devops.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-600 italic">EMPTY_SET</span>
              )}
            </div>
          </div>
        </section>

        {/* Project Operations */}
        <section>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 tracking-widest uppercase mb-6">
            <Shield className="w-4 h-4" />
            <span>DEPLOYED_PAYLOADS_AND_PROJECTS</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-800 rounded-lg text-center bg-[#0d0f1a]/40">
              <p className="text-xs text-slate-600 italic">// ZERO_PAYLOADS_REGISTERED</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => {
                const safeDesc = DOMPurify.sanitize(proj.description || '');
                return (
                  <div
                    key={proj.id || idx}
                    className="border border-slate-800 hover:border-cyan-500/60 bg-[#0d0f1a] rounded-lg overflow-hidden flex flex-col transition duration-300 group shadow-lg"
                  >
                    <div className="aspect-video w-full bg-slate-950 overflow-hidden relative border-b border-slate-800">
                      <ImageWithFallback
                        src={proj.screenshot}
                        alt={proj.title}
                        fallbackTitle={proj.title}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-cyan-400 border border-cyan-500/30">
                        OP_{String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs">
                          {proj.repoLink && (
                            <a
                              href={proj.repoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-cyan-400 transition"
                              title="Source Repository"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveLink && (
                            <a
                              href={proj.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition text-[11px] font-bold"
                            >
                              LAUNCH
                            </a>
                          )}
                        </div>
                      </div>

                      {safeDesc ? (
                        <div
                          className="text-xs text-slate-400 leading-relaxed flex-1"
                          dangerouslySetInnerHTML={{ __html: safeDesc }}
                        />
                      ) : (
                        <p className="text-xs text-slate-600 italic">// NO_DETAILS</p>
                      )}

                      {proj.techStack?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                            >
                              #{tech}
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
        </section>
      </div>
    </div>
  );
};

export default CyberpunkLayout;

