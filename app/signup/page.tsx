import { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign Up - Velocity',
  description: 'Create your Velocity account',
};

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Get started</h1>
          <p className="text-muted-foreground">
            Create your account to start discovering trends
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
