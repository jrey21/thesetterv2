// app/api/auth/callback/route.ts (DEBUG VERSION)
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

    // 1. Get User Token
    const tokenRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: { client_id: clientId, redirect_uri: redirectUri, client_secret: clientSecret, code: code },
    });
    const userAccessToken = tokenRes.data.access_token;

    // 2. DEBUG: Ask Facebook for EVERYTHING about your pages
    const pagesRes = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
      params: {
        fields: 'name,id,instagram_business_account', // Asking specifically for the link
        access_token: userAccessToken,
      },
    });

    // 3. SHOW THE RAW DATA ON SCREEN
    return NextResponse.json({ 
        debug_message: "Here is what Facebook found:",
        pages_found: pagesRes.data.data 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, details: error.response?.data }, { status: 500 });
  }
}