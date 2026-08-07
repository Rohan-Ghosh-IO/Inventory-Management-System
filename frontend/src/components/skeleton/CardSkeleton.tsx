import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-8 w-1/2 rounded bg-gray-300 dark:bg-gray-700"></div>
    </div>
  );
};
