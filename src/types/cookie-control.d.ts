interface CookieYes {
  consent: {
    marketing: boolean;
    analytics: boolean;
    preferences: boolean;
    necessary: boolean;
  };
  show: () => void;
  hide: () => void;
  renew: () => void;
}

declare global {
  interface Window {
    CookieYes: CookieYes;
  }
}

export {};