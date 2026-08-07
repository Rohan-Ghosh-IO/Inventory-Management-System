import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = 'items',
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border dark:border-border bg-surface-secondary dark:bg-[#0F0F0F]">
      <span className="text-xs text-content-secondary">
        Page{' '}
        <span className="font-semibold text-content">{currentPage}</span>
        {' '}of{' '}
        <span className="font-semibold text-content">{totalPages}</span>
        <span className="text-content-tertiary ml-1.5">
          ({totalItems} {itemLabel})
        </span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="p-1.5 rounded-lg border border-border dark:border-border text-content-secondary
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-surface-tertiary dark:hover:bg-surface-tertiary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="p-1.5 rounded-lg border border-border dark:border-border text-content-secondary
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-surface-tertiary dark:hover:bg-surface-tertiary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
