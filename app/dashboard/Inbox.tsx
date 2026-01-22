import React from "react";
import { statusColorIcons } from "../components/icons/status-colors";
import InfoIcon from "../components/icons/Info.svg";
import HiddenIcon from "../components/icons/Hidden.svg";
import WorldIcon from "../components/icons/World.svg";
import CalendarTab from "../components/icons/CalendarTab.svg";
import Video from "../components/icons/Video.svg";
import FanbasisIcon from "../components/icons/PaymentIcons/Fanbasis.svg";
import WhopIcon from "../components/icons/PaymentIcons/Whop.svg";
import StripeIcon from "../components/icons/PaymentIcons/Stripe.svg";
import PayPalIcon from "../components/icons/PaymentIcons/PayPal.svg";
import ZelleIcon from "../components/icons/PaymentIcons/Zelle.svg";
import WireIcon from "../components/icons/PaymentIcons/Wire.svg";
import VenmoIcon from "../components/icons/PaymentIcons/Venmo.svg";
import CashAppIcon from "../components/icons/PaymentIcons/CashApp.svg";
import CryptoIcon from "../components/icons/PaymentIcons/Crypto.svg";
import OtherIcon from "../components/icons/PaymentIcons/Other.svg";
import NewLeadIcon from "../components/icons/timeline-status/NewLead.svg";
import InContactIcon from "../components/icons/timeline-status/InContact.svg";
import WonIcon from "../components/icons/timeline-status/Won.svg";

// --- 1. Mock Data ---

const users = [
  {
    id: 1,
    name: "@christiano",
    time: "Just now",
    lastMessage: "yo bro where to I pay you I'm in...",
    status: "Retarget",
    statusColor: "text-blue-500 border-blue-200 bg-white",
    icon: "loop",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    verified: true,
    unread: 1,
  },
  {
    id: 2,
    name: "@mrbeast",
    time: "30 sec",
    lastMessage: "I'm totally broke dude they don...",
    status: "Unqualified",
    statusColor: "text-red-500 border-red-200 bg-white",
    icon: "x",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    verified: true,
    unread: 3,
  },
  {
    id: 3,
    name: "@drinkprime",
    time: "1 min",
    lastMessage: "excited to work together LET'S...",
    status: "Won",
    statusColor: "text-green-600 border-green-200 bg-white",
    icon: "dollar",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    verified: true,
    unread: 7,
  },
  {
    id: 4,
    name: "@benheathmarketing",
    time: "2 min",
    lastMessage: "dude your creatives are so goo...",
    status: "New Lead",
    statusColor: "text-pink-500 border-pink-200 bg-white",
    icon: "user",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    verified: true,
    unread: 1,
  },
  {
    id: 5,
    name: "@danieldalen",
    time: "5 min",
    lastMessage: "Media Message",
    status: "Qualified",
    statusColor: "text-yellow-500 border-yellow-200 bg-white",
    icon: "star",
    avatar: null,
    verified: true,
    isActive: true,
  },
  {
    id: 6,
    name: "@hormozi",
    time: "6 min",
    lastMessage: "Voice Message",
    status: "Booked",
    statusColor: "text-purple-600 border-purple-200 bg-white",
    icon: "phone",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    verified: true,
    unread: 3,
  },
  {
    id: 7,
    name: "@jeffbezos",
    time: "9 min",
    lastMessage: "Interested in using Setter for o...",
    status: "No-Show",
    statusColor: "text-orange-500 border-orange-200 bg-white",
    icon: "x",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    verified: true,
    unread: 1,
  },
  {
    id: 8,
    name: "@miketyson",
    time: "14 min",
    lastMessage: "BUY BUY BUY BUY BUY BUY",
    status: "In-Contact",
    statusColor: "text-green-500 border-green-200 bg-white",
    icon: "message",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    verified: true,
    unread: 1,
  },
];

type Message = {
  id: number;
  fromMe: boolean;
  type: string;
  text?: string;
  duration?: string;
  status?: string;
};

