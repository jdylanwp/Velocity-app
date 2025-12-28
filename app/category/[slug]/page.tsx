import { createClient } from '@/lib/supabase-server';
import { TrendWithCategory } from '@/lib/types';
import { TrendGrid } from '@/components/trends/TrendGrid';

// --- CRITICAL FIX ---
// You were missing this line in your Home Page (app/page.tsx).
// It fixes the "Invariant: cookies()" error.
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Initialize Supabase
  const supabase = await createClient();

  // 2. Fetch Trends for the Home Page
  // We fetch all active trends (not filtered by category)
  const { data: trendsData, error } = await supabase
    .from('trends')
    .select('*, categories(*)')
    .neq('status', 'discovered')
    .order('growth_percentage', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching home page trends:", error);
  }

  const trends = (trendsData || []) as TrendWithCategory[];

  return (
    <main className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Discover Trends</h1>
        <p className="text-muted-foreground">
          Explore the latest growing trends across all categories.
        </p>
      </div>

      <TrendGrid trends={trends} />
    </main>
  );
}