import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Layers,
  Check,
  Copy,
  Hash,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const ArchivalIndexLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#07090d] text-emerald-400 font-mono selection:bg-emerald-500/30 selection:text-white p-4 sm:p-8">
      {/* Exposed Wireframe Matrix Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Archival Catalog Header */}
        <header className="rounded-xl border border-dashed border-emerald-500/40 bg-slate-950/80 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-dashed border-emerald-500/30">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold text-[10px]">
                  ARCHIVAL CLASSIFICATION // LEVEL-04
                </span>
                <span className="text-slate-500">::</span>
                <span className="text-emerald-400 uppercase">{roleConfig?.title || 'Backend Systems & Cybersec'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                {profile.name || user.username || 'Catalog Operator'}
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                {user.customDomain ? `CATALOG_LOCATOR: @${user.username} [${user.customDomain}]` : `CATALOG_LOCATOR: @${user.username}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-3 py-2 border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5" />
                    <span>EXPORT_DOSSIER.RAW</span>
                  </button>
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="px-4 py-2 border border-emerald-400 bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>OPEN_CHANNEL</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div
              className="text-slate-300 max-w-3xl leading-relaxed"
              dangerouslySetInnerHTML={{ __html: safeBio || 'Exposed wireframe boundaries, structural data tables, and immutable ledger archives.' }}
            />
            <div className="flex items-center gap-3">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 border border-dashed border-emerald-500/40 text-emerald-400 hover:text-white"
                >
                  [GIT]
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 border border-dashed border-emerald-500/40 text-emerald-400 hover:text-white"
                >
                  [LINKEDIN]
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Structural Data Table / Catalog Index Ledger */}
        <section className="rounded-xl border border-dashed border-emerald-500/40 bg-slate-950/80 p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-emerald-500/30 mb-6 text-xs">
            <span className="font-bold uppercase tracking-wider text-white">
              RECORD LOG // ARTIFACT REPOSITORY ({projects.length} RECORDS)
            </span>
            <span className="text-slate-500">CHECKSUM: SHA-256 VERIFIED</span>
          </div>

          <div className="space-y-6">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="border border-emerald-500/20 bg-emerald-950/10 p-5 rounded-lg hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        IDX-00{idx + 1}
                      </span>
                      <span className="text-slate-500">STATUS: PRODUCTION ACTIVE</span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-wide">{proj.title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">{proj.description}</p>
                  </div>

                  {proj.screenshot && (
                    <div className="w-full md:w-56 aspect-video rounded overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                      <img
                        src={proj.screenshot}
                        alt={proj.title}
                        className="w-full h-full object-cover grayscale contrast-125"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-2 text-slate-400">
                    {(proj.techStack || []).map((t, tidx) => (
                      <span key={tidx} className="border border-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {proj.repoLink && (
                      <a href={proj.repoLink} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-400">
                        [source]
                      </a>
                    )}
                    {proj.liveLink && (
                      <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                        <span>[inspect telemetry]</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'operator'}
      />
    </div>
  );
};

export default ArchivalIndexLayout;

