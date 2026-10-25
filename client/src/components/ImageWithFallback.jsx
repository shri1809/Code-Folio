import React, { useState } from 'react';
import { ImageOff, Code } from 'lucide-react';

/**
 * Image component with native lazy loading, asynchronous decoding,
 * priority controls to prevent layout shifts (CLS), smooth fallback for broken links,
 * and neutral SVG placeholder state.
 */
export const ImageWithFallback = ({
  src,
  alt = 'Project screenshot',
  className = '',
  fallbackTitle = 'Project Preview',
  loading = 'lazy',
  priority = false,
  width,
  height,
  style = {},
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div
        data-testid="fallback-placeholder"
        className={`flex flex-col items-center justify-center bg-slate-800 text-slate-400 border border-slate-700/50 rounded-lg p-6 ${className}`}
        style={style}
      >
        <div className="p-3 bg-slate-900/80 rounded-full mb-2">
          {src ? <ImageOff className="w-6 h-6 text-slate-500" /> : <Code className="w-6 h-6 text-indigo-400" />}
        </div>
        <span className="text-xs font-mono font-medium text-slate-400 text-center">
          {fallbackTitle}
        </span>
        <span className="text-[10px] text-slate-500 mt-1">Preview Unavailable</span>
      </div>
    );
  }

  const effectiveLoading = priority ? 'eager' : loading;

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
          <span className="text-xs text-slate-500 font-mono">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={effectiveLoading}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback;
