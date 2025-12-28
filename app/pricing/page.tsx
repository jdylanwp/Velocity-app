import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PLANS, SubscriptionTier } from '@/lib/plans';

export default function PricingPage() {
  const tiers: SubscriptionTier[] = ['free', 'pro', 'business'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-6">
            <Sparkles className="w-4 h-4 text-[#6366f1]" />
            <span className="text-sm font-medium text-[#6366f1]">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started for free, upgrade when you're ready to unlock advanced features and predictions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const plan = PLANS[tier];
            const Icon = tier === 'free' ? Sparkles : tier === 'pro' ? Crown : Zap;
            const borderColor = plan.highlighted
              ? 'border-[#6366f1] border-2'
              : 'border-zinc-200 dark:border-zinc-800';
            const bgColor = plan.highlighted
              ? 'bg-gradient-to-b from-[#6366f1]/5 to-transparent'
              : 'bg-card';

            return (
              <div
                key={tier}
                className={`relative rounded-2xl ${borderColor} ${bgColor} p-8 ${
                  plan.highlighted ? 'shadow-xl scale-105 z-10' : 'shadow-md'
                } transition-all duration-200 hover:shadow-lg`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-medium">
                      <Crown className="w-3.5 h-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {tier !== 'free' && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={tier === 'free' ? '/' : '/settings?tab=subscription'} className="block">
                  <Button
                    className={`w-full ${
                      tier === 'free'
                        ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900'
                        : tier === 'pro'
                        ? 'bg-[#6366f1] hover:bg-[#5558e3] text-white'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                    }`}
                    size="lg"
                  >
                    {tier === 'free' ? 'Current Plan' : tier === 'business' ? 'Contact Sales' : 'Upgrade Now'}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom plan for your team or enterprise?
          </p>
          <Link href="/settings?tab=subscription">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I change plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and can arrange invoicing for Business plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Is there a free trial for Pro?
              </h3>
              <p className="text-muted-foreground">
                Yes! All Pro plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-muted-foreground">
                Absolutely. Cancel your subscription at any time with no questions asked. Your access continues until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
