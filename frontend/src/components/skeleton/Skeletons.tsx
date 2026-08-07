import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-xl ${className}`} />
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 6,
  columns = 5,
}) => (
  <div className="w-full">
    {/* Header skeleton */}
    <div className="px-5 py-3 border-b border-border dark:border-border bg-surface-secondary dark:bg-[#111111] flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
    {/* Row skeletons */}
    <div className="divide-y divide-border-secondary dark:divide-border-secondary">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="px-5 py-4 flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, ci) => (
            <Skeleton key={ci} className={`h-4 flex-1 ${ci === 0 ? 'max-w-[200px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="p-8 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border space-y-6">
    <div className="flex items-center space-x-5">
      <Skeleton className="h-20 w-20 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border dark:border-border">
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-10 w-full rounded-xl" />
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-10 w-full rounded-xl" />
    <Skeleton className="h-10 w-28 rounded-xl ml-auto" />
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
    <CardSkeleton count={4} />
    <TableSkeleton rows={6} />
  </div>
);
