import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import {
  User,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Upload,
  Link2,
  ExternalLink,
  X,
  FileCheck,
  Info,
} from 'lucide-react';
import { getAuthenticUserName } from '../portfolio/rolesConfig';

// URL safety validation
const isSafeUrl = (value) => {
  if (!value || typeof value !== 'string') return true;
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  return true;
};

// Friendly normalization: auto-prefix https:// if omitted
const normalizeUrl = (val) => {
  if (!val || typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [localFileInfo, setLocalFileInfo] = useState(null);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      profile: {
        name: getAuthenticUserName(user?.name, user),
        bio: '',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          website: '',
        },
        resumeUrl: '',
      },
    },
    mode: 'onBlur',
  });

  const watchedResumeUrl = watch('profile.resumeUrl');
  const watchedBio = watch('profile.bio') || '';

  // Fetch current portfolio profile if already partially populated
  useEffect(() => {
    let isMounted = true;
    const fetchCurrentProfile = async () => {
      try {
        const res = await apiClient.get('/portfolio');
        if (isMounted && res.data?.success && res.data.portfolio?.profile) {
          const p = res.data.portfolio.profile;
          const authenticName = getAuthenticUserName(p.name, user);
          reset({
            profile: {
              name: authenticName,
              bio: p.bio || '',
              socialLinks: {
                github: p.socialLinks?.github || '',
                linkedin: p.socialLinks?.linkedin || '',
                twitter: p.socialLinks?.twitter || '',
                website: p.socialLinks?.website || '',
              },
              resumeUrl: p.resumeUrl || '',
            },
          });
        }
      } catch (err) {
        console.warn('Could not fetch portfolio profile on mount:', err.message);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchCurrentProfile();
    return () => {
      isMounted = false;
    };
  }, [user, reset]);

  // Handle local file selection for Resume / CV with honest validation and auto-upload
  const handleFileSelection = async (e) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check permitted extensions
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx'];
    if (!validExts.includes(ext)) {
      setFileError('Invalid file type. Only .pdf, .doc, and .docx documents are supported.');
      e.target.value = '';
      return;
    }

    // Check maximum file size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError(
        `File size exceeds 5 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller document.`
      );
      e.target.value = '';
      return;
    }

    // Record verified local file info
    setLocalFileInfo({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || ext.toUpperCase(),
    });

    // Auto-upload document to MongoDB storage so it is permanently accessible for user and visitors
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await apiClient.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data?.url) {
        setValue('profile.resumeUrl', res.data.url, { shouldDirty: true });
      }
    } catch (err) {
      console.warn('Could not auto-upload resume file:', err.message);
    }
  };

  const handleClearLocalFile = () => {
    setLocalFileInfo(null);
    setFileError('');
    setValue('profile.resumeUrl', '', { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearResumeUrl = () => {
    setValue('profile.resumeUrl', '', { shouldDirty: true });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const rawResume = formData.profile?.resumeUrl?.trim() || '';
      const normalizedResume = rawResume && isSafeUrl(rawResume) ? normalizeUrl(rawResume) : rawResume;

      const payload = {
        profile: {
          name: formData.profile?.name?.trim() || user?.username || 'Developer',
          bio: formData.profile?.bio?.trim() || '',
          socialLinks: {
            github: formData.profile?.socialLinks?.github?.trim()
              ? normalizeUrl(formData.profile.socialLinks.github.trim())
              : '',
            linkedin: formData.profile?.socialLinks?.linkedin?.trim()
              ? normalizeUrl(formData.profile.socialLinks.linkedin.trim())
              : '',
            twitter: formData.profile?.socialLinks?.twitter?.trim()
              ? normalizeUrl(formData.profile.socialLinks.twitter.trim())
              : '',
            website: formData.profile?.socialLinks?.website?.trim()
              ? normalizeUrl(formData.profile.socialLinks.website.trim())
              : '',
          },
          resumeUrl: normalizedResume,
        },
      };

      const res = await apiClient.put('/portfolio', payload);
      if (res.data?.success) {
        setStatus({
          type: 'success',
          text: 'Profile details successfully saved! Navigating to your portfolio studio...',
        });

        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0c1df2', '#00f3ff', '#38bdf8', '#818cf8', '#ffffff'],
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.error ||
        'Failed to save profile details. Please try again.';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0c1df2]/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full glass-card p-6 sm:p-9 rounded-2xl relative z-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] border border-white/10 my-4">
        {/* Onboarding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1df2]/15 border border-[#0c1df2]/30 text-cyan-300 text-xs font-mono font-semibold mb-3 shadow-[0_0_15px_rgba(12,29,242,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>STEP 1: INITIAL PROFILE SETUP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Complete Your Professional Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
            Provide your foundational credentials, online presence, and CV link. You can update these anytime in Settings or Studio.
          </p>
        </div>

        {/* Status Notification */}
        {status.text && (
          <div
            role={status.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs backdrop-blur-md animate-fade-in ${
              status.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'bg-red-500/15 text-red-300 border border-red-500/30'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <p className="font-medium leading-relaxed">{status.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* SECTION 1: PROFESSIONAL IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <User className="w-4 h-4 text-primary-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Professional Identity
              </h2>
            </div>

            {/* Display Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-300">
                  Full Display Name <span className="text-[#4251f7]" aria-hidden="true">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">Required</span>
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="profile-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Alex Rivera"
                  {...register('profile.name', {
                    required: 'Display name is required',
                    maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
                  })}
                  className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                />
              </div>
              {errors?.profile?.name && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">{errors.profile.name.message}</p>
              )}
              <p className="text-[11px] text-slate-500 mt-1 pl-1">
                Your public name as featured on portfolio titles and cards.
              </p>
            </div>

            {/* Bio / Headline */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="profile-bio" className="block text-xs font-semibold text-slate-300">
                  Professional Bio &amp; Headline
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {watchedBio.length} / 10,000
                </span>
              </div>
              <textarea
                id="profile-bio"
                rows={3}
                placeholder="Senior Software Engineer passionate about distributed systems, cloud architecture, and modern UX..."
                {...register('profile.bio', {
                  maxLength: { value: 10000, message: 'Bio cannot exceed 10,000 characters' },
                })}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition resize-none shadow-inner leading-relaxed"
              />
              {errors?.profile?.bio && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">{errors.profile.bio.message}</p>
              )}
              <p className="text-[11px] text-slate-500 mt-1 pl-1">
                A concise 1-3 sentence summary of your expertise, engineering philosophy, or current focus.
              </p>
            </div>
          </div>

          {/* SECTION 2: ONLINE PRESENCE */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Online Presence
                </h2>
              </div>
              <span className="text-[11px] text-slate-500">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub */}
              <div>
                <label htmlFor="social-github" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="social-github"
                    type="text"
                    autoComplete="url"
                    placeholder="https://github.com/username"
                    {...register('profile.socialLinks.github', {
                      validate: (v) => isSafeUrl(v) || 'Unsafe URL protocol detected',
                    })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>
                {errors?.profile?.socialLinks?.github && (
                  <p className="text-[11px] text-red-400 mt-1 pl-1">
                    {errors.profile.socialLinks.github.message}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div>
                <label htmlFor="social-linkedin" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="social-linkedin"
                    type="text"
                    autoComplete="url"
                    placeholder="https://linkedin.com/in/username"
                    {...register('profile.socialLinks.linkedin', {
                      validate: (v) => isSafeUrl(v) || 'Unsafe URL protocol detected',
                    })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>
                {errors?.profile?.socialLinks?.linkedin && (
                  <p className="text-[11px] text-red-400 mt-1 pl-1">
                    {errors.profile.socialLinks.linkedin.message}
                  </p>
                )}
              </div>

              {/* Twitter / X */}
              <div>
                <label htmlFor="social-twitter" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Twitter / X Profile
                </label>
                <div className="relative">
                  <Twitter className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="social-twitter"
                    type="text"
                    autoComplete="url"
                    placeholder="https://x.com/username"
                    {...register('profile.socialLinks.twitter', {
                      validate: (v) => isSafeUrl(v) || 'Unsafe URL protocol detected',
                    })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>
                {errors?.profile?.socialLinks?.twitter && (
                  <p className="text-[11px] text-red-400 mt-1 pl-1">
                    {errors.profile.socialLinks.twitter.message}
                  </p>
                )}
              </div>

              {/* Personal Website */}
              <div>
                <label htmlFor="social-website" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Personal Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="social-website"
                    type="text"
                    autoComplete="url"
                    placeholder="https://alexrivera.dev"
                    {...register('profile.socialLinks.website', {
                      validate: (v) => isSafeUrl(v) || 'Unsafe URL protocol detected',
                    })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>
                {errors?.profile?.socialLinks?.website && (
                  <p className="text-[11px] text-red-400 mt-1 pl-1">
                    {errors.profile.socialLinks.website.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: RESUME / CV DOCUMENT */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Resume / CV Document
                </h2>
              </div>
              <span className="text-[11px] text-slate-500">Optional</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Link your public resume document so recruiters and clients can review or download it directly from your portfolio.
            </p>

            {/* Direct Link Input */}
            <div>
              <label htmlFor="resume-url" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Public Hosted Resume URL
              </label>
              <div className="relative flex items-center">
                <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="resume-url"
                  type="text"
                  autoComplete="url"
                  placeholder="https://drive.google.com/file/... or direct link"
                  {...register('profile.resumeUrl', {
                    validate: (v) => isSafeUrl(v) || 'Unsafe URL protocol detected',
                  })}
                  className="w-full pl-10 pr-20 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                />
                {watchedResumeUrl && (
                  <div className="absolute right-2.5 flex items-center gap-1">
                    <a
                      href={watchedResumeUrl.startsWith('http') || watchedResumeUrl.startsWith('/') ? watchedResumeUrl : `https://${watchedResumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-slate-400 hover:text-cyan-300 transition"
                      title="Preview link in new tab"
                      aria-label="Preview resume link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleClearResumeUrl}
                      className="p-1 rounded text-slate-400 hover:text-red-400 transition"
                      title="Clear resume link"
                      aria-label="Clear resume link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {errors?.profile?.resumeUrl && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">
                  {errors.profile.resumeUrl.message}
                </p>
              )}
            </div>

            {/* Local File Inspector & Cloud Guide */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition select-none">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Local File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelection}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <span>Supported Links:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">Google Drive</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">Dropbox</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">Notion</span>
                </div>
              </div>

              {fileError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{fileError}</span>
                </div>
              )}

              {localFileInfo && (
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium">
                      <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[240px] sm:max-w-xs">{localFileInfo.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({localFileInfo.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLocalFile}
                      className="text-slate-400 hover:text-red-400 p-1 rounded transition text-xs flex items-center gap-1"
                      aria-label="Remove selected file"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Local document selected for reference. To ensure recruiters can access your CV across any device, please copy your public share link from Google Drive or Dropbox into the link field above.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
            <Link
              to="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition font-mono order-2 sm:order-1 py-2 px-1"
            >
              Skip for now &rarr;
            </Link>

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2 font-bold order-1 sm:order-2"
            >
              <span>Save &amp; Continue to Portfolio</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
