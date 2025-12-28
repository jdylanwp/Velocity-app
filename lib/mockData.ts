import { Category, Trend, TrendMetric, TrendWithMetrics, Profile } from './types';

export const mockCategories: Category[] = [
  { id: 1, name: 'SaaS', slug: 'saas' },
  { id: 2, name: 'Health', slug: 'health' },
  { id: 3, name: 'Finance', slug: 'finance' },
  { id: 4, name: 'Consumer', slug: 'consumer' },
  { id: 5, name: 'AI & Tech', slug: 'ai-tech' },
  { id: 6, name: 'Crypto', slug: 'crypto' },
];

function generateHistoricalMetrics(
  trendId: number,
  baseVolume: number,
  growthRate: number,
  volatility: number = 0.15
): TrendMetric[] {
  const metrics: TrendMetric[] = [];
  const now = new Date();
  let volume = baseVolume / (1 + growthRate / 100);

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthlyGrowth = growthRate / 12 / 100;
    const noise = 1 + (Math.random() - 0.5) * volatility;
    volume = volume * (1 + monthlyGrowth) * noise;

    metrics.push({
      id: trendId * 100 + (11 - i),
      trend_id: trendId,
      date: date.toISOString().split('T')[0],
      search_volume: Math.round(Math.max(100, volume)),
    });
  }

  return metrics;
}

const trendData: Omit<Trend, 'id' | 'added_at'>[] = [
  {
    name: 'AI Agents',
    slug: 'ai-agents',
    description: 'Autonomous AI systems that can perform complex tasks independently',
    category_id: 5,
    status: 'exploding',
    current_volume: 45200,
    growth_percentage: 892,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'CHN', 'GBR'],
    is_breakout: true,
    velocity_score: 95,
    forecast_status: 'bullish',
    prediction_confidence: 0.92,
  },
  {
    name: 'Mushroom Coffee',
    slug: 'mushroom-coffee',
    description: 'Coffee blended with functional mushrooms like lions mane and chaga',
    category_id: 2,
    status: 'exploding',
    current_volume: 28400,
    growth_percentage: 534,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'CAN', 'AUS'],
    is_breakout: true,
    velocity_score: 87,
    forecast_status: 'bullish',
    prediction_confidence: 0.85,
  },
  {
    name: 'Micro-SaaS',
    slug: 'micro-saas',
    description: 'Small, profitable software businesses run by solo founders or tiny teams',
    category_id: 1,
    status: 'exploding',
    current_volume: 18700,
    growth_percentage: 412,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'IND'],
    is_breakout: false,
    velocity_score: 78,
    forecast_status: 'bullish',
    prediction_confidence: 0.81,
  },
  {
    name: 'Sleep Optimization',
    slug: 'sleep-optimization',
    description: 'Tech and techniques for improving sleep quality and recovery',
    category_id: 2,
    status: 'exploding',
    current_volume: 32100,
    growth_percentage: 287,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'DEU'],
    is_breakout: false,
    velocity_score: 72,
    forecast_status: 'bullish',
    prediction_confidence: 0.75,
  },
  {
    name: 'Creator Economy Tools',
    slug: 'creator-economy-tools',
    description: 'Software helping content creators monetize and manage their businesses',
    category_id: 1,
    status: 'exploding',
    current_volume: 24500,
    growth_percentage: 356,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 76,
    forecast_status: 'bullish',
    prediction_confidence: 0.79,
  },
  {
    name: 'Vertical SaaS',
    slug: 'vertical-saas',
    description: 'Industry-specific software solutions for niche markets',
    category_id: 1,
    status: 'exploding',
    current_volume: 15800,
    growth_percentage: 245,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 68,
    forecast_status: 'bullish',
    prediction_confidence: 0.72,
  },
  {
    name: 'Cold Plunge',
    slug: 'cold-plunge',
    description: 'Cold water immersion therapy for recovery and wellness',
    category_id: 2,
    status: 'peaked',
    current_volume: 41200,
    growth_percentage: 89,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 45,
    forecast_status: 'neutral',
    prediction_confidence: 0.68,
  },
  {
    name: 'BNPL Services',
    slug: 'bnpl-services',
    description: 'Buy Now Pay Later financing options for consumer purchases',
    category_id: 3,
    status: 'regular',
    current_volume: 67300,
    growth_percentage: 45,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 32,
    forecast_status: 'neutral',
    prediction_confidence: 0.55,
  },
  {
    name: 'Electric Bikes',
    slug: 'electric-bikes',
    description: 'Battery-powered bicycles for commuting and recreation',
    category_id: 4,
    status: 'regular',
    current_volume: 89400,
    growth_percentage: 67,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 38,
    forecast_status: 'neutral',
    prediction_confidence: 0.62,
  },
  {
    name: 'RAG Systems',
    slug: 'rag-systems',
    description: 'Retrieval Augmented Generation for enhanced AI responses',
    category_id: 5,
    status: 'exploding',
    current_volume: 12400,
    growth_percentage: 1247,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 98,
    forecast_status: 'bullish',
    prediction_confidence: 0.95,
  },
  {
    name: 'Peptides',
    slug: 'peptides',
    description: 'Short chains of amino acids used for health and performance',
    category_id: 2,
    status: 'exploding',
    current_volume: 38900,
    growth_percentage: 478,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 84,
    forecast_status: 'bullish',
    prediction_confidence: 0.87,
  },
  {
    name: 'Revenue Operations',
    slug: 'revenue-operations',
    description: 'Unified approach to sales, marketing, and customer success',
    category_id: 1,
    status: 'exploding',
    current_volume: 21300,
    growth_percentage: 312,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 74,
    forecast_status: 'bullish',
    prediction_confidence: 0.78,
  },
  {
    name: 'Digital Twins',
    slug: 'digital-twins',
    description: 'Virtual replicas of physical systems for simulation and analysis',
    category_id: 5,
    status: 'exploding',
    current_volume: 16700,
    growth_percentage: 234,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 66,
    forecast_status: 'bullish',
    prediction_confidence: 0.71,
  },
  {
    name: 'Fractional Executives',
    slug: 'fractional-executives',
    description: 'Part-time C-level executives for growing companies',
    category_id: 1,
    status: 'exploding',
    current_volume: 8900,
    growth_percentage: 567,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 82,
    forecast_status: 'bullish',
    prediction_confidence: 0.84,
  },
  {
    name: 'Continuous Glucose Monitors',
    slug: 'continuous-glucose-monitors',
    description: 'Wearable devices for real-time blood sugar tracking',
    category_id: 2,
    status: 'exploding',
    current_volume: 29800,
    growth_percentage: 389,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 79,
    forecast_status: 'bullish',
    prediction_confidence: 0.82,
  },
  {
    name: 'AI Companions',
    slug: 'ai-companions',
    description: 'AI-powered virtual companions for conversation and support',
    category_id: 5,
    status: 'exploding',
    current_volume: 34600,
    growth_percentage: 723,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 91,
    forecast_status: 'bullish',
    prediction_confidence: 0.89,
  },
  {
    name: 'Embedded Finance',
    slug: 'embedded-finance',
    description: 'Financial services integrated into non-financial platforms',
    category_id: 3,
    status: 'exploding',
    current_volume: 11200,
    growth_percentage: 298,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 71,
    forecast_status: 'bullish',
    prediction_confidence: 0.76,
  },
  {
    name: 'Red Light Therapy',
    slug: 'red-light-therapy',
    description: 'Light therapy devices for skin health and recovery',
    category_id: 2,
    status: 'peaked',
    current_volume: 52100,
    growth_percentage: 124,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 48,
    forecast_status: 'neutral',
    prediction_confidence: 0.65,
  },
  {
    name: 'DeFi Yield',
    slug: 'defi-yield',
    description: 'Decentralized finance protocols for earning passive income',
    category_id: 6,
    status: 'regular',
    current_volume: 19800,
    growth_percentage: -12,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 18,
    forecast_status: 'bearish',
    prediction_confidence: 0.72,
  },
  {
    name: 'Autonomous Vehicles',
    slug: 'autonomous-vehicles',
    description: 'Self-driving cars and transportation technology',
    category_id: 5,
    status: 'regular',
    current_volume: 78500,
    growth_percentage: 34,
    source: 'manual',
    last_fetched_at: null,
    seed_id: null,
    top_regions: ['USA', 'GBR', 'CAN'],
    is_breakout: false,
    velocity_score: 28,
    forecast_status: 'neutral',
    prediction_confidence: 0.58,
  },
];

