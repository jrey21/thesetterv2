'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import axios from 'axios';

// 1. Send a Reply (Debug Version)
export async function sendMessage(conversationId: string, text: string) {
  try {
    console.log(`Attempting to send message to conversation: ${conversationId}`);

    // Get Recipient ID
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .select('instagram_user_id')
      .eq('id', conversationId)
      .single();

    if (!conv) throw new Error('Conversation not found in Database');
    console.log(`Found Recipient ID: ${conv.instagram_user_id}`);

    // Get Access Token
    const { data: acc } = await supabaseAdmin
      .from('instagram_accounts')
      .select('access_token')
      .limit(1)
      .single();

    if (!acc) throw new Error('No Instagram account connected (No Access Token)');

    // Send to Meta/Instagram Graph API
    try {
        const response = await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
            recipient: { id: conv.instagram_user_id },
            message: { text: text },
            tag: 'HUMAN_AGENT' // Needed for messaging outside 24h window
        }, { 
            params: { access_token: acc.access_token } 
        });
        console.log("Facebook API Success:", response.data);
    } catch (fbError: any) {
        // CAPTURE THE EXACT FACEBOOK ERROR
        console.error("Facebook API Failed:", fbError.response?.data);
        throw new Error(`Facebook rejected the message: ${JSON.stringify(fbError.response?.data?.error?.message || fbError.message)}`);
    }

    // Save to Database (Only if FB succeeds)
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      sender_id: 'me',
      message_text: text,
      is_from_me: true
    });

  } catch (error: any) {
    console.error('SendMessage Critical Error:', error.message);
    throw error; // Throw it so the UI knows it failed
  }
}

// 2. Fetch Contact Info (Keep this as is)
export async function refreshContactInfo(instagramUserId: string) {
  try {
    const { data: acc } = await supabaseAdmin.from('instagram_accounts').select('access_token').limit(1).single();
    if (!acc) return;

    const response = await axios.get(`https://graph.facebook.com/v21.0/${instagramUserId}`, {
        params: {
            fields: 'username,profile_picture_url,biography', 
            access_token: acc.access_token
        }
    });

    const { username, profile_picture_url, biography } = response.data;

    await supabaseAdmin.from('conversations')
        .update({ username, profile_pic_url: profile_picture_url, bio: biography })
        .eq('instagram_user_id', instagramUserId);
  } catch (error) {
    console.error('Failed to refresh contact info:', error);
  }
}