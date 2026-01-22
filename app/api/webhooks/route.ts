import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === process.env.VERIFY_TOKEN) {
    return new NextResponse(searchParams.get('hub.challenge'), { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        // The 'id' in the entry is ALWAYS your Instagram Business Account ID
        const myBusinessId = entry.id; 
        
        const messagingEvents = entry.messaging || entry.standby || [];
        
        for (const event of messagingEvents) {
          if (!event.message) continue;

          const senderId = event.sender.id;
          const recipientId = event.recipient.id;
          const text = event.message.text;
          
          let conversationPartnerId;
          let isFromMe = false;

          // LOGIC: Determine who the "other person" is
          if (senderId === myBusinessId) {
            // Case A: I sent the message (from phone/meta suite)
            conversationPartnerId = recipientId;
            isFromMe = true;
          } else {
            // Case B: The customer sent the message
            conversationPartnerId = senderId;
            isFromMe = false;
          }

          // 1. Find or Create Conversation for the PARTNER (not me)
          const { data: conv, error: convError } = await supabaseAdmin
            .from('conversations')
            .upsert({ 
                instagram_user_id: conversationPartnerId 
            }, { onConflict: 'instagram_user_id' })
            .select()
            .single();
          
          if (convError) {
             console.error('Error upserting conversation:', convError);
             continue;
          }

          // 2. Insert the Message
          if (conv) {
            await supabaseAdmin.from('messages').insert({
              conversation_id: conv.id,
              sender_id: senderId,
              message_text: text || '(Media)',
              is_from_me: isFromMe
            });
          }
        }
      }
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }
    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}