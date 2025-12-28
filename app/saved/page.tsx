'use client';

import { useState } from 'react';
import { mockTrendsWithMetrics } from '@/lib/mockData';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { Button } from '@/components/ui/button';
import { Bookmark, Plus } from 'lucide-react';
import Link from 'next/link';

export default function SavedTrendsPage() {
  const [savedTrendIds] = useState<number[]>([1, 3, 5, 10]);

  const savedTrends = mockTrendsWithMetrics.filter((t) =>
    savedTrendIds.includes(t.id)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Trends</h1>
          <p className="text-muted-foreground">
            Track your favorite trends in one place.
          </p>
        </div>
      </div>

      {savedTrends.length > 0 ? (
        <TrendGrid trends={savedTrends} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <Bookmark className="w-7 h-7 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No saved trends yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Start exploring and save trends you want to track. They will appear
            here for quick access.
          </p>
          <Link href="/">
            <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white gap-2">
              <Plus className="w-4 h-4" />
              Discover Trends
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
