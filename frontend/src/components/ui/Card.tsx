import React from 'react';
import { motion } from 'framer-motion';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-[#141414] border border-border dark:border-border',
  elevated:
    'bg-white dark:bg-[#1F1F1F] border border-border dark:border-border shadow-elevated',
  bordered:
    'bg-transparent border border-border dark:border-border',
  glass:
    'glass border border-white/20 dark:border-white/5',
};

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  onClick,
}) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? {
        whileHover: { y: -2, transition: { duration: 0.2 } },
      }
    : {};

  return (
    <Component
      {...hoverProps}
      onClick={onClick}
      className={`
        rounded-2xl transition-colors duration-150
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};
