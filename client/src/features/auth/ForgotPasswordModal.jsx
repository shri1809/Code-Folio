import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export const ForgotPasswordModal = ({
  isOpen,
  defaultEmail = '',
  onClose,
  onSuccess,
}) => {
  const { requestOtp, resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Sync defaultEmail when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail || '');
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setInfo('');
    }
  }, [isOpen, defaultEmail]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Escape key listener for accessible dismissal
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

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await requestOtp(email.trim());
      if (res?.success) {
        setStep(2);
        setCountdown(60);
        setInfo(`A 6-digit verification code has been dispatched to ${email.trim()}.`);
      } else {
        setError(res?.error || 'Unable to dispatch verification code.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to dispatch OTP. Please verify your email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setInfo('');
    setResending(true);

    try {
      const res = await requestOtp(email.trim());
      if (res?.success) {
        setCountdown(60);
        setInfo('A fresh 6-digit code has been sent to your email.');
      } else {
        setError(res?.error || 'Failed to resend code.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(email.trim(), otp.trim(), newPassword);
      if (res?.success) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f3ff', '#10b981', '#0c1df2', '#ffffff'],
        });

        if (onSuccess) {
          onSuccess(res);
        }
      } else {
        setError(res?.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to reset password. Please check your OTP code.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md glass-modal rounded-3xl p-6 sm:p-8 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)] border border-white/10 animate-scale-in">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0c1df2]/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,243,255,0.25)]">
            <KeyRound className="w-7 h-7 drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]" />
          </div>
          <h3 id="forgot-password-modal-title" className="text-xl font-black text-white tracking-tight">
            Reset Account Password
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {step === 1
              ? 'Enter your registered email to receive a secure 6-digit verification code.'
              : `Verify the 6-digit code sent to ${email} and choose your new password.`}
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'w-3 bg-white/20'
            }`}
          />
          <span
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'w-3 bg-white/20'
            }`}
          />
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {info && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 backdrop-blur-md">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="leading-relaxed">{info}</span>
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full gap-2 font-bold shadow-[0_0_20px_rgba(0,243,255,0.25)] bg-gradient-to-r from-cyan-500 to-[#0c1df2]"
            >
              <span>Send 6-Digit Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* 6-Digit OTP */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || countdown > 0}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}</span>
                </button>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                autoFocus
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-center text-lg font-mono tracking-[0.4em] font-bold text-cyan-300 placeholder-slate-600 focus:outline-none transition shadow-inner"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirm New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full gap-2 font-bold shadow-[0_0_20px_rgba(0,243,255,0.3)] bg-gradient-to-r from-cyan-500 to-[#0c1df2]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify OTP &amp; Reset Password</span>
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setError('');
                setInfo('');
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-white transition font-mono pt-1"
            >
              Change Email Address
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
