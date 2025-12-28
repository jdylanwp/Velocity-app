export type SubscriptionTier = 'free' | 'pro' | 'business';
export type TrendStatus = 'discovered' | 'regular' | 'exploding' | 'peaked';
export type TrendSource = 'manual' | 'seed_expansion' | 'user_request';
export type ForecastStatus = 'bullish' | 'bearish' | 'neutral';

export interface Profile {
  id: string;
  email: string | null;
  stripe_customer_id: string | null;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Seed {
  id: number;
  term: string;
  category_id: number | null;
  is_active: boolean;
  last_scraped_at: string | null;
  added_by_user_id: string | null;
  created_at: string;
}

export interface Trend {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  status: TrendStatus;
  current_volume: number;
  growth_percentage: number;
  source: TrendSource;
  last_fetched_at: string | null;
  added_at: string;
  velocity_score: number | null;
  forecast_status: ForecastStatus | null;
  prediction_confidence: number | null;
  seed_id: number | null;
  top_regions: string[] | null;
  is_breakout: boolean;
}

export interface TrendMetric {
  id: number;
  trend_id: number;
  date: string;
  search_volume: number;
}

export interface UserSavedTrend {
  user_id: string;
  trend_id: number;
  created_at: string;
}

export interface TrendWithCategory extends Trend {
  categories?: Category;
}

export interface TrendWithMetrics extends Trend {
  metrics: TrendMetric[];
  categories?: Category;
}

export interface TrendWithRelations extends Trend {
  categories?: Category;
  trend_metrics?: TrendMetric[];
}

export interface SeedWithCategory extends Seed {
  categories?: Category;
}

export interface SeedWithTrendCount extends Seed {
  trend_count?: number;
  categories?: Category;
}
