interface Cookiebot {
  callback?: () => void;
  consent?: {
    marketing: boolean;
    necessary: boolean;
    preferences: boolean;
    statistics: boolean;
  };
  consent_modal?: {
    layout: 'box' | 'cloud' | 'bar';
    position: 'bottom' | 'bottom-right' | 'bottom-left' | 'top' | 'top-right' | 'top-left';
    transition: 'slide' | 'fade';
    flip_buttons: boolean;
  };
  declaration?: {
    revision: number;
    last_updated: string;
    cookie_table: Array<{
      name: string;
      provider: string;
      purpose: string;
      expiry: string;
      type: string;
    }>;
  };
  show?: () => void;
  hide?: () => void;
  renew?: () => void;
  init?: () => void;
}

declare global {
  interface Window {
    Cookiebot: Cookiebot;
  }
}

export {}; 