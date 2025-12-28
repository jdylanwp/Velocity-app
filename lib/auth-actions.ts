import { createClient } from '@/lib/supabase-server';

export async function createUserProfile(userId: string, email: string) {
  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile;
  }

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email,
      subscription_tier: 'free',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  return newProfile;
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}
