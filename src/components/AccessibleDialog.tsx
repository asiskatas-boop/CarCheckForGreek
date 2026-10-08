import React, { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

interface AccessibleDialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  describedBy?: string;
  ariaLabel?: string;
  overlayClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  open,
  onClose,
  labelledBy,
  describedBy,
  ariaLabel,
  overlayClassName = '',
  panelClassName = '',
  children,
  closeOnBackdrop = true
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstFocusable = focusable?.[0] ?? panel;
    requestAnimationFrame(() => firstFocusable?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // A child (e.g. an inline editor) can claim Escape by calling preventDefault().
        if (event.defaultPrevented) return;
        event.preventDefault();
        closeRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
      );

      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overscroll-contain bg-[var(--overlay-scrim)] backdrop-blur-sm flex items-center justify-center ${overlayClassName}`}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`overscroll-contain ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
};
