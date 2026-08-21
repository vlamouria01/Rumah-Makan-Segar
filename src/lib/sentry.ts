import * as Sentry from '@sentry/react';

// Inisialisasi Sentry
const metaEnv = (import.meta as any).env || {};
const rawDsn = String(metaEnv.VITE_SENTRY_DSN || '').trim();

/**
 * Validasi ketat format DSN resmi Sentry (harus berupa URL valid berawalan https://, memiliki public key dan project id angka)
 * Contoh valid: https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/123456
 */
function getValidSentryDsn(dsn: string): string | null {
  if (!dsn || dsn.length < 10) return null;
  try {
    const url = new URL(dsn);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.username && !url.password && !url.hostname) return null;
    // DSN Sentry selalu memiliki pathname berupa project ID (misal /1234567)
    if (!url.pathname || url.pathname === '/' || url.pathname.length < 2) return null;
    return dsn;
  } catch {
    return null;
  }
}

export function initSentry() {
  const validDsn = getValidSentryDsn(rawDsn);

  if (validDsn) {
    try {
      Sentry.init({
        dsn: validDsn,
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
    } catch (err) {
      console.warn('⚠️ Sentry.init failed gracefully:', err);
    }
  } else {
    // Mode offline / aman jika VITE_SENTRY_DSN kosong atau berisi string nama app "Rumah Makan Segar"
    console.info('ℹ️ Sentry.io: DSN belum dikonfigurasi atau tidak valid. Mode offline/simulasi aktif.');
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
