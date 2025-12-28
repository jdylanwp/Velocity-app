import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const ADMIN_EMAIL = 'admin@velocity.com';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = user.email === ADMIN_EMAIL;
    const isPro = profile?.subscription_tier === 'pro';

    if (!isAdmin && !isPro) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { term, category_id } = body;

    if (!term || typeof term !== 'string') {
      return NextResponse.json({ error: 'Invalid term' }, { status: 400 });
    }

    if (isPro && !isAdmin) {
      const { count } = await supabase
        .from('seeds')
        .select('*', { count: 'exact', head: true })
        .eq('added_by_user_id', user.id);

      if (count !== null && count >= 3) {
        return NextResponse.json(
          { error: 'Maximum 3 seeds allowed. Delete one to add another.' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('seeds')
      .insert({
        term: term.trim(),
        category_id: category_id || null,
        added_by_user_id: isAdmin ? null : user.id,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This seed already exists' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating seed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, is_active } = body;

    if (!id || typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('seeds')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating seed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = user.email === ADMIN_EMAIL;
    const isPro = profile?.subscription_tier === 'pro';

    if (!isAdmin && !isPro) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!isAdmin) {
      const { data: seed } = await supabase
        .from('seeds')
        .select('added_by_user_id')
        .eq('id', id)
        .maybeSingle();

      if (!seed || seed.added_by_user_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const { error } = await supabase
      .from('seeds')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting seed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
