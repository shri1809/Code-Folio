import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from './OtpVerificationModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';

export const LoginPage = () => {
  const { login, requestOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [sandboxOtp, setSandboxOtp] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.mfaRequired) {
        setIsOtpModalOpen(true);
      } else if (res?.success) {
        navigate(from, { replace: true });
      } else {
        setError(res?.error || 'Invalid email or password.');
      }
    } catch (err) {
      if (err.response?.status === 502 || err.response?.status === 503 || err.response?.status === 504) {
        setError('The server is waking up from idle sleep (Render free tier). Please wait a few seconds and try again.');
      } else {
        setError(
          err.response?.data?.error || 'Login failed. Please verify your credentials.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordlessOtp = async () => {
    if (!email) {
      setError('Please enter your email address to request a one-time login code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await requestOtp(email);
      if (res?.success) {
        if (res.sandboxOtp) {
          setSandboxOtp(res.sandboxOtp);
        }
        setIsOtpModalOpen(true);
      } else {
        setError(res?.error || 'Failed to dispatch OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to request one-time code.');
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
            <Lock className="w-6 h-6 text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Access your developer portfolio dashboard securely.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address <span className="text-[#4251f7]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
                Password <span className="text-[#4251f7]" aria-hidden="true">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
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
          </div>

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePasswordlessOtp}
            disabled={loading}
            className="text-xs text-[#4251f7] hover:text-white font-medium gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In with Email One-Time Code (Passwordless)</span>
            <span className="sm:hidden">Sign In with Email Code (Passwordless)</span>
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#4251f7] hover:text-white font-semibold underline underline-offset-4 transition"
          >
            Create Portfolio
          </Link>
        </p>

        <OtpVerificationModal
          isOpen={isOtpModalOpen}
          email={email}
          initialSandboxOtp={sandboxOtp}
          onClose={() => setIsOtpModalOpen(false)}
          onSuccess={() => navigate(from, { replace: true })}
        />

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          defaultEmail={email}
          onClose={() => setIsForgotPasswordOpen(false)}
          onSuccess={() => {
            setIsForgotPasswordOpen(false);
            navigate(from, { replace: true });
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
