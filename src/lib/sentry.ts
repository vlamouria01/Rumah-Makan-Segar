import * as Sentry from '@sentry/react';

// Inisialisasi Sentry
const metaEnv = (import.meta as any).env || {};
const SENTRY_DSN = metaEnv.VITE_SENTRY_DSN || '';

export function initSentry() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: metaEnv.MODE || 'development',
    });
    console.log('✅ Sentry.io monitoring initialized with DSN.');
  } else {
    console.info('ℹ️ Sentry.io: VITE_SENTRY_DSN belum diisi. Mode offline/simulasi aktif.');
  }
}

/**
 * Memicu test error buatan untuk memastikan Sentry.io menangkap error dengan benar
 */
export function triggerSentryTestError(customMessage?: string) {
  const errorMsg = customMessage || `RM Segar Sentry Test Exception [${new Date().toLocaleTimeString()}]`;
  const testError = new Error(errorMsg);
  
  // Kirim ke Sentry jika aktif
  Sentry.captureException(testError, {
    tags: {
      source: 'manual_admin_test',
      app: 'RM_Segar_App',
    },
    extra: {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    },
  });

  return testError;
}

/**
 * Mengirim custom log / event info ke Sentry
 */
export function sendSentryMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

export { Sentry };
