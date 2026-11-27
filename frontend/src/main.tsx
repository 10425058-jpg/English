import { Component, StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

class StartupErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main role="alert" className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-black">English Quest could not load</h1>
        <p>Please reconnect to the internet and reload. Your saved learning progress has not been cleared.</p>
        <button
          type="button"
          className="rounded-xl bg-[#58CC02] px-6 py-3 font-bold text-white"
          onClick={() => window.location.reload()}
        >
          Reload English Quest
        </button>
      </main>
    );
  }
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
    updateViaCache: 'none',
  }).catch((error: unknown) => console.warn('English Quest service worker registration failed:', error));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StartupErrorBoundary>
      <App />
    </StartupErrorBoundary>
  </StrictMode>
);
