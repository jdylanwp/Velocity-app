'use client';

import { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProLockOverlayProps {
  children: ReactNode;
  isLocked: boolean;
  featureName?: string;
  ctaText?: string;
}

export function ProLock({ children, isLocked, featureName = 'this feature', ctaText = 'Upgrade to Pro' }: ProLockOverlayProps) {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <Lock className="w-5 h-5 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Unlock {featureName}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Sign up for free to access AI-powered predictions and insights.
          </p>
          <Link href="/signup">
            <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ProLockBadgeProps {
  feature?: 'velocity' | 'forecast' | 'export' | 'search';
  size?: 'sm' | 'md' | 'lg';
}

export function ProLockBadge({ feature = 'velocity', size = 'md' }: ProLockBadgeProps) {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const featureLabels = {
    velocity: 'Pro Metric',
    forecast: 'Pro Forecast',
    export: 'Business Feature',
    search: 'Pro Feature',
  };

  return (
    <Link href="/pricing">
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 cursor-pointer hover:bg-[#6366f1]/20 transition-colors">
        <Lock className={`${iconSizes[size]} text-[#6366f1]`} />
        <span className={`${textSizes[size]} font-medium text-[#6366f1]`}>
          {featureLabels[feature]}
        </span>
      </div>
    </Link>
  );
}
