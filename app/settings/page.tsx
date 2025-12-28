'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockProfile } from '@/lib/mockData';
import { Check, Copy, Eye, EyeOff, CreditCard, User, Key } from 'lucide-react';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockApiKey = 'vl_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx';

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-zinc-100 dark:bg-zinc-800">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Profile Information
            </h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={mockProfile.email || ''}
                  disabled
                  className="bg-zinc-50 dark:bg-zinc-900"
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  type="text"
                  defaultValue={mockProfile.email?.split('@')[0] || ''}
                  placeholder="Enter your name"
                />
              </div>
              <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Current Plan
            </h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize">
                {mockProfile.subscription_tier} Plan
              </span>
              {mockProfile.subscription_tier === 'free' && (
                <span className="text-sm text-muted-foreground">
                  Upgrade to unlock all features
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              name="Free"
              price="$0"
              description="Get started with basic trend discovery"
              features={[
                'View top 10 trends',
                'Basic filters',
                '7-day trend history',
                'Email support',
              ]}
              current={mockProfile.subscription_tier === 'free'}
            />
            <PricingCard
              name="Pro"
              price="$29"
              period="/mo"
              description="Perfect for entrepreneurs and researchers"
              features={[
                'Unlimited trend access',
                'Advanced filters & search',
                '5-year trend history',
                'AI-powered insights',
                'Export to CSV',
                'Priority support',
              ]}
              current={mockProfile.subscription_tier === 'pro'}
              highlighted
            />
            <PricingCard
              name="Business"
              price="$99"
              period="/mo"
              description="For teams and agencies"
              features={[
                'Everything in Pro',
                'Team collaboration',
                'API access',
                'Custom trend alerts',
                'White-label reports',
                'Dedicated account manager',
              ]}
              current={mockProfile.subscription_tier === 'business'}
            />
          </div>

          {mockProfile.subscription_tier !== 'free' && (
            <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Manage Subscription
              </h2>
              <Button variant="outline">Open Stripe Portal</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              API Access
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Use your API key to access Velocity data programmatically.
            </p>

            {mockProfile.subscription_tier === 'business' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value={mockApiKey}
                        readOnly
                        className="pr-20 font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-foreground"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCopyApiKey}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-foreground"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep this key secret. Regenerating will invalidate your current key.
                  </p>
                </div>
                <Button variant="outline">Regenerate Key</Button>
              </div>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 text-center">
                <Key className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  API Access Requires Business Plan
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to the Business plan to access the Velocity API.
                </p>
                <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white">
                  Upgrade to Business
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  current?: boolean;
  highlighted?: boolean;
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  current,
  highlighted,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-xl border p-6 ${
        highlighted
          ? 'border-[#6366f1] bg-[#6366f1]/5 ring-2 ring-[#6366f1]/20'
          : 'border-zinc-200 dark:border-zinc-800 bg-card'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-[#6366f1] text-white">
          Most Popular
        </span>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {period && (
          <span className="text-muted-foreground text-sm">{period}</span>
        )}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${
          current
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            : highlighted
            ? 'bg-[#6366f1] hover:bg-[#5558e3] text-white'
            : ''
        }`}
        variant={current ? 'secondary' : highlighted ? 'default' : 'outline'}
        disabled={current}
      >
        {current ? 'Current Plan' : `Upgrade to ${name}`}
      </Button>
    </div>
  );
}
