import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon: Icon, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-content dark:text-content"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary pointer-events-none" />
          )}
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full rounded-xl border bg-white dark:bg-[#141414]
              text-sm text-content dark:text-content
              transition-colors duration-150 appearance-none
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : 'pl-3.5'} pr-8 py-2.5
              ${error
                ? 'border-danger-400 dark:border-danger-500'
                : 'border-border dark:border-border hover:border-content-tertiary dark:hover:border-content-tertiary'
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-content-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-danger-500 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
