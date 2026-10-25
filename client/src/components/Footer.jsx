import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs text-slate-400">
            Hardened MERN Architecture &bull; Double-Submit CSRF &bull; Strict CSP
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Developers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

