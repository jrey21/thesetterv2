'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Search, Filter, MoreVertical } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  type Chat = {
    id: string;
    profile_pic_url?: string;
    username?: string;
    last_message_at: string;
    // Add other fields as needed
  };

  const [chats, setChats] = useState<Chat[]>([]);
  const params = useParams(); // Highlights the active chat

  // Load Chats
  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase.from('conversations').select('*').order('last_message_at', { ascending: false });
      if (data) setChats(data);
    };

    fetchChats();
    
    // Listen for new messages to update the sidebar order
    const channel = supabase.channel('layout_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchChats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* LEFT SIDEBAR (Inbox) - Fixed width 350px */}
      <div className="w-[350px] border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-xl text-gray-900">Inbox</h1>
            <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <MoreVertical size={20} className="text-gray-400"/>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                  type="text" 
                  placeholder="Search messages" 
                  className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all" 
              />
          </div>

          {/* Filters Row */}
          <div className="flex gap-2 text-sm">
             <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium text-xs">All</button>
             <button className="px-3 py-1 hover:bg-gray-50 text-gray-500 rounded-full font-medium text-xs">Unread</button>
             <button className="px-3 py-1 hover:bg-gray-50 text-gray-500 rounded-full font-medium text-xs">Primary</button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <Link 
              key={chat.id} 
              href={`/dashboard/${chat.id}`} 
              className={`p-4 flex gap-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${params.chatId === chat.id ? 'bg-blue-50/60 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                    src={chat.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {chat.username || "Unknown User"}
                  </h3>
                  <span className="text-[10px] text-gray-400">
                    {new Date(chat.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                   Click to open conversation
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (Chat Window or Empty State) */}
      <div className="flex-1 flex bg-white min-w-0">
        {children}
      </div>
    </div>
  );
}