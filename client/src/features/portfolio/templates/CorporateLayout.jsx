import React from 'react';
import DOMPurify from 'dompurify';
import { Briefcase, Building2, CheckCircle2, Globe, Github, Linkedin, Twitter, FileText, Mail, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from '../../../components/ImageWithFallback';
import Button from '../../../components/ui/Button';

export const CorporateLayout = ({ data = {}, onOpenContact }) => {
  const user = data.user || {};
  const portfolio = data.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#0c1df2] selection:text-white">
      {/* Top Banner / Corporate Navigation Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0c1df2] rounded-lg shadow-[0_0_15px_rgba(12,29,242,0.35)]">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-slate-300">
              Executive Developer Dossier
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user.isPro && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED PRO
              </span>
            )}
            {onOpenContact && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenContact}
                className="gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Officer</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0c1df2]">
                Staff Software Architect &amp; Consultant
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                {profile.name || user.username || 'Principal Engineer'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Reference ID: <span className="font-mono text-slate-700">@{user.username || 'engineer'}</span>
                {user.customDomain && (
                  <span className="ml-3 font-mono text-xs text-[#0c1df2] font-semibold">
                    &bull; {user.customDomain}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition inline-flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition inline-flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition inline-flex items-center gap-1"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>Twitter</span>
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition inline-flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Official Web</span>
                </a>
              )}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-50 text-[#0c1df2] hover:bg-blue-100 font-semibold rounded-lg transition inline-flex items-center gap-1 border border-blue-200"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Executive Resume</span>
                </a>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Executive Summary
            </h2>
            {safeBio ? (
              <div
                className="text-slate-700 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: safeBio }}
              />
            ) : (
              <p className="text-sm text-slate-400 italic">
                Summary profile is currently pending executive submission.
              </p>
            )}
          </div>
        </div>

        {/* Competencies / Capabilities */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-4 h-4 text-[#0c1df2]" />
            <h2 className="text-lg font-bold text-slate-900">Core Technical Competencies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Client-Side &amp; UI Architecture
              </div>
              {skills.frontend?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-[#0c1df2] border border-blue-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">None cataloged.</p>
              )}
            </div>

            {/* Backend */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Server-Side &amp; Distributed Systems
              </div>
              {skills.backend?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">None cataloged.</p>
              )}
            </div>

            {/* DevOps */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Cloud, Reliability &amp; Operations
              </div>
              {skills.devops?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.devops.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">None cataloged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Enterprise Case Studies / Projects */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Featured Case Studies &amp; Deployments
          </h2>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm text-slate-400 italic">No case studies published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, idx) => {
                const safeDesc = DOMPurify.sanitize(proj.description || '');
                return (
                  <div
                    key={proj.id || idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
                  >
                    <div className="aspect-video w-full bg-slate-100 border-b border-slate-200">
                      <ImageWithFallback
                        src={proj.screenshot}
                        alt={proj.title}
                        fallbackTitle={proj.title}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                          <div className="flex items-center gap-2">
                            {proj.repoLink && (
                              <a
                                href={proj.repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-slate-900 transition"
                                title="Repository"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {proj.liveLink && (
                              <a
                                href={proj.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0c1df2] hover:text-[#2535f5] transition"
                              >
                                <span>Deployment</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {safeDesc ? (
                          <div
                            className="text-sm text-slate-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: safeDesc }}
                          />
                        ) : (
                          <p className="text-xs text-slate-400 italic">No case study description provided.</p>
                        )}
                      </div>

                      {proj.techStack?.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                            >
                              {tech}
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
        </div>
      </div>
    </div>
  );
};

export default CorporateLayout;
