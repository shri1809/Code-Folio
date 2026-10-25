import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Terminal,
  Database,
  Cloud,
  Cpu,
  Activity,
  Layers,
  ShieldCheck,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  FileDown,
  Copy,
  Check,
  CheckCircle2,
  Code2,
  GitBranch,
  Radio,
} from 'lucide-react';
import { ContactModal } from '../../ContactModal';
import Button from '../../../../components/ui/Button';

export const VerticalTabsLayout = ({ data, roleConfig }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const user = data?.user || {};
  const portfolio = data?.portfolio || {};
  const profile = portfolio.profile || {};
  const skills = portfolio.skills || { frontend: [], backend: [], devops: [] };
  const projects = portfolio.projects || [];

  const safeBio = DOMPurify.sanitize(profile.bio || '');

  const tabs = [
    { id: 'overview', label: 'Architecture Overview', icon: Layers },
    { id: 'projects', label: 'Distributed Systems', icon: Server },
    { id: 'specs', label: 'Cloud & IaC Blueprints', icon: Cloud },
    { id: 'api', label: 'API Specifications', icon: Code2 },
    { id: 'telemetry', label: 'Telemetry & SRE Ops', icon: Activity },
  ];

  const handleCopyEndpoint = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-white relative">
      {/* Background Grid Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Terminal Header */}
        <header className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-blue-400">
                <Terminal className="w-4 h-4 text-blue-500" />
                <span className="font-semibold tracking-wider uppercase">
                  SYSTEM // {roleConfig?.title || 'Backend Systems & SRE'}
                </span>
                {user.isPro && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold tracking-wider">
                    PRO VERIFIED
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {profile.name || user.username || 'Distributed Engineer'}
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
                    <span>SYS_SPEC.PDF</span>
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsContactOpen(true)}
                className="gap-2 font-mono text-xs shadow-lg shadow-blue-500/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>INITIATE PROTOCOL</span>
              </Button>
            </div>
          </div>

          {/* Subheader Bio & Socials */}
          <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div
              className="text-slate-300 text-sm leading-relaxed max-w-3xl"
              dangerouslySetInnerHTML={{ __html: safeBio || 'High-throughput systems architecture & distributed infrastructure.' }}
            />
            <div className="flex items-center gap-3 self-end md:self-auto">
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
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
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-white/5"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Main Vertical Tabs Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vertical Tabs Sidebar */}
          <aside className="lg:col-span-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 shadow-xl">
            <div className="px-3 py-2 text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider flex items-center justify-between">
              <span>Navigation Directory</span>
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>
            <nav className="mt-3 space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full relative flex items-center gap-3 px-4 py-3.5 rounded-xl font-mono text-xs transition-all duration-200 text-left ${
                      isActive
                        ? 'text-white font-semibold bg-blue-600/20 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="flex-1">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-glow"
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#38bdf8]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick SRE Telemetry Pill */}
            <div className="mt-6 p-4 rounded-xl border border-white/5 bg-slate-950/60 font-mono text-xs">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Node Telemetry</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">Uptime:</span>
                  <span className="text-emerald-400 font-bold">99.994%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Latency p99:</span>
                  <span className="text-cyan-400 font-bold">14.2ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Mesh:</span>
                  <span className="text-white">Multi-Region</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Zero Drop:</span>
                  <span className="text-emerald-400">Guaranteed</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Tab Content Panes */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Architecture Diagram / Terminal Output */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span>topology-manifest.yaml</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        SYNCED
                      </span>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                      <code>{`cluster:
  region: "us-east-1"
  sharding_strategy: "consistent-hashing-v3"
  consensus: "raft-quorum"
  load_balancer:
    type: "eBPF-mesh"
    target_throughput: "1.2M req/sec"
    rate_limit: "token-bucket-adaptive"
services:
  - name: "auth-gateway"
    protocol: "gRPC / mTLS"
    replicas: 12
  - name: "event-stream-engine"
    backplane: "Kafka / RocksDB"
    partition_count: 64`}</code>
                    </pre>
                  </div>

                  {/* Skills Grid */}
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
                    <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Infrastructure & Tech Stack
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                        <div className="text-blue-400 font-bold mb-2 uppercase text-[10px]">Backend & Core</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.backend || ['Go', 'Rust', 'PostgreSQL', 'Redis', 'Kafka']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                        <div className="text-cyan-400 font-bold mb-2 uppercase text-[10px]">DevOps & Cloud</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.devops || ['Kubernetes', 'Docker', 'Terraform', 'Prometheus', 'AWS']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                        <div className="text-purple-400 font-bold mb-2 uppercase text-[10px]">Data & Protocols</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills.frontend || ['gRPC', 'Protobuf', 'GraphQL', 'WebSockets']).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {projects.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-900/60 text-slate-400 font-mono text-xs">
                      No distributed systems published yet.
                    </div>
                  ) : (
                    projects.map((project, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl hover:border-blue-500/30 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                              SERVICE_NODE // 0{idx + 1}
                            </span>
                            <h3 className="text-xl font-bold text-white mt-0.5">{project.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.repoLink && (
                              <a
                                href={project.repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-xs transition-colors border border-white/5"
                              >
                                <Github className="w-3.5 h-3.5" />
                                <span>Source</span>
                              </a>
                            )}
                            {project.liveLink && (
                              <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white font-mono text-xs transition-colors border border-blue-500/30"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Telemetry</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {project.screenshot && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-white/10 max-h-56">
                            <img
                              src={project.screenshot}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {(project.techStack || []).map((t, tidx) => (
                            <span
                              key={tidx}
                              className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 font-mono text-[11px] border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4"
                >
                  <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400" />
                    Terraform & GitOps Pipeline Blueprint
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Declarative infrastructure-as-code automation enabling multi-region resilience and immutable zero-downtime updates.
                  </p>
                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                    <code>{`module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 20.0"
  cluster_name    = "prod-mesh-cluster"
  cluster_version = "1.30"

  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    compute_pool = {
      instance_types = ["c6i.2xlarge"]
      min_size       = 6
      max_size       = 32
      desired_size   = 12
    }
  }
}`}</code>
                  </pre>
                </motion.div>
              )}

              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-cyan-400" />
                      Core REST & gRPC API Endpoints
                    </h3>
                    <button
                      onClick={() => handleCopyEndpoint('https://api.codefolio.dev/v1/health')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                    >
                      {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEndpoint ? 'Copied' : 'Copy Endpoint'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">GET</span>
                        <span className="text-slate-200">/api/v1/telemetry/nodes</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">200 OK • 12ms</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">POST</span>
                        <span className="text-slate-200">/api/v1/mesh/dispatch</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">201 Created • 18ms</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">PUT</span>
                        <span className="text-slate-200">/api/v1/cluster/rebalance</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">202 Accepted • 42ms</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'telemetry' && (
                <motion.div
                  key="telemetry"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-6"
                >
                  <h3 className="text-sm font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Live Cluster Telemetry & SRE Metrics
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Cluster Uptime</span>
                      <span className="text-2xl font-black text-emerald-400 mt-1 block">99.99%</span>
                      <span className="text-[10px] text-emerald-500">SLA Met</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Avg p99 Latency</span>
                      <span className="text-2xl font-black text-cyan-400 mt-1 block">14.2ms</span>
                      <span className="text-[10px] text-cyan-500">Global Edge</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Total Req/Sec</span>
                      <span className="text-2xl font-black text-purple-400 mt-1 block">1.2M</span>
                      <span className="text-[10px] text-purple-500">Peak Load</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Packet Drop</span>
                      <span className="text-2xl font-black text-white mt-1 block">0.00%</span>
                      <span className="text-[10px] text-slate-400">Zero Loss</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        username={user.username || 'engineer'}
      />
    </div>
  );
};

export default VerticalTabsLayout;
