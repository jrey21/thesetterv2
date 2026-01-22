import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('hub.verify_token') === process.env.VERIFY_TOKEN) {
    return new NextResponse(searchParams.get('hub.challenge'), { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.object === 'instagram') {
    for (const entry of body.entry) {
      // Handle "standby" (messages sent while you are handling another) or "messaging"
      const messagingEvents = entry.messaging || entry.standby || [];
      
      for (const event of messagingEvents) {
        if (!event.message) continue;

        const senderId = event.sender.id;
        const text = event.message.text;
        
        // 1. Find or Create Conversation
        // (In real app, fetch username/pfp from Graph API here if new)
        const { data: conv } = await supabaseAdmin
          .from('conversations')
          .upsert({ instagram_user_id: senderId }, { onConflict: 'instagram_user_id' })
          .select()
          .single();

        // 2. Insert Message
        if (conv) {
          await supabaseAdmin.from('messages').insert({
            conversation_id: conv.id,
            sender_id: senderId,
            message_text: text || '(Media)',
            is_from_me: false // It came from webhook, so it's from them
          });
        }
      }
    }
    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  }
  return new NextResponse('Not Found', { status: 404 });
}