'use client';

import { TrendWithRelations, TrendMetric } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, Zap, Lock } from 'lucide-react';
import Link from 'next/link';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrendCardProps {
  trend: TrendWithRelations;
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

function getVelocityColor(score: number): string {
  if (score <= 50) return 'text-zinc-400';
  if (score <= 75) return 'text-indigo-500';
  return 'text-emerald-500';
}

function getVelocityRingColor(score: number): string {
  if (score <= 50) return '#71717a';
  if (score <= 75) return '#6366f1';
  return '#10b981';
}

function VelocityRing({ score, isLocked }: { score: number | null; isLocked: boolean }) {
  if (isLocked || score === null) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-zinc-200 dark:text-zinc-800"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              Velocity Score is a proprietary prediction of future growth. Upgrade to Pro to unlock.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-zinc-200 dark:text-zinc-800"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke={getVelocityRingColor(score)}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold font-mono ${getVelocityColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
}

function ForecastBadge({ status }: { status: string | null }) {
  if (!status || status === 'neutral') {
    return (
      <div className="flex items-center gap-1 text-zinc-400">
        <Minus className="w-3 h-3" />
      </div>
    );
  }

  if (status === 'bullish') {
    return (
      <div className="flex items-center gap-1 text-emerald-500">
        <TrendingUp className="w-3 h-3" />
      </div>
    );
  }

  if (status === 'bearish') {
    return (
      <div className="flex items-center gap-1 text-red-500">
        <TrendingDown className="w-3 h-3" />
      </div>
    );
  }

  return null;
}

const countryFlags: Record<string, string> = {
  USA: '🇺🇸',
  GBR: '🇬🇧',
  DEU: '🇩🇪',
  FRA: '🇫🇷',
  JPN: '🇯🇵',
  CHN: '🇨🇳',
  IND: '🇮🇳',
  BRA: '🇧🇷',
  CAN: '🇨🇦',
  AUS: '🇦🇺',
  KOR: '🇰🇷',
  ESP: '🇪🇸',
  ITA: '🇮🇹',
  MEX: '🇲🇽',
  NLD: '🇳🇱',
  SGP: '🇸🇬',
  SWE: '🇸🇪',
  CHE: '🇨🇭',
  NOR: '🇳🇴',
  DNK: '🇩🇰',
};

export function TrendCard({ trend }: TrendCardProps) {
  const isPositive = trend.growth_percentage >= 0;
  const isHighGrowth = trend.growth_percentage > 100;
  const category = trend.categories;
  const isVelocityLocked = trend.velocity_score === null;
  const topRegions = trend.top_regions || [];

  const metrics = trend.trend_metrics || [];
  const sortedMetrics = [...metrics].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const chartData = sortedMetrics.length > 0
    ? sortedMetrics.map((m) => ({ value: m.search_volume }))
    : [{ value: 0 }, { value: 0 }, { value: 0 }];

  return (
    <Link href={`/trend/${trend.slug}`}>
      <div className="group relative bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-200 hover:shadow-lg hover:border-[#6366f1]/40 cursor-pointer overflow-hidden">
        {trend.is_breakout && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 animate-pulse">
              <Zap className="w-3 h-3 text-red-500" fill="currentColor" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                Breakout
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <VelocityRing score={trend.velocity_score} isLocked={isVelocityLocked} />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate pr-2 mb-1">
              {trend.name}
            </h3>
            {category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {category.name}
              </span>
            )}
          </div>
        </div>

        {trend.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {trend.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold tracking-tight font-mono ${
                isHighGrowth
                  ? 'text-emerald-500'
                  : isPositive
                  ? 'text-emerald-600'
                  : 'text-red-500'
              }`}
            >
              {formatGrowth(trend.growth_percentage)}
            </span>
            <ForecastBadge status={trend.forecast_status} />
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {formatVolume(trend.current_volume)}
          </span>
        </div>

        <div className="h-16 w-full mb-3">
          {sortedMetrics.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-lg bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Minus className="w-3 h-3" />
                <span className="capitalize">{trend.status}</span>
              </div>
            </div>
          )}
        </div>

        {topRegions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
              Top Regions:
            </span>
            {topRegions.slice(0, 3).map((region, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              >
                <span className="text-[10px]">{countryFlags[region] || '🌍'}</span>
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                  {region}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
