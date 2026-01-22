'use server';

import { supabaseAdmin } from '@/lib/supabase';
import axios from 'axios';

export async function sendMessage(conversationId: string, text: string) {
  // 1. Get Recipient ID
  const { data: conv } = await supabaseAdmin
    .from('conversations')
    .select('instagram_user_id')
    .eq('id', conversationId)
    .single();

  // 2. Get Access Token (Simplification: grabbing the first one. In real app, match to user)
  const { data: acc } = await supabaseAdmin.from('instagram_accounts').select('access_token').limit(1).single();

  if (!conv || !acc) throw new Error('No data');

  // 3. Send to API
  await axios.post(`https://graph.instagram.com/v21.0/me/messages`, {
    recipient: { id: conv.instagram_user_id },
    message: { text: text },
    tag: 'HUMAN_AGENT' // Required to bypass 24h window
  }, { params: { access_token: acc.access_token } });

  // 4. Save to DB (So it shows in our UI)
  await supabaseAdmin.from('messages').insert({
    conversation_id: conversationId,
    sender_id: 'me',
    message_text: text,
    is_from_me: true
  });
}