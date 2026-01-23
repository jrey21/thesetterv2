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

    // 1. Exchange the Login Code for a "User Access Token" (Jason's Key)
    const tokenRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: {
        client_id: clientId,
        redirect_uri: redirectUri,
        client_secret: clientSecret,
        code: code,
      },
    });

    const userAccessToken = tokenRes.data.access_token;

    // 2. CRITICAL STEP: Use Jason's Key to get the "Business Page Key"
    // We ask: "Show me the accounts Jason manages and give me their TOKENS"
    const pagesRes = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
      params: {
        fields: 'access_token,instagram_business_account{id,username,profile_picture_url}',
        access_token: userAccessToken,
      },
    });

    const pages = pagesRes.data.data;
    
    // 3. Find the specific Page that is linked to an Instagram Business Account
    const linkedPage = pages.find((p: any) => p.instagram_business_account);

    if (!linkedPage) {
       return NextResponse.json({ error: 'No Instagram Business Account found. Please make sure your Instagram is switched to "Professional" and connected to a Facebook Page.' }, { status: 400 });
    }

    // 4. Extract the BUSINESS credentials
    const businessId = linkedPage.instagram_business_account.id;
    const businessToken = linkedPage.access_token; // <--- THIS IS THE KEY WE NEED!
    const username = linkedPage.instagram_business_account.username;

    // 5. Save the BUSINESS Token to Supabase (Overwrite the old one)
    const { error } = await supabaseAdmin.from('instagram_accounts').upsert({
      instagram_user_id: businessId, 
      access_token: businessToken, 
      username: username,
    }, { onConflict: 'instagram_user_id' });

    if (error) throw error;

    // 6. Success! Go to Dashboard.
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);

  } catch (error: any) {
    console.error('Callback Error:', error.response?.data || error.message);
    return NextResponse.json({ 
        error: 'Login Failed', 
        details: error.response?.data || error.message 
    }, { status: 500 });
  }
}