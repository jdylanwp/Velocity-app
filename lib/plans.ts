export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface PlanFeatures {
  maxTrends: number | null;
  searchEnabled: boolean;
  velocityScoreVisible: boolean;
  forecastVisible: boolean;
  exportEnabled: boolean;
  apiAccess: boolean;
  emailAlerts: boolean;
  whiteLabel: boolean;
}

export const PLAN_CONFIG: Record<SubscriptionTier, PlanFeatures> = {
  free: {
    maxTrends: 10,
    searchEnabled: false,
    velocityScoreVisible: false,
    forecastVisible: false,
    exportEnabled: false,
    apiAccess: false,
    emailAlerts: false,
    whiteLabel: false,
  },
  pro: {
    maxTrends: null,
    searchEnabled: true,
    velocityScoreVisible: true,
    forecastVisible: true,
    exportEnabled: false,
    apiAccess: false,
    emailAlerts: true,
    whiteLabel: false,
  },
  business: {
    maxTrends: null,
    searchEnabled: true,
    velocityScoreVisible: true,
    forecastVisible: true,
    exportEnabled: true,
    apiAccess: true,
    emailAlerts: true,
    whiteLabel: true,
  },
};

export interface PlanDetails {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Record<SubscriptionTier, PlanDetails> = {
  free: {
    name: 'Explorer',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      'Daily Top 10 Trends',
      'Basic Charts',
      'Community Support',
      'Weekly Email Digest',
    ],
  },
  pro: {
    name: 'Trend Hunter',
    price: '$29',
    description: 'For serious trend spotters',
    features: [
      'Unlimited Trends Access',
      'Advanced Search',
      'Velocity Scores',
      'Growth Forecasts',
      'Email Alerts',
      'Priority Support',
      'Historical Data (12 months)',
    ],
    highlighted: true,
  },
  business: {
    name: 'Empire',
    price: '$99',
    description: 'For teams and power users',
    features: [
      'All Pro Features',
      'CSV Export',
      'API Access',
      'White Label Reports',
      'Team Collaboration',
      'Dedicated Account Manager',
      'Custom Integrations',
    ],
  },
};

export function getPlanFeatures(tier: SubscriptionTier): PlanFeatures {
  return PLAN_CONFIG[tier];
}

export function canAccessFeature(
  tier: SubscriptionTier,
  feature: keyof PlanFeatures
): boolean {
  return PLAN_CONFIG[tier][feature] as boolean;
}
