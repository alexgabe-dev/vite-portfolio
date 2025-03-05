import React, { ReactElement, KeyboardEvent as ReactKeyboardEvent } from 'react';

/**
 * Akadálymentesítési segédfüggvények és konstansok
 */

// Billentyűkódok
export const KeyCodes = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
};

// Screen reader bejelentés
export const announceToScreenReader = (message: string): void => {
  const announcer = document.getElementById('screen-reader-announcements');
  if (announcer) {
    announcer.textContent = message;
  }
};

// Fókuszálható elemek lekérése
export const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
  return Array.from(
    element.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];
};

// Modal fókusz csapda
export const trapFocus = (element: HTMLElement, event: KeyboardEvent): void => {
  const focusableElements = getFocusableElements(element);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.key === KeyCodes.TAB) {
    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
};

// ARIA attribútumok
export const AriaAttributes = {
  // Szerepek
  Roles: {
    BUTTON: 'button',
    DIALOG: 'dialog',
    ALERT: 'alert',
    NAVIGATION: 'navigation',
    MENU: 'menu',
    MENUITEM: 'menuitem',
    TAB: 'tab',
    TABPANEL: 'tabpanel',
    TABLIST: 'tablist',
  },
  
  // Állapotok
  States: {
    EXPANDED: 'aria-expanded',
    SELECTED: 'aria-selected',
    CHECKED: 'aria-checked',
    PRESSED: 'aria-pressed',
    HIDDEN: 'aria-hidden',
    INVALID: 'aria-invalid',
    DISABLED: 'aria-disabled',
  },
  
  // Tulajdonságok
  Properties: {
    LABEL: 'aria-label',
    LABELLEDBY: 'aria-labelledby',
    DESCRIBEDBY: 'aria-describedby',
    CONTROLS: 'aria-controls',
    OWNS: 'aria-owns',
    HASPOPUP: 'aria-haspopup',
  },
};

// Példa komponens props interface
export interface AccessibleProps {
  /** Az elem egyedi azonosítója */
  id?: string;
  /** ARIA címke */
  ariaLabel?: string;
  /** ARIA címke ID referencia */
  ariaLabelledBy?: string;
  /** ARIA leírás ID referencia */
  ariaDescribedBy?: string;
  /** Tab index */
  tabIndex?: number;
}

// Példa hook a billentyűzet kezeléshez
export const useKeyboardNavigation = (
  onKeyDown: (event: KeyboardEvent) => void,
  dependencies: any[] = []
): void => {
  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, dependencies);
};

// Példa komponens a billentyűzet navigációhoz
interface KeyboardNavListProps {
  items: Array<{ id: string; content: React.ReactNode }>;
  onSelect: (id: string) => void;
}

export const KeyboardNavList = ({ items, onSelect }: KeyboardNavListProps): ReactElement => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>): void => {
    switch (event.key) {
      case KeyCodes.ARROW_DOWN:
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
      case KeyCodes.ARROW_UP:
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case KeyCodes.ENTER:
      case KeyCodes.SPACE:
        event.preventDefault();
        onSelect(items[activeIndex].id);
        break;
    }
  };

  return (
    <ul
      role="listbox"
      aria-label="Navigálható lista"
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          role="option"
          aria-selected={index === activeIndex}
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {item.content}
        </li>
      ))}
    </ul>
  );
}; 