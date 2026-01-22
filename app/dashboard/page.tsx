'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { sendMessage } from '../actions';

export default function Dashboard() {
  interface Chat {
    id: string;
    instagram_user_id: string;
    last_message_at?: string;
    // Add other fields as needed based on your 'conversations' table
  }
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  interface Message {
    id: string;
    conversation_id: string;
    is_from_me: boolean;
    message_text: string;
    created_at?: string;
    // Add other fields as needed based on your 'messages' table
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // 1. Load Conversations
  useEffect(() => {
    supabase.from('conversations').select('*').order('last_message_at', { ascending: false })
      .then(({ data }) => setChats(data || []));
      
    // Realtime for Sidebar
    const channel = supabase.channel('dashboard_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, 
        () => { /* Re-fetch chats logic here */ })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. Load Messages when Chat Selected
  useEffect(() => {
    if (!activeChat) return;
    
    supabase.from('messages').select('*').eq('conversation_id', activeChat).order('created_at')
      .then(({ data }) => setMessages(data || []));

    // Realtime for Messages
    const channel = supabase.channel(`chat_${activeChat}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChat}` }, 
        (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!activeChat || !input.trim()) return;
    const txt = input;
    setInput(''); // Optimistic clear
    await sendMessage(activeChat, txt);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        {chats.map(chat => (
          <div key={chat.id} onClick={() => setActiveChat(chat.id)} 
               className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? 'bg-blue-50' : ''}`}>
            <div className="font-bold">User {chat.instagram_user_id.slice(0,5)}...</div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map(m => (
            <div key={m.id} className={`mb-2 flex ${m.is_from_me ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded max-w-xs ${m.is_from_me ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {m.message_text}
              </div>
            </div>
          ))}
          <div ref={msgsEndRef} />
        </div>
        <div className="p-4 bg-white border-t flex gap-2">
          <input className="flex-1 border p-2 rounded" value={input} 
                 onChange={e => setInput(e.target.value)} 
                 onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}