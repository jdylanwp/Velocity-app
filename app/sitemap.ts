import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  const { data: trends } = await supabase
    .from('trends')
    .select('slug, added_at')
    .neq('status', 'discovered')
    .order('added_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const trendUrls =
    trends?.map((trend) => ({
      url: `${baseUrl}/trend/${trend.slug}`,
      lastModified: new Date(trend.added_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })) || [];

  const categoryUrls =
    categories?.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...trendUrls,
    ...categoryUrls,
  ];
}