const userConversations: Record<number, Message[]> = {
  1: [
    { id: 1, fromMe: true, type: "text", text: "Hey Christiano! Ready to pay?" },
    {
      id: 2,
      fromMe: false,
      type: "text",
      text: "yo bro where do I pay you I'm in...",
    },
    { id: 3, fromMe: true, type: "text", text: "I'll send you the link!" },
  ],
  2: [
    {
      id: 1,
      fromMe: false,
      type: "text",
      text: "I'm totally broke dude they don...",
    },
    { id: 2, fromMe: true, type: "text", text: "Haha, no worries!" },
    { id: 3, fromMe: false, type: "text", text: "Maybe next month!" },
  ],
  3: [
    { id: 1, fromMe: true, type: "text", text: "excited to work together LET'S..." },
    { id: 2, fromMe: false, type: "text", text: "Same here! Let's get started." },
  ],
  4: [
    { id: 1, fromMe: false, type: "text", text: "dude your creatives are so good!" },
    { id: 2, fromMe: true, type: "text", text: "Thanks Ben!" },
  ],
  5: [
    { id: 1, fromMe: true, type: "text", text: "I have a few time slots available to" },
    {
      id: 2,
      fromMe: false,
      type: "text",
      text: "Yes I booked in but i still have some questions about where the call will be and stuff",
    },
    { id: 3, fromMe: true, type: "text", text: "sure when questions do you have" },
    {
      id: 4,
      fromMe: false,
      type: "text",
      text: "can you explain how the payments work like how do I pay and how much is it",
    },
    {
      id: 5,
      fromMe: true,
      type: "text",
      text: "price depends on how much help you need and where you are in your journye. some people need hours on hours a",
    },
    {
      id: 6,
      fromMe: false,
      type: "text",
      text: "can you explain how the payments work like how do I pay and how much is it",
    },
    { id: 7, fromMe: true, type: "audio", duration: "0:05" },
    { id: 8, fromMe: false, type: "text", text: "oh that makes perfect sense" },
    { id: 9, fromMe: false, type: "audio", duration: "1:14" },
    { id: 10, fromMe: true, type: "text", text: "yes we have payment plans" },
    {
      id: 11,
      fromMe: false,
      type: "text",
      text: "amazing yeah at that price point i'll need to split it up into at least 2 payments if not 4 or 6 but I want to do it no matter what so lets run it regardless I have been watching you for years its finally time to make it happen and I am finally at a good point in my life",
    },
    { id: 12, fromMe: true, type: "audio", duration: "2:10", status: "Read" },
  ],
  6: [
    { id: 1, fromMe: false, type: "text", text: "Voice Message" },
    { id: 2, fromMe: true, type: "audio", duration: "0:30" },
    { id: 3, fromMe: false, type: "text", text: "Thanks for the reply!" },
  ],
  7: [
    { id: 1, fromMe: false, type: "text", text: "Interested in using Setter for o..." },
    { id: 2, fromMe: true, type: "text", text: "Let's chat, Jeff!" },
  ],
  8: [
    { id: 1, fromMe: true, type: "text", text: "BUY BUY BUY BUY BUY BUY" },
    { id: 2, fromMe: false, type: "text", text: "Haha, Mike!" },
  ],
};

// --- 2. Icons ---

const Icon = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "filter":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      );
    case "search":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case "loop":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      );
    case "dollar":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "star":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      );
    case "copy":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
        </svg>
      );
    case "play":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
        </svg>
      );
    case "eye":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "phone":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
        </svg>
      );
    case "message":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
        </svg>
      );
    case "user":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      );
    case "x":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case "folder-move":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h5.25m0 0L15 9.75m2.25 2.25L15 14.25M3.75 6A2.25 2.25 0 016 3.75h2.625a1.5 1.5 0 011.06.44l1.125 1.125a1.5 1.5 0 001.06.44h4.125A2.25 2.25 0 0118.25 7.875v10.5a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
      );
      
    case "verified":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-500">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

// --- AudioWave Component ---
const AudioWave = ({ color }: { color: string }) => {
  const heights = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return [...Array(20)].map(() => Math.random() * 100);
  }, []);

  return (
    <div className="flex items-center space-x-0.5 h-4 mx-2">
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-0.5 rounded-full ${color}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

// --- New Components for Audio ---

const VolumeIconSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
  </svg>
);

