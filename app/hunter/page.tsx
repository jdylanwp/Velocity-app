import { createClient } from '@/lib/supabase-server';
import { NicheHunterClient } from '@/components/hunter/NicheHunterClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NicheHunterPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .maybeSingle();

  const isPro = profile?.subscription_tier === 'pro';

  const { data: userSeeds } = await supabase
    .from('seeds')
    .select('*, categories(name, slug)')
    .eq('added_by_user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: trendsCount } = await supabase
    .from('trends')
    .select('seed_id')
    .in('seed_id', (userSeeds || []).map(s => s.id));

  const seedTrendCounts = (trendsCount || []).reduce((acc, t) => {
    if (t.seed_id) {
      acc[t.seed_id] = (acc[t.seed_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const seedsWithCounts = (userSeeds || []).map(seed => ({
    ...seed,
    trend_count: seedTrendCounts[seed.id] || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <NicheHunterClient
        isPro={isPro}
        userSeeds={seedsWithCounts}
        categories={categories || []}
      />
    </div>
  );
}
