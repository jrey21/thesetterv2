'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { sendMessage, refreshContactInfo } from '@/app/actions';
import { useParams } from 'next/navigation';
import { 
    Phone, Video, Paperclip, Mic, Send, 
    MoreHorizontal, Bell, Info, Clock, MapPin, CheckCircle
} from 'lucide-react';

export default function ChatPage() {
  const params = useParams(); 
  const chatId = params?.chatId as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [chatInfo, setChatInfo] = useState<any>(null);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // 1. Load Data & Subscribe to Realtime Updates
  useEffect(() => {
    if (!chatId) return;

    // A. Get Chat Details (Name, Pic, Bio)
    supabase.from('conversations').select('*').eq('id', chatId).single().then(({ data }) => {
      if (data) {
          setChatInfo(data);
          // If name is missing, try to fetch it from Instagram
          if (!data.username) refreshContactInfo(data.instagram_user_id); 
      }
    });

    // B. Get Existing Messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', chatId)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };
    fetchMessages();

    // C. REALTIME LISTENER (Handles incoming messages from THEM)
    const channel = supabase.channel(`room_${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${chatId}` }, 
        (payload) => {
            const newMessage = payload.new;
            // Only add if it's NOT from me (or if I don't have it yet)
            setMessages(prev => {
                if (prev.find(m => m.id === newMessage.id)) return prev; 
                return [...prev, newMessage];
            });
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  // Scroll to bottom
  useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // 2. The "Safe" Handle Send Function
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;
    const txt = input;
    const tempId = Date.now().toString(); // Temporary ID for optimistic update

    // A. Clear Input & Show Message IMMEDIATELY (Optimistic UI)
    setInput(''); 
    setMessages(prev => [...prev, {
        id: tempId,
        message_text: txt,
        is_from_me: true,
        created_at: new Date().toISOString()
    }]);

    // B. Send to Server (and handle potential failure)
    try {
        const result = await sendMessage(chatId, txt);

        // If the server says "Failed", show the error and remove the message
        if (!result || !result.success) {
            console.error("Server reported error:", result?.error);
            alert(`Message Failed: ${result?.error || 'Unknown Error'}`);
            setMessages(prev => prev.filter(m => m.id !== tempId)); // Rollback
        }
    } catch (error: any) {
        console.error("Critical Send Error:", error);
        alert("Critical Error: Failed to reach server.");
        setMessages(prev => prev.filter(m => m.id !== tempId)); // Rollback
    }
  };

  if (!chatId) return <div className="p-10 flex items-center justify-center text-gray-500">Loading chat...</div>;

  return (
    <>
    {/* MIDDLE COLUMN: Chat Area */}
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] border-r border-gray-200">
      
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
           <img 
            src={chatInfo?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100" 
            alt="Profile"
           />
           <div>
             <h2 className="font-bold text-gray-900 text-sm">{chatInfo?.username || "Loading..."}</h2>
             <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500 font-medium">Active now</span>
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
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.is_from_me ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
            <div className={`flex flex-col max-w-[70%] ${m.is_from_me ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                    m.is_from_me 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                    {m.message_text}
                </div>
                {/* Time Stamp */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Sending...'}
                    </span>
                    {m.is_from_me && <CheckCircle size={10} className="text-blue-600" />}
                </div>
            </div>
          </div>
        ))}
        <div ref={msgsEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 bg-white rounded-xl px-2 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 shadow-sm transition-all">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><Paperclip size={20} /></button>
            <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 h-9 text-sm" 
                placeholder="Write a message..." 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"><Mic size={20} /></button>
            <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className={`p-2 rounded-lg transition-all ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN: Client Info Panel */}
    <div className="w-[300px] bg-white flex flex-col flex-shrink-0 border-l border-gray-200 h-full overflow-y-auto">
        <div className="p-6 flex flex-col items-center border-b border-gray-100 pb-6">
            <div className="relative">
                <img 
                    src={chatInfo?.profile_pic_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 mb-3 shadow-sm"
                    alt="Profile Large" 
                />
                <div className="absolute bottom-3 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{chatInfo?.username || "Unknown User"}</h2>
            <p className="text-sm text-gray-500 mb-4">Instagram Lead</p>
            
            <div className="flex gap-2 w-full">
                <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 border border-gray-200">View Profile</button>
                <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><Bell size={18}/></button>
            </div>
        </div>

        <div className="p-5 space-y-6">
            <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h4>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {chatInfo?.bio || <span className="italic text-gray-400">No biography available.</span>}
                </div>
            </div>
            <div>
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Details</h4>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Info size={16} className="text-gray-400"/>
                        <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-500">ID: {chatInfo?.instagram_user_id?.slice(0,8)}...</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400"/>
                        <span>Location: Unknown</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400"/>
                        <span>Local Time: {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                 </div>
            </div>
        </div>
    </div>
    </>
  );
}