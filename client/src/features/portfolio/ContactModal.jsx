import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Send, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';

export const ContactModal = ({ isOpen, onClose, username }) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await apiClient.post(`/public/${username}/contact`, {
        senderName,
        senderEmail,
        subject,
        message,
      });

      if (res.data?.success) {
        setStatus({
          type: 'success',
          text: `Message successfully relayed to @${username}. The developer's private inbox has received your transmission.`,
        });
        setSenderName('');
        setSenderEmail('');
        setSubject('');
        setMessage('');

        // HabitForge-style celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0c1df2', '#00f3ff', '#38bdf8', '#818cf8'],
        });
      } else {
        setStatus({
          type: 'error',
          text: res.data?.error || 'Failed to dispatch message.',
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error dispatching contact message. Please try again.';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-lg glass-modal rounded-2xl p-6 sm:p-7 text-slate-100 overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.15)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 id="contact-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-1.5 bg-[#0c1df2]/20 border border-[#0c1df2]/40 rounded-lg text-[#4251f7]">
                <Send className="w-4 h-4" />
              </div>
              <span>Contact @{username}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Secure contact relay &bull; Developer's email remains private
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {status.text && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-sm flex items-start gap-2.5 backdrop-blur-md ${
              status.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-300 border border-red-500/30'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            )}
            <p className="text-xs leading-relaxed">{status.text}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Jane Doe"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                required
                maxLength={200}
                placeholder="jane@company.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Subject
            </label>
            <input
              type="text"
              maxLength={200}
              placeholder="Collaboration or Engineering Opportunity"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={4}
              maxLength={5000}
              placeholder="Hi, I saw your portfolio on CodeFolio and would love to connect regarding..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition resize-none shadow-inner"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-[#4251f7]" />
              <span>Anti-Spam Rate-Limited</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                size="sm"
                className="gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Transmission</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
