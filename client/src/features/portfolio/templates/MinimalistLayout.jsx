import React from 'react';
import DOMPurify from 'dompurify';
import { Github, Linkedin, Twitter, Globe, FileText, Mail, ExternalLink } from 'lucide-react';
import ImageWithFallback from '../../../components/ImageWithFallback';
import Button from '../../../components/ui/Button';

export const MinimalistLayout = ({ data = {}, onOpenContact }) => {
  const user = data.user || {};
  const portfolio = data.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0c1df2] selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Header / Intro */}
        <header className="border-b border-slate-200 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                {profile.name || user.username || 'Anonymous Developer'}
              </h1>
              <p className="mt-2 text-sm font-mono text-slate-500">
                @{user.username || 'developer'}
                {user.isPro && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#0c1df2] text-white shadow-sm">
                    PRO
                  </span>
                )}
              </p>
            </div>

            {onOpenContact && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenContact}
                className="self-start sm:self-auto gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </Button>
            )}
          </div>

          {/* Bio rendered safely */}
          {safeBio ? (
            <div
              className="mt-6 text-lg text-slate-700 leading-relaxed max-w-2xl font-normal"
              dangerouslySetInnerHTML={{ __html: safeBio }}
            />
          ) : (
            <p className="mt-6 text-sm text-slate-400 italic">
              No developer bio provided yet.
            </p>
          )}

          {/* Social and Resume Links */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0c1df2] transition font-medium"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0c1df2] transition font-medium"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0c1df2] transition font-medium"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0c1df2] transition font-medium"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
              </a>
            )}
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#0c1df2] font-semibold underline underline-offset-4 hover:text-[#2535f5] transition"
              >
                <FileText className="w-4 h-4" />
                <span>Resume / CV</span>
              </a>
            )}
          </div>
        </header>

        {/* Technical Skills Section */}
        <section className="py-12 border-b border-slate-200">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-6">
            Technical Stack
          </h2>

          {skills.frontend?.length === 0 &&
          skills.backend?.length === 0 &&
          skills.devops?.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No skills listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {skills.frontend?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Frontend</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.frontend.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.backend?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Backend</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.backend.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.devops?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">DevOps &amp; Infra</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.devops.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Selected Projects */}
        <section className="py-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-8">
            Selected Works
          </h2>

          {projects.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-300 rounded-lg text-center">
              <p className="text-sm text-slate-400 italic">No public projects have been published yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {projects.map((proj, idx) => {
                const safeDesc = DOMPurify.sanitize(proj.description || '');
                return (
                  <article
                    key={proj.id || idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12 border-b border-slate-100 last:border-b-0"
                  >
                    <div className="md:col-span-5 aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <ImageWithFallback
                        src={proj.screenshot}
                        alt={proj.title}
                        fallbackTitle={proj.title}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="md:col-span-7 flex flex-col">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">{proj.title}</h3>
                        <div className="flex items-center gap-3">
                          {proj.repoLink && (
                            <a
                              href={proj.repoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-[#0c1df2] transition"
                              title="Source Code"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveLink && (
                            <a
                              href={proj.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0c1df2] hover:text-[#2535f5] transition inline-flex items-center gap-1 text-xs font-semibold"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {safeDesc ? (
                        <div
                          className="mt-2 text-sm text-slate-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: safeDesc }}
                        />
                      ) : (
                        <p className="mt-2 text-xs text-slate-400 italic">No project summary provided.</p>
                      )}

                      {proj.techStack?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MinimalistLayout;
