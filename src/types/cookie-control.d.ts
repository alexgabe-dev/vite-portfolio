interface CookieControlDialog {
  init: () => void;
  accept: () => void;
  displaydialog: () => void;
  show: () => void;
}

interface CookieControl {
  Dialog: CookieControlDialog;
}

declare global {
  interface Window {
    CookieControl: CookieControl;
  }
}

export {}; 