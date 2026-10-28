import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';
import {
  Settings,
  User,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  Sparkles,
  Link2,
  Lock,
  Key,
  Eye,
  EyeOff,
  Cpu,
  Plus,
  X,
  Code2,
} from 'lucide-react';
import { isSampleRoleName, getAuthenticUserName } from '../portfolio/rolesConfig';

const POPULAR_SKILLS = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js', 'Svelte', 'Redux', 'HTML5/CSS3'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Python', 'Go', 'Redis'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'GitHub Actions', 'Terraform', 'Nginx', 'Linux'],
};

export const SettingsPage = () => {
  const { user, updateUserLocal } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'skills' | 'security'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [selectedFileName, setSelectedFileName] = useState('');

  // Skills state
  const [skills, setSkills] = useState({
    frontend: [],
    backend: [],
    devops: [],
  });
  const [skillInputs, setSkillInputs] = useState({
    frontend: '',
    backend: '',
    devops: '',
  });
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [skillsStatus, setSkillsStatus] = useState({ type: '', text: '' });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Profile form
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      customDomain: user?.customDomain || '',
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
  });

  const watchedResumeUrl = watch('profile.resumeUrl');
  const watchedCustomDomain = watch('customDomain');

  // Load portfolio settings
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/portfolio');
        if (isMounted && res.data?.success) {
          const p = res.data.portfolio || {};
          const u = res.data.user || {};
          const authenticName = getAuthenticUserName(p.profile?.name, u.username ? u : user);
          reset({
            customDomain: u.customDomain || '',
            profile: {
              name: authenticName,
              bio: p.profile?.bio || '',
              socialLinks: {
                github: p.profile?.socialLinks?.github || '',
                linkedin: p.profile?.socialLinks?.linkedin || '',
                twitter: p.profile?.socialLinks?.twitter || '',
                website: p.profile?.socialLinks?.website || '',
              },
              resumeUrl: p.profile?.resumeUrl || '',
            },
          });
          if (p.profile?.resumeUrl) {
            setSelectedFileName(p.profile.resumeUrl.split('/').pop() || 'Existing Resume Document');
          }

          // Pre-populate skills
          if (p.skills) {
            setSkills({
              frontend: Array.isArray(p.skills.frontend) ? p.skills.frontend : [],
              backend: Array.isArray(p.skills.backend) ? p.skills.backend : [],
              devops: Array.isArray(p.skills.devops) ? p.skills.devops : [],
            });
          }
        }
      } catch (err) {
        console.warn('Failed to load portfolio settings:', err.message);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [user, reset]);

  // Handle local file selection for Resume / CV with honest validation and auto-upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx'];
    if (!validExts.includes(ext)) {
      setStatus({
        type: 'error',
        text: 'Invalid document type. Only .pdf, .doc, and .docx formats are permitted.',
      });
      e.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setStatus({
        type: 'error',
        text: `File size exceeds 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller document.`,
      });
      e.target.value = '';
      return;
    }

    setSelectedFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await apiClient.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data?.url) {
        setValue('profile.resumeUrl', res.data.url, { shouldDirty: true });
        setStatus({
          type: 'success',
          text: `Resume "${file.name}" successfully uploaded and attached to your portfolio!`,
        });
      }
    } catch (err) {
      console.warn('Could not auto-upload resume file:', err.message);
      setStatus({
        type: 'error',
        text: err.response?.data?.error || 'Failed to upload document. Please try again.',
      });
    }
  };

  // Profile and Domain submission
  const onSubmit = async (formData) => {
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const payload = {
        customDomain: formData.customDomain?.trim() || null,
        profile: {
          name: formData.profile?.name?.trim() || user?.username || '',
          bio: formData.profile?.bio || '',
          socialLinks: {
            github: formData.profile?.socialLinks?.github?.trim() || '',
            linkedin: formData.profile?.socialLinks?.linkedin?.trim() || '',
            twitter: formData.profile?.socialLinks?.twitter?.trim() || '',
            website: formData.profile?.socialLinks?.website?.trim() || '',
          },
          resumeUrl: formData.profile?.resumeUrl?.trim() || '',
        },
      };

      const res = await apiClient.put('/portfolio', payload);
      if (res.data?.success) {
        setStatus({
          type: 'success',
          text: 'Account & profile settings successfully saved!',
        });

        updateUserLocal({
          customDomain: formData.customDomain,
        });

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#0c1df2', '#00f3ff', '#38bdf8', '#818cf8', '#ffffff'],
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.error ||
        'Failed to save settings.';
      setStatus({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Skill Section Handlers
  const handleAddSkill = (category, valueToAdd) => {
    const skillName = (valueToAdd || skillInputs[category] || '').trim();
    if (!skillName) return;

    // Check if skill already exists
    if (!skills[category].includes(skillName)) {
      setSkills((prev) => ({
        ...prev,
        [category]: [...prev[category], skillName],
      }));
    }

    setSkillInputs((prev) => ({ ...prev, [category]: '' }));
  };

  const handleRemoveSkill = (category, indexToRemove) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveSkills = async () => {
    setSkillsSaving(true);
    setSkillsStatus({ type: '', text: '' });

    try {
      const res = await apiClient.put('/portfolio', {
        skills: {
          frontend: skills.frontend,
          backend: skills.backend,
          devops: skills.devops,
        },
      });

      if (res.data?.success) {
        setSkillsStatus({
          type: 'success',
          text: 'Skill stack successfully updated and published to your portfolio!',
        });

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#00f3ff', '#38bdf8', '#0c1df2', '#818cf8', '#ffffff'],
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.error ||
        'Failed to save skills.';
      setSkillsStatus({ type: 'error', text: errorMsg });
    } finally {
      setSkillsSaving(false);
    }
  };

  // Password Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordStatus({ type: '', text: '' });

    // Client-side validations
    if (!passwordData.currentPassword) {
      setPasswordStatus({ type: 'error', text: 'Current password is required.' });
      setPasswordLoading(false);
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      setPasswordStatus({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({
        type: 'error',
        text: 'New password and confirmation password do not match.',
      });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await apiClient.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data?.success) {
        setPasswordStatus({
          type: 'success',
          text: 'Password successfully changed! Your new credentials are now active.',
        });

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#00f3ff', '#ffffff'],
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to change password. Please verify your current password.';
      setPasswordStatus({ type: 'error', text: errorMsg });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Ambient Glass Glow Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0c1df2]/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Settings Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#0c1df2]/20 border border-[#0c1df2]/40 text-cyan-300">
                <Settings className="w-5 h-5 text-cyan-400" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">Account &amp; Profile Settings</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your personal credentials, skills, password security, and custom domain settings.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/dashboard">
              <Button variant="glass" size="sm" className="gap-1.5 text-xs">
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Studio</span>
              </Button>
            </Link>

            <a
              href={`/u/${user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glass" size="sm" className="gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public View</span>
              </Button>
            </a>
          </div>
        </div>

        {/* DISTINCT SETTINGS NAVIGATION TABS */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'profile'
                ? 'bg-[#0c1df2] text-white shadow-[0_0_15px_rgba(12,29,242,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'skills'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Skill Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'security'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security &amp; Password</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROFILE SETTINGS */}
        {/* ========================================================================= */}
        <div className={activeTab === 'profile' ? 'space-y-6 block' : 'hidden'}>
          {/* Status Notification for Profile */}
          {status.text && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs backdrop-blur-md ${
                status.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
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
            {/* SECTION 1: CORE PROFILE DETAILS */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <User className="w-4 h-4 text-[#4251f7]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Core Profile Information
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  {...register('profile.name')}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Professional Bio &amp; Headline
                </label>
                <textarea
                  rows={3}
                  placeholder="Senior Full-Stack Engineer specializing in scalable web systems..."
                  {...register('profile.bio')}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition resize-none shadow-inner leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 2: SOCIAL & NETWORK LINKS */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Social &amp; Professional Links
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    {...register('profile.socialLinks.github')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                    <span>LinkedIn Profile</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/username"
                    {...register('profile.socialLinks.linkedin')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-sky-400" />
                    <span>Twitter / X Profile</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://x.com/username"
                    {...register('profile.socialLinks.twitter')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Personal Website</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://alexrivera.dev"
                    {...register('profile.socialLinks.website')}
                    className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: RESUME / CV DOCUMENT */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Resume / CV Document
                  </h2>
                </div>
                {watchedResumeUrl && (
                  <a
                    href={watchedResumeUrl.startsWith('http') || watchedResumeUrl.startsWith('/') ? watchedResumeUrl : `https://${watchedResumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>Preview current CV</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Resume URL / Document Link
                </label>
                <div className="relative flex items-center">
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/... or direct link"
                    {...register('profile.resumeUrl')}
                    className="w-full pl-10 pr-12 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                  />
                  {watchedResumeUrl && (
                    <button
                      type="button"
                      onClick={() => setValue('profile.resumeUrl', '', { shouldDirty: true })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-400 transition"
                      title="Clear resume link"
                      aria-label="Clear resume link"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono transition">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attach New File</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {selectedFileName && (
                    <span className="text-cyan-300 font-mono truncate max-w-[200px]">
                      {selectedFileName}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  Google Drive, Dropbox, Notion, or Direct PDF URLs supported.
                </span>
              </div>
            </div>

            {/* Profile Save Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                size="lg"
                className="gap-2 font-bold shadow-[0_0_20px_rgba(12,29,242,0.4)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* TAB 2: SEPARATE SKILL SETTINGS SECTION */}
        {/* ========================================================================= */}
        <div className={activeTab === 'skills' ? 'space-y-6 block' : 'hidden'}>
          {/* Status Notification for Skills */}
          {skillsStatus.text && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs backdrop-blur-md ${
                skillsStatus.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-red-500/15 text-red-300 border border-red-500/30'
              }`}
            >
              {skillsStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <p className="font-medium leading-relaxed">{skillsStatus.text}</p>
            </div>
          )}

          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Technical Stack &amp; Skill Settings
                  </h2>
                  <p className="text-xs text-slate-400">
                    Organize your core engineering proficiencies. These skills appear directly across all portfolio themes.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">
                Total Skills: {skills.frontend.length + skills.backend.length + skills.devops.length}
              </span>
            </div>

            {/* FRONTEND SKILLS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Frontend Proficiencies</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {skills.frontend.length} added
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2.5 rounded-2xl bg-white/[0.02] border border-white/10">
                {skills.frontend.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No frontend skills added yet.</span>
                ) : (
                  skills.frontend.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 group shadow-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('frontend', idx)}
                        className="hover:text-red-400 transition"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input & Add */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. React, Next.js, Tailwind)..."
                  value={skillInputs.frontend}
                  onChange={(e) => setSkillInputs((p) => ({ ...p, frontend: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill('frontend');
                    }
                  }}
                  className="flex-1 px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                />
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => handleAddSkill('frontend')}
                  className="gap-1 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Quick Pick:</span>
                {POPULAR_SKILLS.frontend.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSkill('frontend', preset)}
                    disabled={skills.frontend.includes(preset)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/5 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* BACKEND SKILLS */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4251f7] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Backend &amp; Database Proficiencies</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {skills.backend.length} added
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2.5 rounded-2xl bg-white/[0.02] border border-white/10">
                {skills.backend.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No backend skills added yet.</span>
                ) : (
                  skills.backend.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-[#0c1df2]/20 text-[#818cf8] border border-[#0c1df2]/40 group shadow-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('backend', idx)}
                        className="hover:text-red-400 transition"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input & Add */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. Node.js, PostgreSQL, GraphQL)..."
                  value={skillInputs.backend}
                  onChange={(e) => setSkillInputs((p) => ({ ...p, backend: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill('backend');
                    }
                  }}
                  className="flex-1 px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                />
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => handleAddSkill('backend')}
                  className="gap-1 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#4251f7]" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Quick Pick:</span>
                {POPULAR_SKILLS.backend.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSkill('backend', preset)}
                    disabled={skills.backend.includes(preset)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-[#0c1df2]/20 hover:text-indigo-300 border border-white/5 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* DEVOPS & CLOUD SKILLS */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DevOps &amp; Infrastructure Proficiencies</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {skills.devops.length} added
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2.5 rounded-2xl bg-white/[0.02] border border-white/10">
                {skills.devops.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No devops skills added yet.</span>
                ) : (
                  skills.devops.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 group shadow-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill('devops', idx)}
                        className="hover:text-red-400 transition"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Input & Add */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. Docker, Kubernetes, AWS)..."
                  value={skillInputs.devops}
                  onChange={(e) => setSkillInputs((p) => ({ ...p, devops: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill('devops');
                    }
                  }}
                  className="flex-1 px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
                />
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => handleAddSkill('devops')}
                  className="gap-1 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Quick Preset Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Quick Pick:</span>
                {POPULAR_SKILLS.devops.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSkill('devops', preset)}
                    disabled={skills.devops.includes(preset)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.03] hover:bg-emerald-500/20 hover:text-emerald-300 border border-white/5 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Skills Button */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
              <Button
                type="button"
                onClick={handleSaveSkills}
                disabled={skillsSaving}
                loading={skillsSaving}
                variant="primary"
                size="lg"
                className="gap-2 font-bold shadow-[0_0_20px_rgba(0,243,255,0.3)] bg-gradient-to-r from-cyan-500 to-[#0c1df2] hover:opacity-90"
              >
                <Save className="w-4 h-4" />
                <span>Save Skill Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 3: SECURITY, PASSWORD & DOMAIN MANAGEMENT */}
        {/* ========================================================================= */}
        <div className={activeTab === 'security' ? 'space-y-6 block' : 'hidden'}>
          {/* SECTION A: CHANGE PASSWORD CARD */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Change Account Password
              </h2>
            </div>

            <p className="text-xs text-slate-400">
              Update your account login password. Must be at least 8 characters long.
            </p>

            {/* Password Notification */}
            {passwordStatus.text && (
              <div
                className={`p-4 rounded-2xl flex items-center gap-2.5 text-xs backdrop-blur-md ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-red-500/15 text-red-300 border border-red-500/30'
                }`}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <p className="font-medium leading-relaxed">{passwordStatus.text}</p>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-400" />
                    <span>Current Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition"
                  >
                    Forgot current password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 pr-10 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({ ...p, current: !p.current }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      placeholder="At least 8 characters"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 pr-10 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, new: !p.new }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Minimum 8 characters required.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 pr-10 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  loading={passwordLoading}
                  variant="primary"
                  size="md"
                  className="gap-2 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Password</span>
                </Button>
              </div>
            </form>
          </div>

          {/* SECTION B: ACCOUNT IDENTITY & CUSTOM DOMAIN */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Account &amp; Domain Management
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Username
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-mono text-slate-300 flex items-center justify-between">
                  <span>@{user?.username}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Registered Email
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm font-mono text-slate-300">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Custom Domain Mapping
                </label>
                {user?.isPro ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PRO ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400 border border-white/10">
                    PRO REQUIRED
                  </span>
                )}
              </div>

              <input
                type="text"
                disabled={!user?.isPro}
                placeholder={user?.isPro ? 'e.g. yourname.com' : 'Upgrade to Pro to map custom domains'}
                {...register('customDomain')}
                className="w-full px-3.5 py-2.5 glass-input disabled:opacity-50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                loading={loading}
                variant="glass"
                size="sm"
                className="gap-2 font-bold"
              >
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save Domain Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* FORGOT PASSWORD MODAL VIA OTP */}
        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          defaultEmail={user?.email || ''}
          onClose={() => setIsForgotModalOpen(false)}
          onSuccess={() => {
            setIsForgotModalOpen(false);
            setPasswordStatus({
              type: 'success',
              text: 'Password successfully reset and verified via email OTP!',
            });
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
