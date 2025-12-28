import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login - Velocity',
  description: 'Sign in to your Velocity account',
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your Velocity account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
