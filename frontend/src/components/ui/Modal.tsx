import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  icon?: React.ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  icon,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`
              relative w-full max-w-[calc(100vw-1.5rem)] sm:${sizeClasses[size]}
              bg-white dark:bg-[#1F1F1F]
              border border-border dark:border-border
              rounded-2xl shadow-2xl
              max-h-[90vh] flex flex-col my-auto
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border dark:border-border">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {icon && (
                    <div className="flex-shrink-0">{icon}</div>
                  )}
                  <div className="min-w-0">
                    {title && (
                      <h3 className="text-base sm:text-lg font-bold text-content dark:text-content truncate">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-xs text-content-secondary mt-0.5 line-clamp-1">{description}</p>
                    )}
                  </div>
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="flex-shrink-0 p-1.5 rounded-lg text-content-tertiary hover:text-content hover:bg-surface-tertiary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-border dark:border-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
