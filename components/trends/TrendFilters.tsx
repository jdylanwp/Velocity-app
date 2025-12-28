'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type TimeframeFilter = '3m' | '6m' | '1y' | '5y';
export type GrowthFilter = 'all' | '100' | '500';
export type StatusFilter = 'all' | 'exploding' | 'regular' | 'peaked';
export type SortFilter = 'newest' | 'growth' | 'volume' | 'velocity';

interface TrendFiltersProps {
  timeframe: TimeframeFilter;
  growth: GrowthFilter;
  status: StatusFilter;
  sort?: SortFilter;
  onTimeframeChange: (value: TimeframeFilter) => void;
  onGrowthChange: (value: GrowthFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange?: (value: SortFilter) => void;
}

const timeframeOptions: { value: TimeframeFilter; label: string }[] = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '5y', label: '5 Years' },
];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'exploding', label: 'Exploding' },
  { value: 'regular', label: 'Regular' },
  { value: 'peaked', label: 'Peaked' },
];

export function TrendFilters({
  timeframe,
  growth,
  status,
  sort = 'newest',
  onTimeframeChange,
  onGrowthChange,
  onStatusChange,
  onSortChange,
}: TrendFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
        {timeframeOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onTimeframeChange(option.value)}
            className={cn(
              'px-3 py-1.5 h-8 text-sm font-medium rounded-md transition-colors',
              timeframe === option.value
                ? 'bg-white dark:bg-zinc-700 text-foreground shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {onSortChange && (
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortFilter)}>
          <SelectTrigger className="w-[160px] h-9 bg-zinc-100 dark:bg-zinc-800 border-0">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="velocity">Velocity Score</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={growth} onValueChange={(v) => onGrowthChange(v as GrowthFilter)}>
        <SelectTrigger className="w-[150px] h-9 bg-zinc-100 dark:bg-zinc-800 border-0">
          <SelectValue placeholder="Growth" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Growth</SelectItem>
          <SelectItem value="100">&gt; 100%</SelectItem>
          <SelectItem value="500">&gt; 500%</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
        <SelectTrigger className="w-[140px] h-9 bg-zinc-100 dark:bg-zinc-800 border-0">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
