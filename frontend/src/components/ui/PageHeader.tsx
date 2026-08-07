import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-primary-500',
  badge,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border dark:border-border">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`flex-shrink-0 h-10 w-10 rounded-xl bg-surface-tertiary dark:bg-surface-elevated border border-border dark:border-border flex items-center justify-center ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-content dark:text-content tracking-tight truncate">
                {title}
              </h1>
              {badge}
            </div>
            {description && (
              <p className="text-sm text-content-secondary mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
};
