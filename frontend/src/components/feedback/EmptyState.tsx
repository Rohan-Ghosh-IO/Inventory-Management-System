import React from 'react';
import { LucideIcon, PackageOpen, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  message?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description,
  message,
  icon: Icon = PackageOpen,
  actionText,
  onAction,
  actionButton,
}) => {
  const bodyText = description || message || 'There are no records available matching your query.';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border dark:border-border bg-surface-secondary dark:bg-[#0F0F0F] p-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-500 border border-primary-100 dark:border-primary-900/50 mb-5">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-content dark:text-content">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-content-secondary leading-relaxed">
        {bodyText}
      </p>

      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="primary" size="sm" icon={Plus} onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </motion.div>
  );
};
