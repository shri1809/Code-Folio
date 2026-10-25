import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import {
  FileText,
  Book,
  Code2,
  Terminal,
  ExternalLink,
  Mail,
  FileDown,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Search,
  ChevronRight,
  Copy,
  Check,
  FolderTree,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { ContactModal } from '../ContactModal';
import Button from '../../../components/ui/Button';

export const TechnicalDocsLayout = ({ data, roleConfig, onOpenContact }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeDocIdx, setActiveDocIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProjects = projects.filter((p) =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = filteredProjects[activeDocIdx] || filteredProjects[0] || projects[0] || null;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-[#0c1df2]/40 selection:text-white relative flex flex-col">
      {/* Top Docs Global Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0c1df2]/20 border border-[#0c1df2]/30 text-[#4251f7]">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">DOCS // REFERENCE</span>
                {user.isPro && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0c1df2] text-white">
                    PRO ARCHITECT
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {profile.name || user.username} • {roleConfig?.title || 'Technical Documentation'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="sm" className="gap-2 text-xs font-mono">
                  <FileDown className="w-3.5 h-3.5" />
                  <span>DOWNLOAD CV</span>
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
              <span>CONSULT</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main 2-Column Documentation Body */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Tree Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Docs Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search specifications & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0c1df2] transition font-mono"
            />
          </div>

          {/* Profile Overview Card */}
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Architect Bio & Background
            </span>
            {safeBio ? (
              <div
                className="text-xs text-slate-300 leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: safeBio }}
              />
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Specializing in developer experience, API reference architectures, complex system diagrams, and taxonomy standards.
              </p>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition"
                  title="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white transition"
                  title="Website"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Table of Contents / Document Tree */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
            <div className="p-3.5 bg-white/[0.02] border-b border-white/10 text-xs font-mono font-bold text-slate-400 uppercase flex items-center justify-between">
              <span>Specifications ({filteredProjects.length})</span>
              <span className="text-[10px] text-cyan-400">TREE VIEW</span>
            </div>

            <div className="p-2 space-y-1">
              {filteredProjects.map((p, idx) => {
                const isSelected = activeDocIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveDocIdx(idx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0c1df2] text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{p.title || `Specification #${idx + 1}`}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technical Skills & Standards */}
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Doc Toolchains & Standards
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
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                  >
                    {s}
                  </span>
                ))
              ) : (
                ['OpenAPI 3.1', 'Markdown/MDX', 'GitBook', 'Docusaurus', 'Information Architecture', 'JSON Schema'].map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                  >
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Documentation Panel */}
        <main className="lg:col-span-8 space-y-8">
          {activeDoc ? (
            <article className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 sm:p-10 shadow-2xl space-y-8">
              {/* Doc Header */}
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-center gap-2 mb-3 font-mono text-xs text-cyan-400">
                  <span>GUIDE // SPECIFICATION</span>
                  <span>•</span>
                  <span>STATUS: 200 OK</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeDoc.title}
                </h2>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  {activeDoc.description || 'Comprehensive architectural blueprint and developer specifications.'}
                </p>
              </div>

              {/* Endpoint or Architecture Diagram Callout */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-5 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#4251f7]" />
                    <span>REST / SCHEMA ENDPOINT</span>
                  </span>
                  <button
                    onClick={() => handleCopy(`GET /api/v1/schemas/${activeDoc.title.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="text-xs hover:text-white transition flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-sm text-cyan-300 font-bold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">GET</span>
                  <span className="text-slate-200">
                    /api/v1/schemas/{activeDoc.title.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                </div>
              </div>

              {/* Specification Visual Architecture */}
              {activeDoc.screenshot && (
                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black">
                  <img
                    src={activeDoc.screenshot}
                    alt={activeDoc.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80';
                    }}
                    className="w-full h-auto object-cover max-h-[420px]"
                  />
                  <div className="p-3 bg-white/[0.02] border-t border-white/10 text-[11px] font-mono text-slate-400 text-center">
                    Figure 1: Architectural Taxonomy Diagram
                  </div>
                </div>
              )}

              {/* Technology Parameters Table */}
              {activeDoc.techStack?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Specification Parameters & Schema
                  </h3>
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/[0.03] text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="py-2.5 px-4">Component</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Requirement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {activeDoc.techStack.map((tech, tIdx) => (
                          <tr key={tIdx} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-4 font-bold text-cyan-300">{tech}</td>
                            <td className="py-2.5 px-4 text-slate-400">SchemaToken</td>
                            <td className="py-2.5 px-4 text-emerald-400">Mandatory</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                {activeDoc.liveLink && (
                  <a
                    href={activeDoc.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" className="gap-2 text-xs font-mono">
                      <span>OPEN LIVE SPEC</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                )}
                {activeDoc.repoLink && (
                  <a
                    href={activeDoc.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="glass" size="sm" className="gap-2 text-xs font-mono">
                      <Github className="w-3.5 h-3.5" />
                      <span>DOCS REPO</span>
                    </Button>
                  </a>
                )}
              </div>
            </article>
          ) : (
            <div className="p-16 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No documentation specifications found.</p>
              <p className="text-slate-600 text-xs mt-1">Add technical writing folios in the dashboard.</p>
            </div>
          )}
        </main>
      </div>

      {/* Docs Footer */}
      <footer className="border-t border-white/10 bg-slate-900/40 py-6 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {profile.name || user.username}. All technical documentation specifications reserved.</p>
          <div className="flex items-center gap-3">
            <span>Powered by CodeFolio Pro Documentation Engine</span>
          </div>
        </div>
      </footer>

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

export default TechnicalDocsLayout;

