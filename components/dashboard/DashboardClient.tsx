'use client';

import { useState } from 'react';
import { TrendWithRelations } from '@/lib/types';
import { TrendGrid } from '@/components/trends/TrendGrid';
import {
  TrendFilters,
  TimeframeFilter,
  GrowthFilter,
  StatusFilter,
  SortFilter,
} from '@/components/trends/TrendFilters';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SubscriptionTier, PLAN_CONFIG } from '@/lib/plans';
import Link from 'next/link';

interface DashboardClientProps {
  trends: TrendWithRelations[];
  initialParams: {
    status?: string;
    sort?: string;
    growth?: string;
  };
  userTier: SubscriptionTier;
  isMyNichesView?: boolean;
}

const ITEMS_PER_PAGE = 12;

export function DashboardClient({ trends, initialParams, userTier, isMyNichesView = false }: DashboardClientProps) {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('6m');
  const [growth, setGrowth] = useState<GrowthFilter>((initialParams.growth as GrowthFilter) || 'all');
  const [status, setStatus] = useState<StatusFilter>((initialParams.status as StatusFilter) || 'all');
  const [sort, setSort] = useState<SortFilter>((initialParams.sort as SortFilter) || 'newest');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const planFeatures = PLAN_CONFIG[userTier];
  const isLimitedByPlan = planFeatures.maxTrends !== null && trends.length >= planFeatures.maxTrends;

  const handleFilterChange = (newStatus: StatusFilter, newGrowth: GrowthFilter, newSort: SortFilter) => {
    const params = new URLSearchParams();
    if (newStatus !== 'all') params.set('status', newStatus);
    if (newGrowth !== 'all') params.set('growth', newGrowth);
    if (newSort !== 'newest') params.set('sort', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatus(newStatus);
    handleFilterChange(newStatus, growth, sort);
  };

  const handleGrowthChange = (newGrowth: GrowthFilter) => {
    setGrowth(newGrowth);
    handleFilterChange(status, newGrowth, sort);
  };

  const handleSortChange = (newSort: SortFilter) => {
    setSort(newSort);
    handleFilterChange(status, growth, newSort);
  };

  const visibleTrends = trends.slice(0, visibleCount);
  const hasMore = visibleCount < trends.length;

  return (
    <section>
      {isMyNichesView && (
        <div className="mb-8 pb-6 border-b border-zinc-800">
          <h1 className="text-3xl font-bold text-white mb-2">My Niches</h1>
          <p className="text-zinc-400">
            Personalized trends discovered from your custom niche selections
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {isMyNichesView ? 'Your Niche Trends' : 'Trending Now'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {trends.length} trends {isMyNichesView ? 'from your niches' : 'match your filters'}
          </p>
        </div>
        <TrendFilters
          timeframe={timeframe}
          growth={growth}
          status={status}
          sort={sort}
          onTimeframeChange={setTimeframe}
          onGrowthChange={handleGrowthChange}
          onStatusChange={handleStatusChange}
          onSortChange={handleSortChange}
        />
      </div>

      {trends.length === 0 && isMyNichesView ? (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No trends discovered yet</h3>
            <p className="text-zinc-400 mb-6">
              Your custom niches haven't been scraped yet. Trends will appear here after the next scrape cycle.
            </p>
            <Link href="/hunter">
              <Button>
                Manage Your Niches
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <TrendGrid trends={visibleTrends} />
      )}

      {isLimitedByPlan && (
        <div className="mt-8 p-6 rounded-xl border-2 border-dashed border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/5 to-transparent">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Unlock 1,000+ More Trends
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for unlimited access to all trends, advanced search, and velocity scores.
                </p>
              </div>
            </div>
            <Link href="/pricing">
              <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white gap-2 whitespace-nowrap">
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}

      {!isLimitedByPlan && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="gap-2"
          >
            Load More
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
