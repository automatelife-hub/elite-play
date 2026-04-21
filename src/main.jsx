import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from '@/App.jsx'
import '@/index.css'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration(),
    ],
  });
}

const SentryErrorFallback = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
    <p className="text-lg font-semibold">Something went wrong.</p>
    <button
      className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-sm"
      onClick={() => window.location.reload()}
    >
      Reload page
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>
)
