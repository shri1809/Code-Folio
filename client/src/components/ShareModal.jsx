import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Globe,
  Mail,
  Sparkles,
  Twitter,
  Linkedin,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from './ui/Button';

export const ShareModal = ({
  isOpen,
  onClose,
  username,
  customDomain,
}) => {
  const [copied, setCopied] = useState(false);

  // Accessible Escape key listener
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine current origin or default to codefolio.dev
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://codefolio.dev';
  const defaultUrl = `${origin}/u/${username || 'developer'}`;
  const vanityUrl = customDomain ? `https://${customDomain.replace(/^https?:\/\//, '')}` : defaultUrl;

  const shareText = `Check out my professional portfolio on CodeFolio: ${vanityUrl}`;

  const handleCopy = async (urlToCopy = vanityUrl) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        // Fallback for older browsers / iframe test envs
        const textArea = document.createElement('textarea');
        textArea.value = urlToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0c1df2', '#00f3ff', '#38bdf8'],
      });

      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const socialChannels = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0077b5]/15 text-[#0077b5] border-[#0077b5]/30 hover:bg-[#0077b5]/25',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(vanityUrl)}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-sky-500/15 text-sky-400 border-sky-500/30 hover:bg-sky-500/25',
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Excited to share my professional portfolio built on CodeFolio! 🚀`
      )}&url=${encodeURIComponent(vanityUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25',
      shareUrl: `mailto:?subject=${encodeURIComponent(
        `Portfolio of ${username || 'Developer'}`
      )}&body=${encodeURIComponent(
        `Hi,\n\nI would like to share my professional portfolio with you:\n${vanityUrl}\n\nBest regards,\n${username || 'Developer'}`
      )}`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col gap-6 overflow-hidden animate-scale-in">
        {/* Glow lights */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#0c1df2]/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0c1df2]/15 border border-[#0c1df2]/30 text-cyan-300 shadow-[0_0_15px_rgba(12,29,242,0.3)]">
              <Share2 className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="share-modal-title" className="text-lg font-bold text-white">Share Your Portfolio</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0c1df2]/30 text-cyan-300 border border-[#0c1df2]/40">
                  PUBLIC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Anyone with this link can view your live published portfolio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Display & 1-Click Copy Box */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider font-mono">
              Direct Portfolio Link
            </span>
            {customDomain && (
              <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Custom Domain Active</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-950/70 border border-white/10 rounded-2xl focus-within:border-[#0c1df2] transition shadow-inner">
            <div className="pl-3 text-slate-500 font-mono text-xs select-none flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </div>
            <input
              type="text"
              readOnly
              value={vanityUrl}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 font-mono focus:outline-none select-all py-1.5 px-1 truncate"
            />
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => handleCopy(vanityUrl)}
              className="shrink-0 gap-1.5 text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>

          {customDomain && (
            <p className="text-[11px] text-slate-400">
              Also accessible via default URL:{' '}
              <button
                type="button"
                onClick={() => handleCopy(defaultUrl)}
                className="text-cyan-400 hover:underline font-mono"
              >
                {defaultUrl}
              </button>
            </p>
          )}
        </div>

        {/* 1-Click Social Sharing Matrix */}
        <div className="space-y-3 relative z-10">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
            Instant Social Share
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {socialChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition group ${channel.color}`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-mono">{channel.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Live Preview & Actions Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10 text-xs">
          <a
            href={vanityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-300 transition flex items-center gap-1.5 font-mono"
          >
            <span>Open live view</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Button variant="glass" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

