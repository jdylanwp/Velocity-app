'use client';

import { TrendWithRelations } from '@/lib/types';
import { TrendCard } from './TrendCard';

interface TrendGridProps {
  trends: TrendWithRelations[];
}

export function TrendGrid({ trends }: TrendGridProps) {
  if (trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <span className="text-2xl">?</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No trends found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your filters or search query to find relevant trends.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {trends.map((trend) => (
        <TrendCard key={trend.id} trend={trend} />
      ))}
    </div>
  );
}
