import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { SeedManagerClient } from '@/components/admin/SeedManagerClient';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'admin@velocity.com';

export default async function AdminSeedsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  const { data: seeds } = await supabase
    .from('seeds')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: trendsCount } = await supabase
    .from('trends')
    .select('seed_id')
    .not('seed_id', 'is', null);

  const seedTrendCounts = (trendsCount || []).reduce((acc, t) => {
    if (t.seed_id) {
      acc[t.seed_id] = (acc[t.seed_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const seedsWithCounts = (seeds || []).map(seed => ({
    ...seed,
    trend_count: seedTrendCounts[seed.id] || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Seed Manager</h1>
        <p className="text-zinc-400">
          Manage global seeds and monitor the discovery pipeline
        </p>
      </div>

      <SeedManagerClient
        seeds={seedsWithCounts}
        categories={categories || []}
      />
    </div>
  );
}
