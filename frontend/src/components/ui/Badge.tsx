import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-surface-tertiary text-content-secondary border border-border-secondary dark:bg-[#1A1A1A] dark:border-border',
  primary:
    'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-900',
  success:
    'bg-success-50 text-success-700 border border-success-200 dark:bg-success-950 dark:text-success-400 dark:border-success-900',
  warning:
    'bg-warning-50 text-warning-700 border border-warning-200 dark:bg-warning-950 dark:text-warning-400 dark:border-warning-900',
  danger:
    'bg-danger-50 text-danger-700 border border-danger-200 dark:bg-danger-950 dark:text-danger-400 dark:border-danger-900',
  outline:
    'bg-transparent text-content-secondary border border-border dark:border-border',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  default: 'bg-content-tertiary',
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  outline: 'bg-content-tertiary',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full whitespace-nowrap
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColorClasses[variant]}`} />
      )}
      {children}
    </span>
  );
};
