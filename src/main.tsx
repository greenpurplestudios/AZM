import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Service Worker handling: unregister stale workers in dev, safely register in prod
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    }).catch(() => {});
  } else {
    try {
      registerSW({ immediate: true });
    } catch (err) {
      console.warn('PWA service worker registration notice:', err);
    }
  }
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends (React.Component as any) {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Azm Fitness App Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B0A] text-[#F4F5F3] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-400 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-black mb-2 text-[#F4F5F3]">حدث استثناء أثناء تشغيل التطبيق</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            تم حفظ جميع بياناتك وسجلاتك الرياضية بأمان في قاعدة البيانات المحلية. يمكنك إعادة تشغيل التطبيق للمتابعة.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-2.5 rounded-xl bg-[#6BAF8F] text-[#070B0A] font-bold text-sm hover:bg-[#7bc2a0] transition shadow-lg"
          >
            إعادة تحميل التطبيق
          </button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

