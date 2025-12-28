'use client';

import { mockTrendsWithMetrics, mockProfile } from '@/lib/mockData';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { ProLock } from '@/components/trends/ProLock';
import { Sparkles, TrendingUp, Target, ArrowUpRight } from 'lucide-react';

export default function PredictionsPage() {
  const isPro = mockProfile.subscription_tier !== 'free';

  const topPredictions = mockTrendsWithMetrics
    .filter((t) => t.status === 'exploding')
    .sort((a, b) => b.growth_percentage - a.growth_percentage)
    .slice(0, 6);

  const upcomingTrends = mockTrendsWithMetrics
    .filter((t) => t.status === 'regular' && t.growth_percentage > 50)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#6366f1]" />
          <h1 className="text-2xl font-bold text-foreground">Pro Predictions</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered trend predictions and early signals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-xl font-bold text-foreground">
                {topPredictions.length} Exploding
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#6366f1]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
              <p className="text-xl font-bold text-foreground">87%</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Early Signals</p>
              <p className="text-xl font-bold text-foreground">
                {upcomingTrends.length} Detected
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProLock isLocked={!isPro} featureName="Pro Predictions">
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Top Growth Predictions
            </h2>
            <p className="text-sm text-muted-foreground">
              Trends with the highest predicted growth in the next 3 months
            </p>
          </div>
          <TrendGrid trends={topPredictions} />
        </section>
      </ProLock>

      <ProLock isLocked={!isPro} featureName="Early Signals">
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Early Signals
            </h2>
            <p className="text-sm text-muted-foreground">
              Trends showing early growth patterns before they explode
            </p>
          </div>
          <TrendGrid trends={upcomingTrends} />
        </section>
      </ProLock>

      <ProLock isLocked={!isPro} featureName="AI Analysis">
        <section className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#6366f1]" />
            <h2 className="text-lg font-semibold text-foreground">
              Weekly AI Analysis
            </h2>
          </div>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              This week&apos;s analysis shows strong momentum in the AI and Health sectors.
              AI Agents continues to dominate search growth with an unprecedented 892%
              increase. The convergence of enterprise adoption and consumer awareness is
              creating a perfect environment for sustained growth.
            </p>
            <p className="text-muted-foreground">
              In the Health category, Mushroom Coffee and Peptides are showing resilient
              growth patterns. Our models predict these trends will maintain momentum
              through Q1 2025, with potential for mainstream adoption.
            </p>
            <p className="text-muted-foreground">
              <strong>Key Recommendation:</strong> Focus on AI-adjacent trends in the SaaS
              space. Revenue Operations and Creator Economy Tools are well-positioned for
              the next growth cycle.
            </p>
          </div>
        </section>
      </ProLock>
    </div>
  );
}
