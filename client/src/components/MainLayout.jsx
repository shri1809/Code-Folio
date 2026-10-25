import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const RouteLoadingFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-slate-400 select-none animate-fade-in"
  >
    <div className="w-8 h-8 border-2 border-[#0c1df2] border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Loading view...</span>
  </div>
);

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
