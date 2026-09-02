import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Shared modal dialog shell. Provides scrim, motion-in/out, focus trap-lite
 * (first focusable on open, ESC to close, restore focus on unmount).
 */
export interface DialogShellProps {
  open: boolean;
  title?: string;
  width?: number;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function DialogShell({ open, title, width = 480, onClose, footer, children }: DialogShellProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = (document.activeElement as HTMLElement) ?? null;
    const t = setTimeout(() => {
      const f = ref.current?.querySelector<HTMLElement>(
        "input,select,textarea,button,[tabindex]:not([tabindex='-1'])"
      );
      f?.focus();
    }, 30);
    const key = (e: KeyboardEvent) => { 
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      
      if (e.key === "Tab" && ref.current) {
        const focusable = Array.from(
          ref.current.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!ref.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", key);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ background: "color-mix(in oklab, black 55%, transparent)", backdropFilter: "blur(6px)" }}
          onMouseDown={onClose}
          role="presentation"
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-vlc-region="panel"
            className="glass-panel flex flex-col"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.8 }}
            style={{
              width, maxWidth: "92vw", maxHeight: "85vh",
              borderRadius: "var(--vlc-radius-lg, 14px)",
              boxShadow: "var(--vlc-shadow-popup)",
              border: "1px solid var(--vlc-border-normal)",
              background: "var(--vlc-bg-elevated)",
              color: "var(--vlc-text-primary)",
              overflow: "hidden",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center px-4 hairline-bottom" style={{ height: 42, flexShrink: 0 }}>
                <span className="flex-1 text-[13px] font-medium tracking-tight">{title}</span>
                <button
                  onClick={onClose}
                  className="press grid place-items-center rounded-md"
                  aria-label="Close"
                  style={{ width: 24, height: 24, color: "var(--vlc-text-secondary)" }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-auto p-4">{children}</div>
            {footer && <div className="hairline-top px-4 py-3 flex justify-end gap-2" style={{ flexShrink: 0 }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
