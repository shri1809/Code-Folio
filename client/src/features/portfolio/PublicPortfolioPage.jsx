import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../../api/client';
import { templateMap, DefaultLayout, resolveTemplateComponent } from './templates';
import { getRoleConfig, getSafeResumeHref } from './rolesConfig';
import ContactModal from './ContactModal';
import ShareModal from '../../components/ShareModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import { UserX, ArrowLeft, RefreshCw, Share2, FileDown } from 'lucide-react';

export const PublicPortfolioPage = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/public/${username}`);
        if (isMounted) {
          if (res.data?.success && res.data.data) {
            setData(res.data.data);
          } else {
            setError(`Could not find portfolio for @${username}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.error || `Portfolio for @${username} does not exist.`
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }

    return () => {
      isMounted = false;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono text-slate-400">Loading @{username}'s portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-2xl">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Portfolio Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'This user does not exist or has not published their portfolio.'}</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = data.user || {};
  const portfolio = data.portfolio || {};
  const profile = portfolio.profile || {};
  const templateId = user.templateId || 'minimalist';

  // Dynamic template selection (supports base roles, design styles, and compound role--style)
  const PortfolioLayout = resolveTemplateComponent(templateId);

  // SEO metadata preparation
  const seoTitle = `${profile.name || user.username} | CodeFolio Portfolio`;
  const plainBio = profile.bio ? profile.bio.replace(/<[^>]*>?/gm, '').slice(0, 160) : `Check out ${user.username}'s developer portfolio on CodeFolio.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={plainBio} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={plainBio} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={plainBio} />
      </Helmet>

      <main className="relative">
        <ErrorBoundary
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center text-slate-300">
              <h2 className="text-lg font-bold text-white mb-2">Display Notice</h2>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                This portfolio layout encountered a presentation issue. You can refresh the view.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#0c1df2] text-white rounded-xl text-xs font-semibold"
              >
                Reload
              </button>
            </div>
          }
        >
          <PortfolioLayout
            data={data}
            roleConfig={getRoleConfig(templateId)}
            onOpenContact={() => setIsContactOpen(true)}
          />
        </ErrorBoundary>

        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          username={user.username}
        />

        {/* Floating Actions: CV / Resume & Share Buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {profile.resumeUrl && (
            <a
              href={getSafeResumeHref(profile.resumeUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold border border-cyan-400/40 shadow-[0_10px_30px_rgba(6,182,212,0.4)] backdrop-blur-xl text-xs uppercase tracking-wider transition hover:scale-105 active:scale-95 group cursor-pointer"
              title="View or download verified CV / Resume"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-200 group-hover:text-white transition-colors" />
              <span>Resume / CV</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-[#0c1df2] text-white border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl text-xs font-bold transition hover:scale-105 active:scale-95 group cursor-pointer"
            title="Share this portfolio"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
            <span>Share</span>
          </button>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          username={user.username}
          customDomain={user.customDomain}
        />
      </main>
    </>
  );
};

export default PublicPortfolioPage;

