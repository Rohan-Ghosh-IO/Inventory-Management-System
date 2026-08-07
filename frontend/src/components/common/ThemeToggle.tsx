import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative inline-flex items-center justify-center rounded-xl
        border border-border dark:border-border
        bg-white dark:bg-[#1F1F1F]
        text-content-secondary hover:text-content
        hover:bg-surface-tertiary dark:hover:bg-surface-tertiary
        transition-colors duration-150
        ${sizeClasses} ${className}
      `}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className={`${iconSize} text-warning-500`} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className={`${iconSize} text-primary-400`} />
      </motion.div>
    </motion.button>
  );
};
