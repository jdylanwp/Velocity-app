import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase-server';
import { SubscriptionTier } from '@/lib/plans';

// --- CRITICAL FIX ---
// This line prevents the "Invariant: cookies()" error globally for all pages
// that use this layout by forcing Next.js to render on the server.
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Velocity - Discover Trending Topics Before They Explode',
  description: 'Track emerging trends, discover viral topics, and stay ahead of the curve with real-time trend analytics.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userTier: SubscriptionTier = 'free';
  let userEmail: string | null = null;

  try {
    // 1. Initialize Supabase Client
    const supabase = await createClient();

    // 2. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();

    // 3. Fetch Profile Data if user exists
    if (user) {
      userEmail = user.email || null;
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.subscription_tier) {
        userTier = profile.subscription_tier as SubscriptionTier;
      }
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  }

  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrainsMono.variable}`}>
        <AppLayout userTier={userTier} userEmail={userEmail}>
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}