'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import axios from 'axios';

// 1. Send a Reply
export async function sendMessage(conversationId: string, text: string) {
  try {
    // Get Recipient ID from our DB
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .select('instagram_user_id')
      .eq('id', conversationId)
      .single();

    if (!conv) throw new Error('Conversation not found');

    // Get a valid Access Token
    const { data: acc } = await supabaseAdmin
      .from('instagram_accounts')
      .select('access_token')
      .limit(1)
      .single();

    if (!acc) throw new Error('No Instagram account connected');

    // Send to Meta/Instagram Graph API
    await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
      recipient: { id: conv.instagram_user_id },
      message: { text: text },
      tag: 'HUMAN_AGENT' // Required to bypass the 24h standard messaging window
    }, { 
      params: { access_token: acc.access_token } 
    });

    // Save the message to our database so it shows in the UI instantly
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      sender_id: 'me',
      message_text: text,
      is_from_me: true
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('SendMessage Error:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('SendMessage Error:', error.message);
    } else {
      console.error('SendMessage Error:', error);
    }
    throw new Error('Failed to send message');
  }
}

// 2. Fetch Real Name, Profile Pic & BIO
export async function refreshContactInfo(instagramUserId: string) {
  try {
    // Get Access Token
    const { data: acc } = await supabaseAdmin
      .from('instagram_accounts')
      .select('access_token')
      .limit(1)
      .single();
    
    if (!acc) return;

    // Ask Meta for username, profile pic, AND biography
    const response = await axios.get(`https://graph.facebook.com/v21.0/${instagramUserId}`, {
        params: {
            fields: 'username,profile_picture_url,biography', // <--- Added biography request here
            access_token: acc.access_token
        }
    });

    const { username, profile_picture_url, biography } = response.data;

    // Update our database with the real info
    await supabaseAdmin.from('conversations')
        .update({ 
            username: username, 
            profile_pic_url: profile_picture_url,
            bio: biography // <--- Save biography to your new database column
        })
        .eq('instagram_user_id', instagramUserId);

    console.log(`Updated contact info for ${username}`);
  } catch (error) {
    console.error('Failed to refresh contact info:', error);
  }
}