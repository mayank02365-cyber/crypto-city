import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-bg-hover/80 rounded-lg ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="glass-card overflow-hidden">
    <div className="p-5 border-b border-border flex justify-between">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
      ))}
    </div>
  </div>
);
