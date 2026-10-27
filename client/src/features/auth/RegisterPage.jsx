import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from './OtpVerificationModal';
import { ShieldCheck, User, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

const RESERVED_LIST = ['admin', 'api', 'login', 'dashboard', 'settings', 'user', 'public'];

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const cleanUsername = username.toLowerCase().trim();
  const isUsernameReserved = cleanUsername.length > 0 && RESERVED_LIST.includes(cleanUsername);
  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isUsernameReserved) {
      setError(`The username '${cleanUsername}' is reserved by the system. Please pick another vanity handle.`);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = name.trim()
        ? await register(cleanUsername, email.trim(), password, name.trim())
        : await register(cleanUsername, email.trim(), password);
      if (res?.success) {
        setIsOtpModalOpen(true);
      } else {
        setError(res?.error || 'Registration failed.');
      }
    } catch (err) {
      if (err.response?.status === 502 || err.response?.status === 503 || err.response?.status === 504) {
        setError('The server is waking up from idle sleep (Render free tier). Please wait a few seconds and try again.');
      } else {
        setError(
          err.response?.data?.error ||
            err.response?.data?.errors?.[0]?.message ||
            'Registration encountered an error.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0c1df2]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full glass-card p-6 sm:p-8 rounded-2xl relative z-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] border border-white/10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#0c1df2]/15 border border-[#0c1df2]/30 text-[#4251f7] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
            <ShieldCheck className="w-6 h-6 text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Your CodeFolio</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Build, customize, and publish your high-performance developer portfolio in seconds.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-2.5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <p className="leading-relaxed">{error}</p>
            </div>
            {error.toLowerCase().includes('already exists') && (
              <Link
                to="/login"
                className="shrink-0 text-xs text-[#4251f7] hover:text-white underline font-semibold ml-2 transition"
              >
                Log In &rarr;
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300">
                Full Name
              </label>
              <span className="text-[11px] text-slate-500">Optional</span>
            </div>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full pl-10 pr-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-1">
              Your display name featured on your portfolio header and showcase.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300">
                Vanity Username <span className="text-[#4251f7]" aria-hidden="true">*</span>
              </label>
              {isUsernameReserved && (
                <span className="text-[11px] text-red-400 font-medium">Reserved handle</span>
              )}
            </div>
            <div className="relative">
              <span className="text-slate-500 text-sm absolute left-3.5 top-1/2 -translate-y-1/2 font-mono pointer-events-none select-none">
                @
              </span>
              <input
                id="reg-username"
                name="username"
                type="text"
                required
                autoComplete="username"
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="johndoe"
                aria-invalid={isUsernameReserved}
                className={`w-full pl-9 pr-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner ${
                  isUsernameReserved ? 'border-red-500/50 focus:ring-red-500/30' : ''
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-1 truncate">
              Public link: <code className="text-cyan-400 font-mono">codefolio.dev/u/{username || 'you'}</code>
            </p>
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address <span className="text-[#4251f7]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300">
                Password <span className="text-[#4251f7]" aria-hidden="true">*</span>
              </label>
              {password.length > 0 && (
                <span
                  className={`text-[11px] flex items-center gap-1 font-medium ${
                    isPasswordValid ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {isPasswordValid ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid</span>
                    </>
                  ) : (
                    <span>Min 8 characters</span>
                  )}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 pl-1">
              Must be at least 8 characters long.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            size="lg"
            aria-label="Register & Send Verification Code"
            className="w-full mt-2"
          >
            <span className="hidden sm:inline">Register &amp; Send Verification Code</span>
            <span className="sm:hidden">Register &amp; Send Code</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-[#4251f7] hover:text-white font-semibold underline underline-offset-4 transition"
          >
            Sign In
          </Link>
        </p>

        <OtpVerificationModal
          isOpen={isOtpModalOpen}
          email={email}
          redirectTo="/profile"
          onClose={() => setIsOtpModalOpen(false)}
          onSuccess={() => navigate('/profile')}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
