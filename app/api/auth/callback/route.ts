import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 });

  try {
    const clientId = process.env.NEXT_PUBLIC_META_APP_ID!;
    const clientSecret = process.env.META_APP_SECRET!;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

    // 1. Exchange Code for Access Token
    const tokenRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: {
        client_id: clientId,
        redirect_uri: redirectUri,
        client_secret: clientSecret,
        code: code,
      },
    });

    const accessToken = tokenRes.data.access_token;

    // 2. Get User Info
    const meRes = await axios.get('https://graph.facebook.com/v21.0/me', {
      params: {
        fields: 'id,name',
        access_token: accessToken,
      },
    });

    const userId = meRes.data.id;
    const userName = meRes.data.name;

    // 3. Save to Supabase
    const { error } = await supabaseAdmin.from('instagram_accounts').upsert({
      instagram_user_id: userId, 
      access_token: accessToken,
      username: userName,
    }, { onConflict: 'instagram_user_id' });

    if (error) throw error;

    // 4. Redirect to Dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);

  } catch (error: unknown) {
    if (error && typeof error === 'object') {
      const err = error as { response?: { data?: unknown }, message?: string };
      console.error('Callback Error:', err.response?.data ?? err.message);

      // UPDATED: This will now show the REAL error on your screen
      return NextResponse.json({ 
          error: 'Login Failed', 
          details: err.response?.data ?? err.message 
      }, { status: 500 });
    } else {
      console.error('Callback Error:', error);

      return NextResponse.json({ 
          error: 'Login Failed', 
          details: String(error)
      }, { status: 500 });
    }
  }
}