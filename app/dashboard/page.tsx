'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { sendMessage, refreshContactInfo } from '../actions';
import { Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, Star } from 'lucide-react';

// Types
type Chat = {
  id: string;
  instagram_user_id: string;
  username: string | null;
  profile_pic_url: string | null;
  last_message_at: string;
};

type Message = {
  id: string;
  message_text: string;
  is_from_me: boolean;
  created_at: string;
};

export default function Dashboard() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  const msgsEndRef = useRef<HTMLDivElement>(null);
  // SAFETY: This Set remembers who we already tried to fetch, so we don't spam API
  const fetchedUsersRef = useRef<Set<string>>(new Set());

  // 1. Load Conversations
  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase.from('conversations').select('*').order('last_message_at', { ascending: false });
      if (data) setChats(data);
    };

    fetchChats();

    const channel = supabase.channel('dashboard_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchChats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. Load Messages & SAFELY Fetch Profile Info
  useEffect(() => {
    if (!activeChat) return;

    // Fetch messages
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', activeChat).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime listener for new messages
    const channel = supabase.channel(`chat_${activeChat}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChat}` }, 
        (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe();
      
    // SAFETY CHECK: Only fetch info if we haven't tried yet
    const currentChat = chats.find(c => c.id === activeChat);
    if (currentChat && !currentChat.username && !fetchedUsersRef.current.has(currentChat.instagram_user_id)) {
        
        // Mark as fetched immediately to block loops
        fetchedUsersRef.current.add(currentChat.instagram_user_id);
        
        console.log("Fetching info for:", currentChat.instagram_user_id);
        
        refreshContactInfo(currentChat.instagram_user_id).then(() => {
            // Reload chats to show new name
            supabase.from('conversations').select('*').order('last_message_at', { ascending: false })
              .then(({data}) => setChats(data || []));
        });
    }

    return () => { supabase.removeChannel(channel); };
  }, [activeChat, chats]);

  // Scroll to bottom
  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!activeChat || !input.trim()) return;
    const txt = input;
    setInput('');
    await sendMessage(activeChat, txt);
  };

  const activeChatDetails = chats.find(c => c.id === activeChat);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-xl text-gray-800">Inbox</h1>
            <MoreVertical size={20} className="text-gray-600 cursor-pointer"/>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)} 
              className={`p-4 flex gap-3 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-colors ${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
            >
              <Image
                src={chat.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt="Avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
                unoptimized={chat.profile_pic_url?.startsWith('http') ? false : true}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {chat.username || `User ${chat.instagram_user_id.slice(0,4)}...`}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {new Date(chat.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">Click to view chat</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-16 border-b flex items-center justify-between px-6 bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <Image
                src={activeChatDetails?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt={activeChatDetails?.username ? `${activeChatDetails.username}'s profile picture` : "User profile picture"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
                unoptimized={activeChatDetails?.profile_pic_url?.startsWith('http') ? false : true}
              />
              <div>
                <h2 className="font-bold text-gray-800">{activeChatDetails?.username || "Unknown User"}</h2>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active now
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-gray-400">
                <Phone className="hover:text-blue-600 cursor-pointer" size={20} />
                <Video className="hover:text-blue-600 cursor-pointer" size={20} />
                <Star className="hover:text-yellow-400 cursor-pointer" size={20} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.is_from_me ? 'justify-end' : 'justify-start'} group`}>
                {!m.is_from_me && (
                   <Image
                    src={activeChatDetails?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                    alt={activeChatDetails?.username ? `${activeChatDetails.username}'s profile picture` : "User profile picture"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2 self-end mb-1"
                    unoptimized={activeChatDetails?.profile_pic_url?.startsWith('http') ? false : true}
                   />
                )}
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                  m.is_from_me 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {m.message_text}
                </div>
              </div>
            ))}
            <div ref={msgsEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100">
                <Paperclip className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
                <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400" 
                    placeholder="Write a message..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                />
                <Mic className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
                <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                    <Send size={18} />
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}