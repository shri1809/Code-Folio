import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Button from './ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application ErrorBoundary Caught]:', error, errorInfo);
  }

  handleReload = () => {
    // Hard reload ignoring cache
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback(this.state.error, this.handleReset)
          : this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-slate-900/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected error occurred while loading this view. You can reload the application to restore state.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-300 text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                className="w-full sm:w-auto gap-2 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </Button>
              <Button
                variant="glass"
                size="sm"
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto gap-2 text-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
