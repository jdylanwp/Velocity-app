import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  // 1. Next.js 15 requires awaiting cookies
  // We wrap this in a try/catch to prevent the "Invariant" crash during
  // static site generation or IDE preview crawling.
  let cookieStore: Awaited<ReturnType<typeof cookies>> | undefined;
  try {
    cookieStore = await cookies();
  } catch (e) {
    // If we catch an error here, it means we are in a static context (no request)
    // We proceed with cookieStore as undefined to allow the build to continue
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Check if cookieStore exists before calling .getAll()
          // This fixes the "ReferenceError: cookieStore is not defined"
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          if (!cookieStore) return;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore!.set(name, value, options)
            );
          } catch (error) {
            // This error is expected when calling set() from a Server Component
          }
        },
      },
    }
  );
}