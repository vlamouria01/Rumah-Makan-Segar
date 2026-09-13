/// <reference types="vite/client" />

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

interface Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    render: (container: string | HTMLElement, parameters: {
      sitekey: string;
      theme?: 'light' | 'dark';
      size?: 'normal' | 'compact';
      callback?: (response: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }) => number;
    reset: (opt_widget_id?: number) => void;
    getResponse: (opt_widget_id?: number) => string;
  };
}
