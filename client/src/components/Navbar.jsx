import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Sparkles, LayoutDashboard, LogIn, LogOut, ShieldCheck, User, Settings } from 'lucide-react';
import Button from './ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ease-in-out border-b border-white/10 backdrop-blur-xl bg-slate-950/80 ${
        isScrolled
          ? 'bg-slate-950/90 border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]'
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.05)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-br from-[#0c1df2] to-[#2031f4] rounded-xl text-white shadow-sm border border-white/20 group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition">
            Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Folio</span>
          </span>
        </Link>

        {/* Center / Showcase Links */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-300">
            <Link
              to="/u/demo1"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition flex items-center gap-1.5"
            >
              <span>Minimalist Demo</span>
            </Link>
            <Link
              to="/u/demo2"
              className="px-3 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-cyan-950/30 text-cyan-300 transition flex items-center gap-1.5 border border-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cyberpunk Pro</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <Link
                    to={`/u/${user.username}`}
                    title="View My Portfolio"
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition"
                  >
                    <User className="w-3.5 h-3.5 text-[#4251f7]" />
                    <span className="font-mono truncate max-w-[75px] sm:max-w-[130px]">@{user.username}</span>
                    {user.isPro && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-sm">
                        PRO
                      </span>
                    )}
                  </Link>

                  <Link to="/settings" title="Account & Profile Settings">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/[0.05] transition"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="gap-1.5 text-xs text-slate-400 hover:text-red-400 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-red-500/20 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Get Started</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
