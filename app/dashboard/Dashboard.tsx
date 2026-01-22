import React from 'react';
import { 
  Search, 
  Bell, 
  DollarSign, 
  Hourglass, 
  Percent, 
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';

// --- Types ---
interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

// --- Components ---

const MetricCard = ({ label, value, subValue, icon }: MetricCardProps) => (
  <div className="bg-[#F6F5FF] p-6 rounded-xl flex flex-col justify-between h-[140px] relative overflow-hidden">
    {/* Header with Icon */}
    <div className="flex justify-between items-start z-10">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#7C3AED] shadow-sm">
        {icon}
      </div>
    </div>
    
    {/* Content */}
    <div className="mt-2 z-10">
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <div className="flex items-center gap-1 text-sm font-medium text-gray-600 mt-1">
         {label}
      </div>
      {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="pt-4 max-w-[1400px] mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi, Kelvin!</h1>
            <p className="text-gray-500 text-sm mt-1">Your Setter Dashboard</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute top-0 right-0.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></div>
              <Bell className="text-purple-400 hover:text-purple-600 cursor-pointer" size={24} />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-all w-64 placeholder-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {/* Segmented Control */}
          <div className="bg-[#F8F9FA] p-1 rounded-lg flex gap-1">
            <button className="px-5 py-1.5 text-sm font-semibold rounded-md bg-[#EDEEF1] text-gray-900 shadow-sm transition-all">
              12 months
            </button>
            {['30 days', '7 days', '24 hours', '60 minutes'].map((range) => (
              <button 
                key={range}
                className="px-5 py-1.5 text-sm font-medium rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                {range}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            All Accounts <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <MetricCard 
            value="$106,673" 
            label="Total revenue" 
            icon={<DollarSign size={20} />} 
          />
          <MetricCard 
            value="2.3 min" 
            label="Avg reply time" 
            icon={<Hourglass size={20} />} 
          />
          <MetricCard 
            value="$978.09" 
            label="Revenue per call" 
            icon={<DollarSign size={20} />} 
          />
          <MetricCard 
            value="82%" 
            label="Conversation rate" 
            icon={<Percent size={20} />} 
          />
          <MetricCard 
            value="97%" 
            label="Avg reply rate" 
            icon={<ArrowUpRight size={20} />} 
          />
        </div>

        {/* Funnel Chart Section */}
        <div className="border border-gray-100 rounded-2xl p-0 overflow-hidden shadow-sm bg-white h-[320px]">
          <div className="relative h-full w-full flex">
            
            {/* Funnel Background Graphic */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pt-16">
               <svg 
                 width="100%" 
                 height="100%" 
                 viewBox="0 0 1000 300" 
                 preserveAspectRatio="none" 
                 className="w-full h-full"
               >
                  <defs>
                    <linearGradient id="funnelGradient" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#8B5CF6" /> {/* Vivid Purple */}
                      <stop offset="100%" stopColor="#E9D5FF" /> {/* Light Lavender */}
                    </linearGradient>
                  </defs>
                  
                  {/* Custom SVG Path to match exact curvature:
                     Starts tall at x=0.
                     Curves gently down to right.
                  */}
                  <path 
                    d="M0,50 
                       C 250,55 500,80 750,115
                       L 1000,125 
                       L 1000,175
                       L 750,185
                       C 500,220 250,245 0,250 
                       Z" 
                    fill="url(#funnelGradient)"
                  />
               </svg>
            </div>

            {/* Data Overlay Grid */}
            <div className="relative z-10 grid grid-cols-5 w-full h-full">
              {/* Columns */}
              {[
                { label: 'Conversations', value: '10,891' },
                { label: 'Qualified', value: '2,390' },
                { label: 'Links Sent', value: '861' },
                { label: 'Booked', value: '246' },
                { label: 'Closed', value: '82' }
              ].map((item, index) => (
                <div key={item.label} className={`flex flex-col pt-8 pl-6 h-full ${index !== 4 ? 'border-r border-gray-100' : ''}`}>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{item.label}</span>
                  <span className="text-3xl font-bold text-[#7C3AED] mt-2">{item.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;