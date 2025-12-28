'use client';

import { TrendMetric } from '@/lib/types';
import { formatVolume } from '@/lib/mockData';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface MainLineChartProps {
  metrics: TrendMetric[];
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length || !label) return null;

  return (
    <div className="bg-zinc-900 dark:bg-zinc-800 px-4 py-2 rounded-lg shadow-lg border border-zinc-700">
      <p className="text-xs text-zinc-400 mb-1">
        {format(parseISO(label), 'MMM yyyy')}
      </p>
      <p className="text-sm font-semibold text-white">
        {formatVolume(payload[0].value)} searches
      </p>
    </div>
  );
}

export function MainLineChart({ metrics, height = 400 }: MainLineChartProps) {
  const chartData = metrics.map((m) => ({
    date: m.date,
    volume: m.search_volume,
  }));

  const minVolume = Math.min(...chartData.map((d) => d.volume));
  const maxVolume = Math.max(...chartData.map((d) => d.volume));
  const yAxisDomain = [Math.floor(minVolume * 0.8), Math.ceil(maxVolume * 1.1)];

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="mainChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e5e7eb"
            className="dark:stroke-zinc-800"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(parseISO(value), 'MMM')}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            domain={yAxisDomain}
            tickFormatter={(value) => formatVolume(value)}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            dx={-10}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#mainChartGradient)"
            animationDuration={750}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
