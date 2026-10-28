import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Link2,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  FileDown,
} from 'lucide-react';
import apiClient from '../api/client';
import Button from './ui/Button';

/**
 * Universal helper ensuring resume URLs are fully qualified
 * Handles /api/uploads/..., https://..., and auto-prefixes missing protocols
 */
export const getSafeResumeHref = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export const ResumeUploader = ({
  value = '',
  onChange,
  onUploadSuccess,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localFileName, setLocalFileName] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'link'
  const fileInputRef = useRef(null);

  const safeHref = getSafeResumeHref(value);

  // Extract a readable filename from URL or state
  const displayFileName =
    localFileName ||
    (value
      ? value.split('/').pop()?.split('?')[0] || 'Resume Document'
      : '');

  const isLocalUpload = Boolean(value && value.startsWith('/api/uploads'));

  const handleFile = async (file) => {
    if (!file) return;

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'doc', 'docx', 'txt'];
    if (!validExts.includes(ext)) {
      setUploadError('Invalid file type. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`Document size exceeds 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await apiClient.post('/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success && res.data?.url) {
        setLocalFileName(file.name);
        if (onChange) onChange(res.data.url);
        if (onUploadSuccess) onUploadSuccess(res.data);
      } else {
        throw new Error(res.data?.error || 'Failed to upload resume document');
      }
    } catch (err) {
      console.error('[Resume Upload Error]:', err);
      setUploadError(
        err.response?.data?.error || err.message || 'Upload failed. Please check your network and try again.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setLocalFileName('');
    setUploadError('');
    if (onChange) onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Active Resume Card (if present) */}
      {value ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 shadow-inner">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {displayFileName || 'Active Resume / CV'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0">
                  {isLocalUpload ? 'Hosted on CodeFolio' : 'Public Cloud Link'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <a
              href={safeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              title="Preview / download resume in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview / Download</span>
            </a>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition"
              title="Clear attached resume"
              aria-label="Clear resume"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Upload & Link Options Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'upload'
              ? 'bg-[#0c1df2] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document (PDF / DOC)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'link'
              ? 'bg-[#0c1df2] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Paste Hosted Link</span>
        </button>
      </div>

      {/* Tab 1: Upload from Computer */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            isUploading
              ? 'bg-cyan-500/5 border-cyan-500/40 cursor-wait'
              : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/15 hover:border-cyan-400/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-medium text-cyan-300">
                Uploading and attaching resume to your portfolio...
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Saving binary safely to MongoDB storage
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Click to browse or drag & drop your resume
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supported formats: <strong>PDF, DOC, DOCX</strong> (Up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Hosted External Link */}
      {activeTab === 'link' && (
        <div className="space-y-2">
          <div className="relative flex items-center">
            <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => {
                if (onChange) onChange(e.target.value);
              }}
              placeholder="https://drive.google.com/file/... or direct link"
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Accepts links from Google Drive (make sure file is set to "Anyone with the link can view"), Dropbox, Notion, GitHub, or your personal CDN.
          </p>
        </div>
      )}

      {/* Upload Error Display */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
