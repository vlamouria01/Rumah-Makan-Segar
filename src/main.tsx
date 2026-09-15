import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './lib/sentry.ts';

// Inisialisasi Sentry monitoring
initSentry();

// Global copy protection: mencegah pengguna meng-copy teks aplikasi di luar form input/textarea
if (typeof window !== 'undefined') {
  document.addEventListener('copy', (e: ClipboardEvent) => {
    const active = document.activeElement;
    const isInput = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.getAttribute('contenteditable') === 'true'
    );
    if (!isInput) {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.clearData();
      }
    }
  });

  document.addEventListener('selectstart', (e: Event) => {
    const target = e.target as HTMLElement | null;
    const isInput = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    );
    if (!isInput) {
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
