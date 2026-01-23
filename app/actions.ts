'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import axios from 'axios';

export async function sendMessage(conversationId: string, text: string) {
  // 1. Setup: Define variables outside try/catch to debug easier
  let recipientId = '';
  let accessToken = '';

  try {
    // 2. Get Recipient ID
    const { data: conv } = await supabaseAdmin
      .from('conversations')
      .select('instagram_user_id')
      .eq('id', conversationId)
      .single();

    if (!conv) return { success: false, error: 'Conversation ID not found in database.' };
    recipientId = conv.instagram_user_id;

    // 3. Get Access Token
    const { data: acc } = await supabaseAdmin
      .from('instagram_accounts')
      .select('access_token')
      .limit(1)
      .single();

    if (!acc) return { success: false, error: 'No Instagram Account connected.' };
    accessToken = acc.access_token;

    // 4. Send to Facebook API
    const fbUrl = `https://graph.facebook.com/v21.0/me/messages?access_token=${accessToken}`;
    
    await axios.post(fbUrl, {
      recipient: { id: recipientId },
      message: { text: text },
      tag: 'HUMAN_AGENT'
    });

    // 5. Save to Supabase (Only if FB succeeds)
    await supabaseAdmin.from('messages').insert({
      conversation_id: conversationId,
      sender_id: 'me',
      message_text: text,
      is_from_me: true
    });

    return { success: true };

  } catch (error: any) {
    console.error("SendMessage Failure:", error);

    // EXTRACT THE REAL FACEBOOK ERROR
    if (axios.isAxiosError(error) && error.response) {
      const fbError = error.response.data?.error;
      return { 
        success: false, 
        error: `Facebook Error: ${fbError.message} (Code: ${fbError.code})` 
      };
    }

    return { success: false, error: error.message || 'Unknown Server Error' };
  }
}