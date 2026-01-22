import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'No code' });

  try {
    // 1. Get Token
    const form = new FormData();
    form.append('client_id', process.env.NEXT_PUBLIC_META_APP_ID!);
    form.append('client_secret', process.env.META_APP_SECRET!);
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`);
    form.append('code', code);

    const { data } = await axios.post('https://api.instagram.com/oauth/access_token', form);
    
    // 2. Save to DB
    await supabaseAdmin.from('instagram_accounts').upsert({
      instagram_user_id: String(data.user_id),
      access_token: data.access_token, // Short lived for now, exchange for long lived in prod
    }, { onConflict: 'instagram_user_id' });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
  } catch (e) {
    return NextResponse.json({ error: 'Login Failed' }, { status: 500 });
  }
}