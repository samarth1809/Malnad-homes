
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
    />
  );
};

export const PropertyCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="p-5 flex-1 flex flex-col space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-full" />
      <div className="mt-auto pt-4 flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);
