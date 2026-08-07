import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-glow-primary active:bg-primary-700 border border-primary-500',
  secondary:
    'bg-surface-secondary text-content hover:bg-surface-tertiary border border-border active:bg-surface-tertiary dark:bg-surface-elevated dark:hover:bg-surface-tertiary dark:border-border',
  ghost:
    'bg-transparent text-content-secondary hover:bg-surface-tertiary hover:text-content border border-transparent',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 shadow-sm hover:shadow-glow-danger active:bg-danger-700 border border-danger-500',
  success:
    'bg-success-500 text-white hover:bg-success-600 shadow-sm hover:shadow-glow-success active:bg-success-700 border border-success-500',
  outline:
    'bg-transparent text-content border border-border hover:bg-surface-secondary active:bg-surface-tertiary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-[#0A0A0A]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...(props as any)}
    >
      {loading && <Loader2 className={`animate-spin ${iconSizeClasses[size]}`} />}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={iconSizeClasses[size]} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={iconSizeClasses[size]} />
      )}
    </motion.button>
  );
};
