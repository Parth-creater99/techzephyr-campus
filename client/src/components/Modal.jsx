import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable accessible Modal dialog.
 * Handles overlay dismiss, ESC key dismiss, and body scroll lock.
 * Contains no page back buttons.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '520px',
  className = '',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-dialog-title' : undefined}
        className={`modal-dialog ${className}`.trim()}
        style={{ maxWidth }}
      >
        <div className="modal-header">
          {title && (
            <h3 id="modal-dialog-title" className="modal-title">
              {title}
            </h3>
          )}
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