function generateMockDate(monthsAgo: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  return date.toISOString();
}

export const mockTrends: Trend[] = trendData.map((trend, index) => ({
  ...trend,
  id: index + 1,
  added_at: generateMockDate(Math.floor(Math.random() * 12)),
}));

export const mockTrendMetrics: TrendMetric[] = mockTrends.flatMap((trend) =>
  generateHistoricalMetrics(
    trend.id,
    trend.current_volume,
    trend.growth_percentage,
    trend.status === 'exploding' ? 0.2 : 0.1
  )
);

export const mockTrendsWithMetrics: TrendWithMetrics[] = mockTrends.map((trend) => ({
  ...trend,
  metrics: mockTrendMetrics.filter((m) => m.trend_id === trend.id),
  category: mockCategories.find((c) => c.id === trend.category_id),
}));

export const mockProfile: Profile = {
  id: 'mock-user-id',
  email: 'demo@velocity.app',
  stripe_customer_id: null,
  subscription_tier: 'free',
  created_at: new Date().toISOString(),
};

export function getTrendBySlug(slug: string): TrendWithMetrics | undefined {
  return mockTrendsWithMetrics.find((t) => t.slug === slug);
}

export function getTrendsByCategory(categorySlug: string): TrendWithMetrics[] {
  const category = mockCategories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return mockTrendsWithMetrics.filter((t) => t.category_id === category.id);
}

export function getExplodingTrends(): TrendWithMetrics[] {
  return mockTrendsWithMetrics.filter((t) => t.status === 'exploding');
}

export function getRelatedTrends(trendId: number, limit: number = 3): TrendWithMetrics[] {
  const trend = mockTrendsWithMetrics.find((t) => t.id === trendId);
  if (!trend) return [];
  return mockTrendsWithMetrics
    .filter((t) => t.id !== trendId && t.category_id === trend.category_id)
    .slice(0, limit);
}

export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k`;
  }
  return volume.toString();
}

export function formatGrowth(growth: number): string {
  const sign = growth >= 0 ? '+' : '';
  return `${sign}${growth}%`;
}
