'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { sendMessage, refreshContactInfo } from '@/app/actions';
import { 
    Phone, Video,Paperclip, Mic, Send, 
    MoreHorizontal, Bell, Info, Clock, MapPin
} from 'lucide-react';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;
  interface Message {
    id: string;
    conversation_id: string;
    created_at: string;
    is_from_me: boolean;
    message_text: string;
    // add other fields as needed
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  type ChatInfo = {
    id: string;
    username?: string;
    profile_pic_url?: string;
    instagram_user_id?: string;
    bio?: string;
    // add other fields as needed
  };
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // Load Data
  useEffect(() => {
    // 1. Get Chat Details
    supabase.from('conversations').select('*').eq('id', chatId).single().then(({ data }) => {
      setChatInfo(data);
      if (data && !data.username) refreshContactInfo(data.instagram_user_id); 
    });

    // 2. Get Messages
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', chatId).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    // 3. Realtime Listener
    const channel = supabase.channel(`room_${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${chatId}` }, 
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  // Scroll to bottom
  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    await sendMessage(chatId, txt);
  };

  return (
    <>
    {/* MIDDLE COLUMN: Chat Area */}
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 border-r border-gray-200">
      
      {/* Chat Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
           <img src={chatInfo?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
           <div>
             <h2 className="font-bold text-gray-900 text-sm">{chatInfo?.username || "Loading..."}</h2>
             <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">Active now</span>
             </div>
           </div>
        </div>
        <div className="flex gap-1">
             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Phone size={18}/></button>
             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Video size={18}/></button>
             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><MoreHorizontal size={18}/></button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_from_me ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex flex-col max-w-[70%] ${m.is_from_me ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    m.is_from_me 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                    {m.message_text}
                </div>
                {/* Time Stamp */}
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
            </div>
          </div>
        ))}
        <div ref={msgsEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 shadow-sm">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><Paperclip size={20} /></button>
            <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 h-9 text-sm" 
                placeholder="Write a message..." 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><Mic size={20} /></button>
            <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Send size={18} /></button>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN: Client Info Panel (300px) */}
    <div className="w-[300px] bg-white flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-6 flex flex-col items-center border-b border-gray-100 pb-6">
            <img src={chatInfo?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 mb-3" />
            <h2 className="font-bold text-gray-900 text-lg">{chatInfo?.username || "Unknown"}</h2>
            <p className="text-sm text-gray-500 mb-4">Instagram User</p>
            
            <div className="flex gap-2 w-full">
                <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">View Profile</button>
                <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><Bell size={18}/></button>
            </div>
        </div>

        <div className="p-5 space-y-6">
            {/* Bio Section */}
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {chatInfo?.bio || "No biography available."}
                </p>
            </div>

            {/* Details */}
            <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Details</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Info size={16} className="text-gray-400"/>
                        <span>User ID: {chatInfo?.instagram_user_id?.slice(0,6)}...</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400"/>
                        <span>Location: Unknown</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400"/>
                        <span>Local Time: 12:30 PM</span>
                    </div>
                 </div>
            </div>

             {/* Tags */}
             <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">New Lead</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">Instagram</span>
                </div>
             </div>
        </div>
    </div>
    </>
  );
}