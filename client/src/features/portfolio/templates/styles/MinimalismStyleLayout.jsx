import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Terminal,
  Circle,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';

export const MinimalismStyleLayout = ({ data, roleConfig }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 font-sans selection:bg-white selection:text-black p-6 sm:p-12 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Minimalist Typographic Header */}
        <header className="border-b border-white/20 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              {roleConfig?.title || 'Systems Architect & Technical Writer'}
            </span>
            <div className="flex items-center gap-4 text-xs font-mono">
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white underline underline-offset-4"
                >
                  Download CV &rarr;
                </a>
              )}
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-white hover:text-slate-300 underline underline-offset-4"
              >
                Inquire &rarr;
              </button>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-white leading-tight">
            {profile.name || user.username || 'Systems Engineer'}
          </h1>

          <p className="text-slate-400 text-sm font-mono mt-2">
            {user.customDomain ? `@${user.username} • ${user.customDomain}` : `@${user.username}`}
          </p>

          <div
            className="text-slate-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mt-8"
            dangerouslySetInnerHTML={{ __html: safeBio || 'Generous whitespace, Swiss typographic rigor, and pure functional precision.' }}
          />

          <div className="flex items-center gap-6 mt-8">
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                GitHub [↗]
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                LinkedIn [↗]
              </a>
            )}
          </div>
        </header>

        {/* Minimal Projects List */}
        <section className="space-y-12">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 tracking-wider">
            <span>Selected Work ({projects.length})</span>
            <span>2024 — Present</span>
          </div>

          <div className="divide-y divide-white/10">
            {projects.map((proj, idx) => (
              <div key={idx} className="py-8 group flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="max-w-xl">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">
                    0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-light text-white group-hover:translate-x-1 transition-transform">
                    {proj.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed font-light">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4 font-mono text-xs text-slate-500">
                    {(proj.techStack || []).map((t, tidx) => (
                      <span key={tidx} className="after:content-['/'] after:ml-2 last:after:content-none">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {proj.liveLink && (
                  <a
                    href={proj.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white self-start"
                  >
                    <span>View System</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="pt-12 border-t border-white/20">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-6">
            Core Competencies
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs font-mono">
            <div>
              <span className="text-white block mb-2 font-bold">Systems &amp; Architecture</span>
              <ul className="space-y-1 text-slate-400">
                {(skills.backend || ['Distributed Systems', 'Go', 'Rust', 'PostgreSQL']).map((s, idx) => (
                  <li key={idx}>— {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-white block mb-2 font-bold">Telemetry &amp; Infrastructure</span>
              <ul className="space-y-1 text-slate-400">
                {(skills.devops || ['Kubernetes', 'Terraform', 'Prometheus', 'eBPF']).map((s, idx) => (
                  <li key={idx}>— {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-white block mb-2 font-bold">Protocols &amp; Tooling</span>
              <ul className="space-y-1 text-slate-400">
                {(skills.frontend || ['gRPC', 'GraphQL', 'Linux Kernel', 'GitOps']).map((s, idx) => (
                  <li key={idx}>— {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'architect'}
      />
    </div>
  );
};

export default MinimalismStyleLayout;

