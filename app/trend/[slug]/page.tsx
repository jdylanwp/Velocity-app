import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase-server';
import { TrendWithCategory, TrendMetric, Category } from '@/lib/types';
import { MainLineChart } from '@/components/trends/MainLineChart';
import { TrendCard } from '@/components/trends/TrendCard';
import { ProLock } from '@/components/trends/ProLock';
import {
  ArrowLeft,
  Flame,
  TrendingUp,
  Minus,
  Bookmark,
  Share2,
  BarChart3,
  Calendar,
  Target,
  TrendingDown,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface TrendDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrendDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: trend } = await supabase
    .from('trends')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (!trend) {
    return {
      title: 'Trend Not Found',
    };
  }

  const typedTrend = trend as TrendWithCategory;
  const growthDirection = typedTrend.growth_percentage >= 0 ? 'up' : 'down';
  const title = `${typedTrend.name} - Search Trends & Growth Analysis`;
  const description = typedTrend.description ||
    `${typedTrend.name} is ${growthDirection} ${Math.abs(typedTrend.growth_percentage)}% with ${formatVolume(typedTrend.current_volume)} monthly searches. ${typedTrend.status === 'exploding' ? 'This trend is exploding!' : typedTrend.status === 'peaked' ? 'This trend has peaked.' : 'Track this emerging trend.'} Get AI-powered predictions and insights.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k`;
  }
  return volume.toString();
}

function formatGrowth(growth: number): string {
  const sign = growth >= 0 ? '+' : '';
  return `${sign}${growth}%`;
}

export default async function TrendDetailPage({ params }: TrendDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: trend, error } = await supabase
    .from('trends')
    .select('*, categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !trend) {
    notFound();
  }

  const typedTrend = trend as TrendWithCategory;

  const { data: metrics } = await supabase
    .from('trend_metrics')
    .select('*')
    .eq('trend_id', typedTrend.id)
    .order('date', { ascending: true });

  const trendMetrics = (metrics || []) as TrendMetric[];

  const { data: relatedData } = await supabase
    .from('trends')
    .select('*, categories(*)')
    .eq('category_id', typedTrend.category_id)
    .neq('id', typedTrend.id)
    .neq('status', 'discovered')
    .limit(3);

  const relatedTrends = (relatedData || []) as TrendWithCategory[];

  const category = typedTrend.categories;
  const isPositive = typedTrend.growth_percentage >= 0;
  const isPro = false;

  const StatusIcon =
    typedTrend.status === 'exploding'
      ? Flame
      : typedTrend.status === 'peaked'
      ? TrendingUp
      : Minus;

  const statusColors = {
    discovered: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    exploding: 'bg-orange-100 text-orange-700 border-orange-200',
    peaked: 'bg-blue-100 text-blue-700 border-blue-200',
    regular: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Discover
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {typedTrend.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={statusColors[typedTrend.status]}
                  >
                    <StatusIcon className="w-3.5 h-3.5 mr-1" />
                    {typedTrend.status.charAt(0).toUpperCase() +
                      typedTrend.status.slice(1)}
                  </Badge>
                </div>
                {category && (
                  <Link href={`/category/${category.slug}`}>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                      {category.name}
                    </span>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {typedTrend.description && (
              <p className="text-muted-foreground mb-6">{typedTrend.description}</p>
            )}

            {trendMetrics.length > 0 ? (
              <MainLineChart metrics={trendMetrics} height={350} />
            ) : (
              <div className="flex items-center justify-center h-[350px] bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No historical data available yet
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Growth (6mo)
                </span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  isPositive ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {formatGrowth(typedTrend.growth_percentage)}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#6366f1]" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Monthly Searches
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatVolume(typedTrend.current_volume)}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Forecast
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-500">Positive</p>
            </div>
          </div>

          <ProLock
            isLocked={!isPro}
            featureName="AI-Powered Predictions"
            ctaText="Sign up free to unlock predictions"
          >
            <div className="bg-gradient-to-br from-[#6366f1]/5 to-emerald-500/5 rounded-xl border-2 border-[#6366f1]/20 dark:border-[#6366f1]/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      AI Prediction & Forecast
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      6-month outlook powered by machine learning
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    High Confidence
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Next 3 Months
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500">+47%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected Growth
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#6366f1]" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Peak Volume
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatVolume(Math.round(typedTrend.current_volume * 1.8))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Projected by Q2
                  </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Market Stage
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">Early</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Growth Phase
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Key Growth Drivers
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Social media amplification driving organic discovery
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Increasing mainstream adoption and market validation
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Strong seasonal trends indicating sustained interest
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6366f1]" />
                    Optimal Action Timeline
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-foreground min-w-[80px]">Now - 2 weeks</span>
                      <span className="text-muted-foreground">Build initial content and presence</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-foreground min-w-[80px]">2-6 weeks</span>
                      <span className="text-muted-foreground">Scale marketing and capture market share</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-foreground min-w-[80px]">6+ weeks</span>
                      <span className="text-muted-foreground">Optimize and expand product offerings</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Target className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Investment Recommendation
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      High potential opportunity. Strong fundamentals suggest this trend
                      will continue growing. Ideal time to establish market position.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ProLock>

          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#6366f1]" />
              <h3 className="text-lg font-semibold text-foreground">
                Why is this trending?
              </h3>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {typedTrend.name} has seen remarkable growth due to several
                converging factors. The increasing consumer interest in innovative
                solutions, combined with social media amplification and influencer
                endorsements, has created a perfect storm for this trend. Early
                adopters have validated the category, leading to mainstream
                awareness and sustained search volume growth.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Trend Details
            </h3>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Added</dt>
                <dd className="text-sm font-medium text-foreground">
                  {new Date(typedTrend.added_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Category</dt>
                <dd className="text-sm font-medium text-foreground">
                  {category?.name || 'Uncategorized'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium text-foreground capitalize">
                  {typedTrend.status}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Data Points</dt>
                <dd className="text-sm font-medium text-foreground">
                  {trendMetrics.length}
                </dd>
              </div>
            </dl>
          </div>

          {relatedTrends.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Related Trends
              </h3>
              <div className="space-y-4">
                {relatedTrends.map((related) => (
                  <TrendCard key={related.id} trend={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
