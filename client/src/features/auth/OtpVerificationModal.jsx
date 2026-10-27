import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

export const OtpVerificationModal = ({
  isOpen,
  email,
  onClose,
  onSuccess,
  redirectTo = '/dashboard',
  initialSandboxOtp = '',
}) => {
  const { verifyOtp, requestOtp } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [sandboxOtp, setSandboxOtp] = useState(initialSandboxOtp);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (initialSandboxOtp) {
      setSandboxOtp(initialSandboxOtp);
    }
  }, [initialSandboxOtp]);

  // Handle Escape key listener for accessible closing
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

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await verifyOtp(email, otp.trim());
      if (res?.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(redirectTo);
        }
      } else {
        setError(res?.error || 'Invalid OTP code.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Verification failed. Please check the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);
    try {
      const res = await requestOtp(email);
      if (res?.success) {
        if (res.sandboxOtp) {
          setSandboxOtp(res.sandboxOtp);
          setInfo('Verification code refreshed. (Instant sandbox code available below).');
        } else {
          setInfo('A fresh 6-digit verification code has been dispatched to your email.');
        }
      } else {
        setError(res?.error || 'Failed to dispatch new OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-md glass-modal rounded-2xl p-6 sm:p-8 text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)] animate-scale-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0c1df2]/20 to-[#2535f5]/20 border border-[#0c1df2]/40 text-[#4251f7] rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(12,29,242,0.3)]">
            <KeyRound className="w-7 h-7 drop-shadow-[0_0_8px_rgba(12,29,242,0.6)]" />
          </div>
          <h3 className="text-xl font-bold text-white">Security Verification</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            We sent a secure 6-digit one-time code to{' '}
            <span className="font-mono text-slate-200 font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 backdrop-blur-md"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{info}</span>
          </div>
        )}

        {sandboxOtp && (
          <div className="mb-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center animate-fade-in backdrop-blur-md">
            <p className="text-[11px] text-cyan-300 font-medium mb-1 flex items-center justify-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Cloud Sandbox Instant Code:
            </p>
            <div className="text-2xl font-mono font-bold tracking-widest text-cyan-400 my-1">
              {sandboxOtp}
            </div>
            <button
              type="button"
              onClick={() => {
                setOtp(sandboxOtp);
              }}
              className="text-[11px] text-cyan-300 hover:text-white underline font-semibold transition inline-flex items-center gap-1"
            >
              Click to auto-fill code &rarr;
            </button>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase text-center mb-2">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
              className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold py-3 glass-input rounded-xl text-[#4251f7] focus:outline-none focus:ring-2 focus:ring-[#0c1df2] placeholder-slate-600 shadow-inner"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            loading={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify &amp; Enter Dashboard</span>
          </Button>

          <p className="text-[11px] text-slate-400 text-center mt-2.5 leading-relaxed">
            Please check your <strong>Inbox</strong> and <strong>Spam / Promotions</strong> folder.
          </p>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="hover:text-[#4251f7] transition flex items-center gap-1 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>Resend Code</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="hover:text-white transition font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
