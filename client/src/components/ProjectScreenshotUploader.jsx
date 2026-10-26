import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Link2,
  Check,
  Sparkles,
  Upload,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../api/client';
import Button from './ui/Button';

export const SCREENSHOT_PRESETS = [
  {
    name: 'Web App',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mobile UI',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Analytics',
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Design System',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cloud Infra',
    url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cinema Reel',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  },
];

/**
 * Optimizes images client-side before upload.
 * Reduces 4K/high-res screenshots to max 1400px width/height in WebP format
 * for near-instant upload speeds and minimal database storage.
 */
const compressImage = async (file) => {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    // In headless test environments (jsdom), HTMLImageElement doesn't load src
    const fallbackTimer = setTimeout(() => {
      resolve(file);
    }, 100);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        clearTimeout(fallbackTimer);
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1400;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '') + '.webp',
                  { type: 'image/webp' }
                );
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.85
          );
        } catch {
          resolve(file);
        }
      };
      img.onerror = () => {
        clearTimeout(fallbackTimer);
        resolve(file);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      clearTimeout(fallbackTimer);
      resolve(file);
    };
    reader.readAsDataURL(file);
  });
};

export const ProjectScreenshotUploader = ({
  value = '',
  onChange,
  username = 'developer',
  index = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate that it's an image
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF, or SVG).');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      // 1. Client-side compression for high-res screenshots
      const processedFile = await compressImage(file);

      // 2. Direct upload via FormData to authenticated API
      const formData = new FormData();
      formData.append('image', processedFile);

      const res = await apiClient.post('/upload/screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success && res.data?.url) {
        onChange(res.data.url);
        setAttachedFileName(file.name);
      } else {
        throw new Error(res.data?.error || 'Failed to upload screenshot');
      }
    } catch (err) {
      console.error('[Screenshot Direct Upload Error]:', err);
      const message =
        err.response?.data?.error ||
        err.message ||
        'Direct upload failed. Please try again or paste a hosted link.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isUploading && e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = () => {
    onChange('');
    setAttachedFileName('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Project Screenshot</span>
        </label>
        <span className="text-[10px] text-slate-400 font-mono">Drag &amp; Drop or Upload File:</span>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* DRAG AND DROP ZONE (Direct upload from device) */}
      <div
        data-testid={`dropzone-${index}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-3.5 text-center transition-all duration-200 cursor-pointer ${
          isUploading
            ? 'border-cyan-400/50 bg-cyan-500/5 cursor-wait'
            : isDragging
            ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(0,243,255,0.25)] scale-[1.01]'
            : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
        onClick={() => {
          if (!isUploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={isUploading}
          data-testid={`file-input-${index}`}
        />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 py-1">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 ${
              isUploading
                ? 'bg-cyan-500/20 text-cyan-300'
                : isDragging
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-white/[0.05] text-slate-400 group-hover:text-white'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-slate-200">
              {isUploading ? (
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  Uploading image directly from device...
                </span>
              ) : isDragging ? (
                <span className="text-cyan-300 font-bold">Drop image here to upload!</span>
              ) : (
                <span>
                  <strong className="text-cyan-400 underline underline-offset-2">Drag &amp; drop</strong> screenshot, or{' '}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.06] text-white hover:bg-white/10 font-mono text-[11px]">
                    <Upload className="w-3 h-3 text-cyan-400" />
                    Browse File
                  </span>
                </span>
              )}
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              PNG, JPG, WEBP, GIF, or SVG (direct device upload to database)
            </p>
          </div>
        </div>
      </div>

      {/* DIRECT URL INPUT (Always available for pasting or inspecting) */}
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..., /api/uploads/..., or paste hosted image link"
          className="w-full px-3.5 py-2 glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono shadow-inner"
        />
      </div>

      {/* 1-CLICK STOCK PRESETS (Canva / Adobe Portfolio Style) */}
      <div className="pt-0.5">
        <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400 font-mono">
          <span>Or 1-Click Stock Mockups:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SCREENSHOT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onChange(preset.url);
                setAttachedFileName('');
                setUploadError('');
              }}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] hover:bg-[#0c1df2]/20 hover:text-cyan-300 border border-white/5 text-slate-400 transition flex items-center gap-1"
              title={`Insert ${preset.name} mockup`}
            >
              <ImageIcon className="w-2.5 h-2.5" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LIVE THUMBNAIL PREVIEW & ATTACHMENT BADGE */}
      {value && (
        <div className="relative mt-2 rounded-xl overflow-hidden border border-white/10 bg-slate-950/70 p-2 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-14 h-11 rounded-lg overflow-hidden border border-white/10 bg-slate-900 shrink-0 relative">
              <img
                src={value}
                alt="Project screenshot"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {attachedFileName || 'Screenshot Linked'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[240px]">
                {value}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/[0.05] transition shrink-0"
            title="Remove Screenshot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectScreenshotUploader;
