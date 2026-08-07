import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-surface-secondary dark:bg-[#141414] border border-border dark:border-border ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive
                ? 'text-content'
                : 'text-content-tertiary hover:text-content-secondary'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-[#1F1F1F] rounded-lg shadow-subtle border border-border dark:border-border"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