const EyeOffIcon = () => (
  <div className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200">
    <img src={HiddenIcon} alt="Hidden" className="w-4 h-4" />
  </div>
);

// --- Sub-Components for Details Tabs ---

const NotesTab = () => {
  const [notes, setNotes] = React.useState("Guy said he wants to become a astronaut I guess");
  return (
    <div className="p-6">
      <div className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white h-64">
        <textarea
          className="text-gray-700 font-bold text-sm w-full h-full resize-none outline-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

const TimelineTab = () => {
  const events = [
    {
      id: 1,
      title: "New Lead",
      sub: "Ready to contact",
      date: "Dec 30",
      icon: <img src={NewLeadIcon} alt="New Lead" className="w-5 h-5" />,
      bg: "bg-[#F89EE3]",
    },
    {
      id: 2,
      title: "Qualified",
      sub: "Lead is qualified",
      date: "Jan 6",
      icon: <Icon name="star" className="w-5 h-5 text-white" />,
      bg: "bg-[#FFC300]",
    },
    {
      id: 3,
      title: "Call Booked",
      sub: "Lead booked a call",
      date: "Jan 7",
      icon: <Icon name="phone" className="w-5 h-5 text-white" />,
      bg: "bg-[#501884]",
    },
    {
      id: 4,
      title: "In-Contact",
      sub: "Speaking over WhatsApp",
      date: "Jan 10",
      icon: <img src={InContactIcon} alt="In-Contact" className="w-5 h-5" />,
      bg: "bg-[#25D366]",
    },
    {
      id: 5,
      title: "Won",
      sub: "Lead has paid",
      date: "Just Now",
      icon: <img src={WonIcon} alt="Won" className="w-5 h-5" />,
      bg: "bg-[#059700]",
    },
  ];

  return (
    <div className="p-6 max-h-96 overflow-y-auto">
      <div className="flex flex-col">
        {events.map((e, idx) => (
          <div key={e.id} className="flex gap-x-4">
            {/* Left Column: Icon + Vertical Line */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center z-10 ${e.bg}`}>
                {e.icon}
              </div>
              {/* Connecting Line (Solid) - Hidden for the last item */}
              {idx !== events.length - 1 && (
                <div className="flex-1 w-px border-l-2 border-solid border-gray-200 my-2"></div>
              )}
            </div>
            {/* Right Column: Content */}
            <div className={`flex-1 pt-1 ${idx !== events.length - 1 ? "pb-8" : ""}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{e.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{e.sub}</div>
                </div>
                <span className="text-xs text-gray-400 text-right min-w-[60px]">{e.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const PaymentMethodDropdown = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const methods = [
    { name: "Fanbasis", icon: FanbasisIcon},
    { name: "Whop", icon: WhopIcon },
    { name: "Stripe", icon: StripeIcon },
    { name: "PayPal", icon: PayPalIcon },
    { name: "Zelle", icon: ZelleIcon },
    { name: "Wire/Invoice", icon: WireIcon },
    { name: "Venmo", icon: VenmoIcon },
    { name: "Cash App", icon: CashAppIcon },
    { name: "Crypto", icon: CryptoIcon },
    { name: "Other", icon: OtherIcon },
  ];

  const selectedMethod = methods.find((m) => m.name === value) || methods[0];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm font-medium text-gray-900 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] mr-2">
            <img src={selectedMethod.icon} alt={selectedMethod.name} className="w-4 h-4" />
          </span>
          {selectedMethod.name}
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
          {methods.map((method) => (
            <div
              key={method.name}
              className="flex items-center justify-between p-2.5 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(method.name);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] mr-2">
                  <img src={method.icon} alt={method.name} className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-gray-900">{method.name}</span>
              </div>
              {value === method.name ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-5 h-5 rounded-full border border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsTab = () => {
  const [amount, setAmount] = React.useState("$4,000 USD");
  const [paymentMethod, setPaymentMethod] = React.useState("Fanbasis");
  const [setterPaid, setSetterPaid] = React.useState("Yes");
  const [closerPaid, setCloserPaid] = React.useState("No");
  const [paymentNotes, setPaymentNotes] = React.useState("Guy wants to work 1 on 1 on his fitness offer");

  return (
    <div className="p-6 overflow-y-auto pb-20">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Amount</label>
          <input
            className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm font-medium text-gray-900 w-full outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Payment Method</label>
          <PaymentMethodDropdown value={paymentMethod} onChange={setPaymentMethod} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Pay Option</label>
          <div className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-800 flex items-center justify-between">
            6 Installments
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Payment Frequency</label>
          <div className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-800 flex items-center justify-between">
            One Time
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Setter Commission</label>
          <div className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-400">$200</div>
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Closer Commission</label>
          <div className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-400">$400</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Setter Paid</label>
          <div className="relative">
            <select
              className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-800 w-full appearance-none outline-none"
              value={setterPaid}
              onChange={(e) => setSetterPaid(e.target.value)}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <svg
              className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="col-span-1">
          <label className="text-xs text-gray-500 font-medium mb-1 block">Closer Paid</label>
          <div className="relative">
            <select
              className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-800 w-full appearance-none outline-none"
              value={closerPaid}
              onChange={(e) => setCloserPaid(e.target.value)}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <svg
              className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 font-medium mb-1 block">Payment notes</label>
        <textarea
          className="border border-gray-200 rounded-lg p-2.5 bg-white text-sm text-gray-800 h-32 w-full resize-none outline-none"
          value={paymentNotes}
          onChange={(e) => setPaymentNotes(e.target.value)}
        />
      </div>
    </div>
  );
};

const CallsTab = () => {
  const calls = [
    { date: "12:00 - 12:45, Monday, January 15, 2026", tz: "Asia/Yerevan", platform: "Zoom" },
    { date: "9:00 - 9:45, Monday, January 19, 2026", tz: "Asia/Yerevan", platform: "Zoom" },
    { date: "7:00 - 7:45, Monday, January 20, 2026", tz: "Asia/Yerevan", platform: "Zoom" },
  ];

  return (
    <div className="p-6 bg-gray-50 space-y-4 h-full overflow-y-auto">
      {calls.map((c, i) => (
        <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm relative">
          <h4 className="font-bold text-gray-800 text-sm mb-3">Apply to Work 1-on-1 With Us</h4>

          <div className="flex items-center text-sm text-gray-600 mb-2">
           <img src={CalendarTab} alt="Calendar" className="w-5 h-5 mr-3" style={{ strokeWidth: .5 }} />
            {c.date}
          </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
                <img src={WorldIcon} alt="World" className="w-5 h-5 mr-3" style={{ strokeWidth: .5 }} />
              {c.tz}
            </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <img src={Video} alt="Video" className="w-5 h-5 mr-3" style={{ strokeWidth: .5 }} />
            {c.platform}
          </div>

          <div className="flex justify-end">
            <button className="bg-[#8771FF] text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#7660EE]">Join Now</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SummaryTab = () => (
  <div className="flex-1 overflow-y-auto p-6 bg-white">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <img src={InfoIcon} alt="Info" className="w-6 h-5 mr-2" />
        <p className="text-xs text-gray-500 font-medium">Summary is generated by using info in this chat.</p>
      </div>
      <button className="ml-2 text-[10px] font-bold bg-[#9ca3af] text-white px-3 py-1 rounded-full">Summarize</button>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-xs leading-relaxed">
      <p className="font-bold text-gray-900 text-sm mb-3">Client Snapshot</p>

      <ul className="space-y-3 pl-1 text-gray-600">
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Profile:</span> 5'6", 168 lbs | Goal: 145–150 lbs (strong, toned)
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Pain Points:</span> Last 15 lbs post-baby | Inconsistent workouts (work + toddler chaos) | Overwhelmed by
            generic plans | Low confidence (skips photos/beach)
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Availability:</span> 30–45 min sessions, 4×/week evenings
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Budget:</span> $300–450/mo
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Big Motivator:</span> June Mexico anniversary trip — wants bikini-ready
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Preferences:</span> Loves custom macros + weekly accountability
          </span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Open to:</span> 12-week 1:1 coaching
          </span>
        </li>
      </ul>

      <div className="my-5"></div>

      <p className="font-bold text-gray-900 text-sm mb-3">Action Plan</p>
      <ul className="space-y-3 pl-1 text-gray-600">
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>Send proposal tonight: 12-week program @ $349/mo (custom workouts/nutrition, unlimited DMs)</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>Follow up tomorrow evening (voice call or DM) to close</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-gray-300 text-[8px] mt-1.5">●</span>
          <span>
            <span className="font-bold text-gray-800">Goal:</span> Onboard by end of week
          </span>
        </li>
      </ul>
    </div>
  </div>
);

// --- 3. Main Component ---

const Inbox = () => {
  const [showVisible, setShowVisible] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState(users.find((u) => u.isActive)?.id || users[0].id);
  const [activeTab, setActiveTab] = React.useState<"all" | "priority" | "unread">("all");

  // New State for Right Panel Tabs
  const [detailsTab, setDetailsTab] = React.useState<"Summary" | "Notes" | "Timeline" | "Payments" | "Calls">("Summary");

  // Dynamic counts
  const allCount = users.length;
  const priorityCount = users.filter((u) => u.status === "Qualified" || u.status === "Priority").length;
  const unreadCount = users.filter((u) => (u.unread ?? 0) > 0).length;

  // Filter users by tab
  let tabUsers = users;
  if (activeTab === "priority") {
    tabUsers = users.filter((u) => u.status === "Qualified" || u.status === "Priority");
  } else if (activeTab === "unread") {
    tabUsers = users.filter((u) => (u.unread ?? 0) > 0);
  }
  const filteredUsers = tabUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || (u.lastMessage && u.lastMessage.toLowerCase().includes(search.toLowerCase())));
  const selectedUser = users.find((u) => u.id === selectedUserId);
  const chatHistory = userConversations[selectedUserId] || [];

  // Handler for actions
  const handleAction = (action: "priority" | "unread" | "delete") => {
    alert(`Moved to ${action}`);
  };

  const getTabButtonClass = (tabName: string) => {
    const isActive = detailsTab === tabName;
    return isActive ? "px-5 py-1.5 bg-[#8771FF] text-white rounded-full shadow-md text-xs font-semibold" : "hover:text-gray-800 text-xs";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden ml-5">
      {/* --- Sidebar (Left) --- */}
      <aside className="w-[380px] border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div className="p-4 pb-2">
          <h2 className="text-xl font-bold mb-1 text-gray-800">Inbox</h2>
          <p className="text-xs text-gray-400 mb-4">Your unified chat workspace.</p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-4 w-4 text-gray-400" />
              </span>
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-100 bg-white text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 shadow-sm"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 flex items-center">
              <Icon name="filter" className="w-4 h-4 mr-1.5" />
              Filters
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#8771FF] text-[10px] text-white">1</span>
            </button>
          </div>

          <div className="flex space-x-2 text-xs font-semibold pb-2">
            <button className={`px-3 py-1.5 rounded-full ${activeTab === "all" ? "bg-[#8771FF] text-white" : "text-gray-500 hover:bg-gray-100"}`} onClick={() => setActiveTab("all")}>
              All [{allCount}]
            </button>
            <button className={`px-3 py-1.5 rounded-full ${activeTab === "priority" ? "bg-[#8771FF] text-white" : "text-gray-500 hover:bg-gray-100"}`} onClick={() => setActiveTab("priority")}>
              Priority [{priorityCount}]
            </button>
            <button className={`px-3 py-1.5 rounded-full ${activeTab === "unread" ? "bg-[#8771FF] text-white" : "text-gray-500 hover:bg-gray-100"}`} onClick={() => setActiveTab("unread")}>
              Unread [{unreadCount}]
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className={`group flex items-center px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 relative ${selectedUserId === u.id ? "bg-blue-50/50" : ""}`}
              onClick={() => setSelectedUserId(u.id)}
            >
              <div className="relative flex-shrink-0">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center text-white font-bold text-xs">●</div>
                )}
                {(u.unread ?? 0) > 0 && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8771FF] text-[10px] font-bold text-white border-2 border-white">
                    {u.unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 ml-3 mr-2">
                <div className="flex items-center mb-0.5">
                  <span className="font-bold text-sm text-gray-900 truncate">{u.name}</span>
                  {u.verified && (
                    <span className="ml-1">
                      <Icon name="verified" />
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">{u.time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">{u.lastMessage}</div>
              </div>

              <div className="flex-shrink-0">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-bold border ${u.statusColor}`}>
                  {statusColorIcons[u.status as keyof typeof statusColorIcons] && <img src={statusColorIcons[u.status as keyof typeof statusColorIcons]} alt={u.status} className="w-4 h-4" />}
                  <span>{u.status}</span>
                </div>
              </div>

              {/* Floating Action Icons (show on hover) */}
              <div
                className="absolute top-1.5 right-2 flex flex-row gap-1 bg-[#2B2640] rounded-lg px-1.5 py-1 shadow-lg border border-dashed border-blue-400 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-10"
                style={{ minWidth: 60 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Priority */}
                <button className="flex flex-col items-center group/act" onClick={() => handleAction("priority")} tabIndex={-1}>
                  <Icon name="star" className="w-4 h-4 text-gray-700 group-hover/act:text-yellow-400" />
                  <span className="mb-1 text-[8px] text-gray-300 bg-black bg-opacity-80 rounded px-0.5 py-0.5 opacity-0 group-hover/act:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    Mark as qualified
                  </span>
                </button>
                {/* Delete */}
                <button className="flex flex-col items-center group/act" onClick={() => handleAction("delete")} tabIndex={-1}>
                  <Icon name="x" className="w-4 h-4 text-gray-700 group-hover/act:text-red-500" />
                  <span className="mb-1 text-[8px] text-gray-300 bg-black bg-opacity-80 rounded px-0.5 py-0.5 opacity-0 group-hover/act:opacity-100 transition-opacity absolute -top-5 left-1 -translate-x-1/2 whitespace-nowrap">
                    Unqualify and remove user from inbox
                  </span>
                </button>
                {/* Unread */}
                <button className="flex flex-col items-center group/act" onClick={() => handleAction("unread")} tabIndex={-1}>
                  <Icon name="folder-move" className="w-4 h-4 text-gray-700 group-hover/act:text-yellow-400" />
                  <span className="mb-1 text-[8px] text-gray-300 bg-black bg-opacity-80 rounded px-0.5 py-0.5 opacity-0 group-hover/act:opacity-100 transition-opacity absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  Move to priority inbox
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* --- Main Chat Area (Middle) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-200">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center">
            {selectedUser?.avatar ? (
              <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover mr-3" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 mr-3 flex items-center justify-center text-white font-bold text-xs">●</div>
            )}
            <div>
              <div className="font-bold text-sm text-gray-900">{selectedUser?.name?.replace("@", "") || ""}</div>
              <div className="text-xs text-gray-400">{selectedUser?.name || ""}</div>
            </div>
          </div>
          <div className="flex items-center">
            <button onClick={() => setShowVisible((v) => !v)} className="mr-4 focus:outline-none">
              {showVisible ? (
                <div className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200">
                  <Icon name="eye" className="w-4 h-4 text-gray-500" />
                </div>
              ) : (
                <EyeOffIcon />
              )}
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-2 bg-white scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.fromMe ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.fromMe ? "bg-[#8771FF] text-white rounded-br-none shadow-sm" : "bg-[#F0F2F6] text-gray-800 rounded-bl-none"} ${
                  msg.type === "audio" ? "flex items-center min-w-[240px]" : ""
                }`}
              >
                {msg.type === "text" ? (
                  <span>{msg.text}</span>
                ) : (
                  <>
                    {/* Play Button */}
                    <button className={`p-2 rounded-full flex-shrink-0 flex items-center justify-center ${msg.fromMe ? "bg-white text-[#8771FF]" : "bg-gray-500 text-white"}`}>
                      <Icon name="play" className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* Audio Wave */}
                    <AudioWave color={msg.fromMe ? "bg-white" : "bg-gray-400"} />

                    <span className={`text-xs font-mono ml-auto mr-3 ${msg.fromMe ? "text-white/80" : "text-gray-500"}`}>{msg.duration}</span>

                    {/* Volume Icon */}
                    <VolumeIconSvg className={`w-5 h-5 ${msg.fromMe ? "text-white" : "text-gray-400"}`} />
                  </>
                )}
              </div>
              {msg.status === "Read" && <div className="text-[10px] text-gray-400 mt-1 mr-1">Read</div>}
            </div>
          ))}

          {/* Status Update Marker */}
          <div className="flex flex-col items-center py-6">
            <Icon name="star" className="w-6 h-6 text-yellow-400 mb-2" />
            <div className="font-bold text-sm text-gray-800">Status Update: Qualified</div>
            <div className="text-[10px] text-gray-400">Wednesday 9:07 PM</div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white mx-8 mb-4">
          <div className="relative flex items-center border border-gray-200 rounded-lg p-2 shadow-sm">
            <div className="flex space-x-2 mr-2 text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <input className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none" placeholder="Write a message..." />
          </div>
        </div>
      </main>

      {/* --- Details Panel (Right) --- */}
      <aside className="w-[400px] bg-white flex flex-col flex-shrink-0 relative">
        <div className="pt-8 pb-4 px-6 flex flex-col items-center relative">
          {selectedUser?.avatar ? (
            <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover mb-4 shadow-lg shadow-orange-100" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 mb-4 shadow-lg shadow-orange-100 flex items-center justify-center text-white font-bold text-2xl">●</div>
          )}
          <h3 className="font-bold text-xl text-gray-900">{selectedUser?.name?.replace("@", "") || ""}</h3>
          <p className="text-sm text-gray-500 mb-1">{selectedUser?.name || ""}</p>
          <p className="text-sm text-gray-300 mb-5">我知道你知道.</p>

          <button className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 mb-4">
            <Icon name={selectedUser?.icon || "star"} className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-bold text-gray-800">{selectedUser?.status || "Qualified"} - Update</span>
            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="w-full space-y-3">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between p-3 bg-white rounded-t-xl border border-gray-200 border-b-0 group cursor-pointer shadow-sm">
                <span className="text-sm text-gray-400 px-1">Phone Number</span>
                <Icon name="copy" className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-b-xl border border-gray-200 group cursor-pointer shadow-sm">
                <span className="text-sm text-gray-400 px-1">Email</span>
                <Icon name="copy" className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex w-full mt-3 space-x-3">
            <div className="flex-1 p-2 border border-gray-200 rounded-xl flex items-center bg-white shadow-sm">
              <div className="flex flex-col ml-1">
                <div className="text-[10px] text-gray-400 mb-0.5">Setter</div>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/men/8.jpg" className="w-6 h-6 rounded-full mr-2" alt="Setter" />
                  <div className="text-xs font-bold truncate">Caleb Bruiners</div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-2 border border-gray-200 rounded-xl flex items-center bg-white shadow-sm">
              <div className="flex flex-col ml-1">
                <div className="text-[10px] text-gray-400 mb-0.5">Closer</div>
                <div className="flex items-center">
                  <img src="https://randomuser.me/api/portraits/men/9.jpg" className="w-6 h-6 rounded-full mr-2" alt="Setter" />
                  <div className="text-xs font-bold truncate">Andrew James</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* Tabs */}
        <div className="flex items-center justify-around px-2 py-2 border-b border-gray-200 text-sm font-semibold text-gray-500">
          <button onClick={() => setDetailsTab("Summary")} className={getTabButtonClass("Summary")}>
            Summary
          </button>
          <button onClick={() => setDetailsTab("Notes")} className={getTabButtonClass("Notes")}>
            Notes
          </button>
          <button onClick={() => setDetailsTab("Timeline")} className={getTabButtonClass("Timeline")}>
            Timeline
          </button>
          <button onClick={() => setDetailsTab("Payments")} className={getTabButtonClass("Payments")}>
            Payments
          </button>
          <button onClick={() => setDetailsTab("Calls")} className={getTabButtonClass("Calls")}>
            Calls
          </button>
        </div>

        {/* Conditional Content Rendering */}
        <div className="flex-1 bg-white overflow-hidden h-full flex flex-col">
          {detailsTab === "Summary" && <SummaryTab />}
          {detailsTab === "Notes" && <NotesTab />}
          {detailsTab === "Timeline" && <TimelineTab />}
          {detailsTab === "Payments" && <PaymentsTab />}
          {detailsTab === "Calls" && <CallsTab />}
        </div>
      </aside>
    </div>
  );
};

export default Inbox;