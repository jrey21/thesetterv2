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

    // 1. Exchange the Instagram Code for a "Short-Lived Token"
    // Note: We use 'api.instagram.com', NOT 'graph.facebook.com'
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code);

    const tokenRes = await axios.post('https://api.instagram.com/oauth/access_token', formData);
    
    const { access_token, user_id } = tokenRes.data;

    // 2. Upgrade to a "Long-Lived Token" (Lasts 60 days)
    // Now we switch to the Graph API
    const longLivedRes = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type: 'ig_exchange_token',
        client_secret: clientSecret,
        access_token: access_token,
      },
    });

    const longLivedToken = longLivedRes.data.access_token;

    // 3. Get User Profile (Username, etc.)
    const userRes = await axios.get(`https://graph.instagram.com/me`, {
      params: {
        fields: 'id,username,account_type',
        access_token: longLivedToken,
      },
    });

    const userData = userRes.data;

    // 4. Save to Supabase
    const { error } = await supabaseAdmin.from('instagram_accounts').upsert({
      instagram_user_id: userData.id,
      access_token: longLivedToken,
      username: userData.username,
    }, { onConflict: 'instagram_user_id' });

    if (error) throw error;

    // 5. Success! Redirect to Dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);

  } catch (error: any) {
    console.error('Instagram Login Error:', error.response?.data || error.message);
    return NextResponse.json({ 
        error: 'Instagram Login Failed', 
        details: error.response?.data || error.message 
    }, { status: 500 });
  }
}