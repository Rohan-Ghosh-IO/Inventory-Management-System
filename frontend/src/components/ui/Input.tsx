import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-content dark:text-content"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-white dark:bg-[#141414]
              text-sm text-content dark:text-content
              placeholder:text-content-tertiary
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
              ${error
                ? 'border-danger-400 dark:border-danger-500 focus:ring-danger-500/20 focus:border-danger-500'
                : 'border-border dark:border-border hover:border-content-tertiary dark:hover:border-content-tertiary'
              }
              ${className}
            `}
            {...props}
          />
        </div>
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

Input.displayName = 'Input';
