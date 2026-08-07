import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-content dark:text-content"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full rounded-xl border bg-white dark:bg-[#141414]
            text-sm text-content dark:text-content
            placeholder:text-content-tertiary
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:opacity-50 disabled:cursor-not-allowed
            px-3.5 py-2.5 resize-none
            ${error
              ? 'border-danger-400 dark:border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
              : 'border-border dark:border-border hover:border-content-tertiary dark:hover:border-content-tertiary'
            }
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-content-tertiary">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-danger-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
