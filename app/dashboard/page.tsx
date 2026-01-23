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

  // 2. Load Messages & Fetch Info
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*').eq('conversation_id', activeChat).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase.channel(`chat_${activeChat}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeChat}` }, 
        (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe();
      
    // Fetch Contact Info Logic
    const currentChat = chats.find(c => c.id === activeChat);
    if (currentChat && !currentChat.username && !fetchedUsersRef.current.has(currentChat.instagram_user_id)) {
        fetchedUsersRef.current.add(currentChat.instagram_user_id);
        console.log("Fetching info for:", currentChat.instagram_user_id);
        refreshContactInfo(currentChat.instagram_user_id).then(() => {
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
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* LEFT SIDEBAR */}
      <div className="w-80 border-r flex flex-col bg-gray-50/50">
        <div className="p-5 border-b bg-white">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-2xl text-gray-800 tracking-tight">Inbox</h1>
            <MoreVertical size={20} className="text-gray-400 cursor-pointer hover:text-gray-600"/>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)} 
              className={`p-4 flex gap-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${activeChat === chat.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : ''}`}
            >
              <img
                src={chat.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold truncate ${activeChat === chat.id ? 'text-indigo-900' : 'text-gray-800'}`}>
                    {chat.username || `User ${chat.instagram_user_id.slice(0,4)}...`}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(chat.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className={`text-sm truncate ${activeChat === chat.id ? 'text-indigo-600/70' : 'text-gray-500'}`}>
                    View conversation
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="h-20 border-b flex items-center justify-between px-8 bg-white z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={activeChatDetails?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <div>
                <h2 className="font-bold text-lg text-gray-900 leading-tight">{activeChatDetails?.username || "Unknown User"}</h2>
                <div className="text-xs text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active now
                </div>
              </div>
            </div>
            <div className="flex gap-6 text-gray-400">
                <Phone className="hover:text-indigo-600 cursor-pointer transition-colors" size={20} />
                <Video className="hover:text-indigo-600 cursor-pointer transition-colors" size={20} />
                <Star className="hover:text-yellow-400 cursor-pointer transition-colors" size={20} />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-8 bg-white flex flex-col gap-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex w-full ${m.is_from_me ? 'justify-end' : 'justify-start'} group`}>
                
                {/* Recipient Avatar */}
                {!m.is_from_me && (
                   <div className="flex-shrink-0 mr-3 self-end">
                      <img
                       src={activeChatDetails?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                       alt="Profile"
                       className="w-8 h-8 rounded-full object-cover"
                      />
                   </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={`
                    max-w-[65%] px-5 py-3 text-[15px] leading-relaxed shadow-sm
                    ${m.is_from_me 
                      ? 'bg-indigo-500 text-white rounded-3xl rounded-br-md' 
                      : 'bg-gray-100 text-gray-800 rounded-3xl rounded-bl-md' 
                    }
                  `}
                >
                  {m.message_text}
                </div>
              </div>
            ))}
            <div ref={msgsEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                   <Paperclip size={20} />
                </button>
                
                <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 px-2" 
                    placeholder="Write a message..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                />
                
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Mic size={20} />
                </button>

                <button 
                  onClick={handleSend} 
                  className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow-md transition-transform active:scale-95 flex items-center justify-center"
                >
                    <Send size={18} className="ml-0.5" />
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-gray-300 rounded-full mx-1"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full mx-1"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full mx-1"></div>
            </div>
            <p className="font-medium text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
}