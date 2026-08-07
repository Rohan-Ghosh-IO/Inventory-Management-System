import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'warning' | 'danger';
  className?: string;
}

const variantBorder: Record<string, string> = {
  default: 'border-border dark:border-border',
  warning: 'border-warning-200 dark:border-warning-900/50',
  danger: 'border-danger-200 dark:border-danger-900/50',
};

const variantBg: Record<string, string> = {
  default: 'bg-white dark:bg-[#141414]',
  warning: 'bg-warning-50/50 dark:bg-warning-950/20',
  danger: 'bg-danger-50/50 dark:bg-danger-950/20',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-primary-500',
  iconBg = 'bg-primary-50 dark:bg-primary-950/30',
  subtitle,
  trend,
  variant = 'default',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl p-5 border shadow-subtle
        ${variantBg[variant]}
        ${variantBorder[variant]}
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-content-secondary uppercase tracking-wider">
          {label}
        </span>
        <div className={`h-9 w-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-content tracking-tight">{value}</p>
      <div className="flex items-center justify-between mt-1.5">
        {subtitle && (
          <span className="text-[11px] text-content-tertiary">{subtitle}</span>
        )}
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              trend.direction === 'up'
                ? 'text-success-600 dark:text-success-400'
                : trend.direction === 'down'
                ? 'text-danger-600 dark:text-danger-400'
                : 'text-content-tertiary'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
};
