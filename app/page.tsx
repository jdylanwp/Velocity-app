import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-server';
import { TrendWithRelations } from '@/lib/types';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { Sparkles, TrendingUp } from 'lucide-react';
import { AdminRefresh } from '@/components/admin/AdminRefresh';
import { TrendGridSkeleton } from '@/components/trends/TrendGridSkeleton';
import { PLAN_CONFIG, SubscriptionTier } from '@/lib/plans';

export const dynamic = 'force-dynamic';

interface SearchParams {
  status?: string;
  sort?: string;
  growth?: string;
  view?: string;
}

async function TrendsData({ params, userTier, userId }: { params: SearchParams; userTier: SubscriptionTier; userId?: string }) {
  try {
    const supabase = await createClient();
    const planFeatures = PLAN_CONFIG[userTier];

    let query = supabase
      .from('trends')
      .select('*, categories(name, slug), trend_metrics(date, search_volume)')
      .neq('status', 'discovered');

    if (params.view === 'my-niches' && userId) {
      const { data: userSeeds } = await supabase
        .from('seeds')
        .select('id')
        .eq('added_by_user_id', userId);

      const seedIds = (userSeeds || []).map(s => s.id);

      if (seedIds.length > 0) {
        query = query
          .eq('source', 'seed_expansion')
          .in('seed_id', seedIds);
      } else {
        return <DashboardClient trends={[]} initialParams={params} userTier={userTier} isMyNichesView={true} />;
      }
    }

    if (planFeatures.maxTrends !== null && params.view !== 'my-niches') {
      query = query.limit(planFeatures.maxTrends);
    } else {
      query = query.limit(100);
    }

    if (params.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    if (params.growth === '100') {
      query = query.gte('growth_percentage', 100);
    } else if (params.growth === '500') {
      query = query.gte('growth_percentage', 500);
    }

    if (params.sort === 'velocity') {
      query = query.order('velocity_score', { ascending: false, nullsFirst: false });
    } else if (params.sort === 'growth') {
      query = query.order('growth_percentage', { ascending: false });
    } else if (params.sort === 'volume') {
      query = query.order('current_volume', { ascending: false });
    } else {
      query = query.order('added_at', { ascending: false });
    }

    const { data: trends, error } = await query;

    if (error) {
      console.error('Error fetching trends:', error);
      return <DashboardClient trends={[]} initialParams={params} userTier={userTier} isMyNichesView={params.view === 'my-niches'} />;
    }

    let typedTrends = (trends || []) as TrendWithRelations[];

    if (!planFeatures.velocityScoreVisible || !planFeatures.forecastVisible) {
      typedTrends = typedTrends.map(trend => ({
        ...trend,
        velocity_score: planFeatures.velocityScoreVisible ? trend.velocity_score : null,
        forecast_status: planFeatures.forecastVisible ? trend.forecast_status : null,
        prediction_confidence: planFeatures.forecastVisible ? trend.prediction_confidence : null,
      }));
    }

    return <DashboardClient trends={typedTrends} initialParams={params} userTier={userTier} isMyNichesView={params.view === 'my-niches'} />;
  } catch (error) {
    console.error('Error in TrendsData:', error);
    return <DashboardClient trends={[]} initialParams={params} userTier={userTier} isMyNichesView={params.view === 'my-niches'} />;
  }
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let userTier: SubscriptionTier = 'free';
  let user = null;
  let explodingCount = 0;
  let totalTrends = 0;
  let categories = [];

  try {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.subscription_tier) {
        userTier = profile.subscription_tier as SubscriptionTier;
      }
    }

    const { data: trendsData } = await supabase
      .from('trends')
      .select('status')
      .neq('status', 'discovered');

    explodingCount = (trendsData || []).filter(
      (t: { status: string }) => t.status === 'exploding'
    ).length;
    totalTrends = (trendsData || []).length;

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    categories = categoriesData || [];
  } catch (error) {
    console.error('Error in DiscoverPage:', error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {params.view !== 'my-niches' && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                  {explodingCount} Exploding Trends
                </span>
              </div>
              <AdminRefresh />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Discover the next big thing
              <br />
              <span className="text-zinc-400">before it explodes.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl mb-6">
              Track emerging trends across industries. Get ahead of the curve with
              real-time data and predictive insights.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <TrendingUp className="w-4 h-4 text-[#6366f1]" />
                <span className="text-sm text-zinc-300">{totalTrends} Trends Tracked</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-sm text-zinc-300">{categories.length} Categories</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <Suspense fallback={<TrendGridSkeleton />}>
        <TrendsData params={params} userTier={userTier} userId={user?.id} />
      </Suspense>
    </div>
  );
}
