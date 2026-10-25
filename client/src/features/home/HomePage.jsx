import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Mail,
  Cpu,
  Layout,
  ArrowRight,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  Globe,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const HomePage = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Ambient HabitForge-style Glass Glow Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0c1df2]/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 sm:pt-28 sm:pb-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold mb-8 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Next-Gen SaaS Developer Portfolio CMS</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0c1df2] text-white">
              v2.0 Active
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Build Your Developer Identity. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4251f7] via-cyan-400 to-pink-400 drop-shadow-[0_0_35px_rgba(12,29,242,0.35)]">
              Zero Placeholders. 100% Hardened.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The developer portfolio CMS platform engineered with instantaneous split-screen live preview, Double-Submit CSRF, dynamic template engine, and private Gmail SMTP relay.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="gap-2.5">
                <span>Build Your CodeFolio</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/u/demo1">
              <Button variant="glass" size="lg" className="gap-2">
                <span>Explore Minimalist Demo</span>
              </Button>
            </Link>

            <Link to="/u/demo2">
              <Button variant="outline" size="lg" className="gap-2 border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/30">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Cyberpunk Pro Demo</span>
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-black text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Test Pass Rate</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-black text-cyan-400">3 Themes</div>
              <div className="text-xs text-slate-400 mt-0.5">Dynamic Engine</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-black text-[#4251f7]">0 ms</div>
              <div className="text-xs text-slate-400 mt-0.5">Live Preview Lag</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-black text-emerald-400">0 Leaks</div>
              <div className="text-xs text-slate-400 mt-0.5">Private Email Relay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="relative z-10 py-20 border-t border-white/10 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Enterprise SaaS Architecture
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Built with HabitForge interactive physics, glassmorphic surfaces, and defensive full-stack security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c1df2]/20 to-[#2535f5]/20 border border-[#0c1df2]/40 text-[#4251f7] flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Split-Screen Real-Time CMS</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Edit profile details, categorized skills (Frontend, Backend, DevOps), and rich project case studies with instantaneous live rendering.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-[#4251f7] font-semibold gap-1">
                <span>React Hook Form State</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dynamic Template Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Choose between <strong>Minimalist</strong>, <strong>Cyberpunk</strong>, and <strong>Corporate</strong> layouts mapped dynamically at runtime with pure DOMPurify sanitation.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-cyan-400 font-semibold gap-1">
                <span>Declarative templateMap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="glass-card glass-card-hover p-7 rounded-2xl flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private Gmail SMTP Relay</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Visitors contact developers through secure relay endpoints without ever exposing the developer's private email address to the browser client.
              </p>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-emerald-400 font-semibold gap-1">
                <span>Strict Rate-Limited Relay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
