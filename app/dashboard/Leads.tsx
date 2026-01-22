import {
  Search,
  Trash2,
  CloudDownload,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Minus,
  Check
} from 'lucide-react';
import { statusIcons } from '../components/icons/status';
import MessageCountIcon from '../components/icons/MessageCount.svg';
import { statusColorIcons } from '../components/icons/status-colors';
import CalendarIcon from '../components/icons/headers/Calendar.svg';
import UserIcon from '../components/icons/headers/User.svg';
import UpdatesIcon from '../components/icons/headers/Updates.svg';
import FunnelIcon from '../components/icons/headers/Funnel.svg';
import CoinIcon from '../components/icons/headers/Coin.svg';
import { useState, useEffect, useMemo, useRef } from 'react'; 
import ArrowDownIcon from '../components/icons/ArrowDownIcon';

// --- Types ---
type StatusType = 'Won' | 'Unqualified' | 'Booked' | 'New Lead' | 'Qualified' | 'No-Show' | 'In-Contact' | 'Retarget';

interface Lead {
  id: string;
  name: string;
  handle?: string;
  messageCount?: number;
  status: StatusType;
  cash: string;
  assignedTo: string;
  assignedRole: string; 
  account: string;
  interacted: string;
  selected?: boolean;
}

// New Type for Sorting
type SortConfig = {
  key: keyof Lead;
  direction: 'asc' | 'desc';
} | null;

// --- Mock Data ---
const initialLeadsData: Lead[] = [
  { id: '1', name: 'Brez Scales', handle: '@brez.scales', status: 'Won', cash: '$2,500.00', assignedTo: 'Kelvin Zinck', assignedRole: '(C)', account: '@kelvinzinckclips', interacted: '2 mins ago', selected: true },
  { id: '2', name: 'Iman Gadzhi', handle: '@iman.gadzhi', status: 'Unqualified', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@talkwithkelvin', interacted: '12 mins ago', selected: false },
  { id: '3', name: 'Linda Chen', handle: '@linda.chen', status: 'Booked', cash: 'Pending', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinckshorts', interacted: '2 days ago', selected: true },
  { id: '4', name: 'David Lee', handle: '@david.lee', messageCount: 3, status: 'New Lead', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinck', interacted: '5 seconds ago', selected: false },
  { id: '5', name: 'Emily White', handle: '@emily.white', status: 'Qualified', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinck', interacted: '8 days ago', selected: true },
  { id: '6', name: 'Jessica Wong', handle: '@jessica.wong', status: 'No-Show', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinck', interacted: '36 days ago', selected: true },
  { id: '7', name: 'Kevin Harris', handle: '@kev.harris', messageCount: 6, status: 'In-Contact', cash: 'Pending', assignedTo: 'Kelvin Zinck', assignedRole: '(C)', account: '@kelvinzinckshorts', interacted: '1 month ago', selected: false },
  { id: '8', name: 'Tom Clark', handle: '@thetomclarksr', status: 'Retarget', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinckclips', interacted: '17 hours ago', selected: false },
  { id: '9', name: 'Laura Lewis', handle: '@lauratheboss', status: 'New Lead', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinckclips', interacted: '5 days ago', selected: false },
  { id: '10', name: 'Brian Walker', handle: '@brian.walker', status: 'New Lead', cash: 'N/A', assignedTo: 'Caleb Bruiners', assignedRole: '(S)', account: '@kelvinzinckclips', interacted: '16 minutes ago', selected: true },
];

// --- Helper Components ---

// Badge Styles (Solid Background)
const statusStyles: Record<StatusType, string> = {
  'Won': 'bg-green-600 text-white',
  'Unqualified': 'bg-red-600 text-white',
  'Booked': 'bg-[#5b21b6] text-white',
  'New Lead': 'bg-[#f472b6] text-white',
  'Qualified': 'bg-[#fbbf24] text-white',
  'No-Show': 'bg-[#fb7185] text-white',
  'In-Contact': 'bg-[#22c55e] text-white',
  'Retarget': 'bg-[#2563eb] text-white',
};

// Dropdown Text Styles (Colored Text)
const statusTextStyles: Record<StatusType, string> = {
  'New Lead': 'text-[#f472b6]',
  'Qualified': 'text-[#fbbf24]',
  'Booked': 'text-[#5b21b6]',
  'Retarget': 'text-[#2563eb]',
  'Unqualified': 'text-red-600',
  'No-Show': 'text-[#fb7185]',
  'Won': 'text-green-600',
  'In-Contact': 'text-[#22c55e]',
};

const allStatuses: StatusType[] = [
  'New Lead', 'Qualified', 'Booked', 'Retarget', 'Unqualified', 'No-Show', 'Won', 'In-Contact'
];

const StatusBadge = ({ status }: { status: StatusType }) => {
  const Icon = statusIcons[status];
  const style = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold w-fit shadow-sm ${style}`}>
      <img src={Icon} alt={status + ' icon'} className="w-3 h-3" />
      {status}
    </span>
  );
};

// --- Custom Checkbox Component (Square) ---
const CustomCheckbox = ({ checked, onChange }: { checked: boolean | 'indeterminate'; onChange: () => void }) => {
  return (
    <div
      onClick={onChange}
      className={`w-4 h-4 flex items-center justify-center rounded-[5px] cursor-pointer border transition-all duration-200
        ${checked === 'indeterminate'
          ? 'border-2 border-[#8B5CF6] bg-white'
          : checked
            ? 'bg-[#8B5CF6] border-[#8B5CF6] border-2'
            : 'bg-white border-gray-300 hover:border-gray-400 border-2'}
      `}
    >
      {checked === 'indeterminate' && (
        <Minus size={12} strokeWidth={2} className="text-[#8B5CF6]" />
      )}
      {checked === true && (
        <Check
          size={10}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white mt-[1px] ml-[.5px]"
        />
      )}
    </div>
  );
};

const LeadsPage = () => {
  // Load leads from localStorage if available
  const [leads, setLeads] = useState<Lead[]>(() => {
    const stored = localStorage.getItem('leads-checkbox-state');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialLeadsData;
      }
    }
    return initialLeadsData;
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Status Filter State
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>([]);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Persist leads state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leads-checkbox-state', JSON.stringify(leads));
  }, [leads]);

  // Click Outside Handler for Status Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler for toggling a single lead's checkbox
  const handleCheckboxChange = (id: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, selected: !lead.selected } : lead
      )
    );
  };

  // Handler for toggling all checkboxes
  const handleToggleAll = () => {
    const allSelected = leads.every((lead) => lead.selected);
    setLeads((prevLeads) =>
      prevLeads.map((lead) => ({ ...lead, selected: !allSelected }))
    );
  };

  // Handler for status filtering
  const toggleStatusFilter = (status: StatusType) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  // --- Sorting Logic ---
  const handleSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    // If clicking the same header, toggle direction
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Filter by Status (if any selected)
    if (selectedStatuses.length > 0) {
      result = result.filter(lead => selectedStatuses.includes(lead.status));
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle undefined values
        if (aValue === undefined) aValue = '';
        if (bValue === undefined) bValue = '';

        // Special handling for 'cash' to sort numerically
        if (sortConfig.key === 'cash') {
          const parseCash = (val: string | number | undefined) => {
              const strVal = String(val);
              if (strVal === 'N/A' || strVal === 'Pending') return -1; // Push N/A to bottom
              return parseFloat(strVal.replace(/[^0-9.-]+/g,"")); // Remove $, commas
          }
          
          const aNum = parseCash(aValue as string);
          const bNum = parseCash(bValue as string);
          
          if (aNum < bNum) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aNum > bNum) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }

        // Default String Comparison
        if (String(aValue).toLowerCase() < String(bValue).toLowerCase()) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (String(aValue).toLowerCase() > String(bValue).toLowerCase()) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [leads, sortConfig, selectedStatuses]);

  // Helper to render sort arrow
  const renderSortIcon = (columnKey: keyof Lead) => {
    const isActive = sortConfig?.key === columnKey;
    const isAsc = sortConfig?.direction === 'asc';

    return (
      <ArrowDownIcon 
        style={{ 
          width: 16, 
          height: 16, 
          marginLeft: 2,
          opacity: isActive ? 1 : 0.3, // Dim if not active
          transform: isActive && isAsc ? 'rotate(180deg)' : 'rotate(0deg)', // Rotate if Ascending
          transition: 'transform 0.2s, opacity 0.2s'
        }} 
      />
    );
  };


  // Determine header checkbox state: true, false, or 'indeterminate'
  let headerCheckboxState: boolean | 'indeterminate' = false;
  if (leads.length > 0) {
    const selectedCount = leads.filter(l => l.selected).length;
    if (selectedCount === leads.length) headerCheckboxState = true;
    else if (selectedCount === 0) headerCheckboxState = false;
    else headerCheckboxState = 'indeterminate';
  }

  // Calculate Status Counts for the Dropdown
  const getStatusCount = (status: StatusType) => leads.filter(l => l.status === status).length;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="pt-4 md:pt-6 pl-6 space-y-6">
        
        {/* --- Top Header Row --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          
          {/* Title Section */}
          <div>
            <div className="flex items-center gap-2 ml-10">
              <h1 className="text-xl font-bold text-gray-900">Leads</h1>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{filteredAndSortedLeads.length}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1 ml-10">
              One calendar showing all calls, outcomes, and revenue across your team.
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end mr-10">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-2 py-2 text-sm font-medium">
              <Trash2 size={18} /> Delete
            </button>
            
            {/* Export Button with Cloud Icon */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <CloudDownload size={18} /> Export
            </button>

            {/* Search Input */}
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* --- Filters & Pagination Row --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-10">
          
          {/* Filters (Left) */}
          <div className="flex items-center gap-2 w-full overflow-visible pb-2 lg:pb-0 relative z-10">
            <button className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-900 hover:bg-gray-50 whitespace-nowrap shadow-sm">
              <img src={CalendarIcon} alt="Calendar" className="w-3 h-3 text-gray-500" />
              Last 7 days <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-900 hover:bg-gray-50 whitespace-nowrap shadow-sm">
              <img src={UserIcon} alt="User" className="w-3 h-3 text-gray-500" />
              All Accounts <ChevronDown size={14} className="text-gray-500" />
            </button>
            
            {/* --- MODIFIED: Any Status Button with Dropdown --- */}
            <div className="relative" ref={statusDropdownRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border rounded-lg text-xs font-medium whitespace-nowrap shadow-sm transition-colors
                  ${showStatusDropdown || selectedStatuses.length > 0 
                    ? 'bg-white border-[#8B5CF6] ring-1 ring-[#8B5CF6]' 
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'}`}
              >
                <img src={UpdatesIcon} alt="Updates" className={`w-4 h-4 ${showStatusDropdown || selectedStatuses.length > 0 ? 'text-[#8B5CF6]' : 'text-gray-500'}`} />
                {selectedStatuses.length > 0 ? `${selectedStatuses.length} Statuses` : 'Any Status'} 
                <ChevronDown size={14} className={`${showStatusDropdown || selectedStatuses.length > 0 ? 'text-[#8B5CF6]' : 'text-gray-500'} transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Status Dropdown Menu */}
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="space-y-1">
                    {allStatuses.map((status) => {
                      const isSelected = selectedStatuses.includes(status);
                      const Icon = statusColorIcons[status];
                      return (
                        <div 
                          key={status}
                          onClick={() => toggleStatusFilter(status)}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* Colored Icon */}
                            <img 
                              src={Icon} 
                              alt="" 
                              className="w-4 h-4 opacity-90"
                            />
                            {/* Label */}
                            <span className={`text-sm font-medium ${statusTextStyles[status]}`}>
                              {status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                             {/* Count */}
                             <span className="text-xs text-gray-400 font-medium">
                                {getStatusCount(status)}
                             </span>
                             {/* Radio/Checkbox Circle */}
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                               ${isSelected 
                                 ? 'border-[#8B5CF6] bg-[#8B5CF6]' 
                                 : 'border-gray-300 group-hover:border-gray-400'}`}
                             >
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                             </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* ----------------------------------------------- */}

            <button className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 border border-gray-200 rounded-lg bg-white text-xs font-medium text-gray-900 hover:bg-gray-50 whitespace-nowrap shadow-sm">
              <img src={CoinIcon} alt="Coin" className="w-3 h-3 text-gray-500" />
              All Payments <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button className="flex-shrink-0 pt-1 pb-1 pl-2 pr-2 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50 shadow-sm flex items-center justify-center">
              <img src={FunnelIcon} alt="Funnel" className="w-3 h-4" />
            </button>
          </div>

          {/* Pagination (Right) - Matched styling */}
          <div className="hidden sm:flex items-center gap-2 w-full lg:w-auto justify-end">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              <span className="inline-flex items-center whitespace-nowrap">Rows per page</span> <ChevronDown size={14} />
            </button>

            <div className="flex items-center gap-1.5 ml-2">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm font-medium text-gray-900 bg-gray-50">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">3</button>
              <span className="text-gray-400 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">28</button>
              
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE VIEW: Cards --- */}
        <div className="block md:hidden space-y-3">
          {filteredAndSortedLeads.map((lead) => (
            <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <CustomCheckbox 
                      checked={!!lead.selected} 
                      onChange={() => handleCheckboxChange(lead.id)} 
                    />
                    
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} alt={lead.name} className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{lead.name}</h3>
                      <p className="text-xs text-gray-500">{lead.handle}</p>
                    </div>
                  </div>
                  <button className="text-gray-400"><MoreVertical size={16} /></button>
              </div>
              <div className="pl-7 flex flex-col gap-1">
                <StatusBadge status={lead.status} />
                <div className="text-xs text-gray-700"><span className="font-semibold text-gray-400 mr-1">Username:</span>{lead.handle}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-1 pl-7">
                <div className="text-gray-500"><span className="block text-[10px] uppercase font-semibold text-gray-400">Cash</span>{lead.cash}</div>
                <div className="text-gray-500"><span className="block text-[10px] uppercase font-semibold text-gray-400">Interacted</span>{lead.interacted}</div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DESKTOP VIEW: Table --- */}
        <div className="hidden md:block border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[13px] font-semibold text-gray-500 tracking-wider">
                  <th className="px-4 py-3 w-10 min-w-[40px] max-w-[40px] text-center">
                    <div className="flex items-center justify-center">
                      <CustomCheckbox 
                        checked={headerCheckboxState}
                        onChange={handleToggleAll} 
                      />
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} className="px-4 py-3 min-w-[180px] max-w-[220px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Lead Name {renderSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('handle')} className="px-4 py-3 min-w-[120px] max-w-[160px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Username {renderSortIcon('handle')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} className="px-4 py-3 min-w-[120px] max-w-[140px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('cash')} className="px-4 py-3 min-w-[120px] max-w-[140px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Cash Collected {renderSortIcon('cash')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('assignedTo')} className="px-4 py-3 min-w-[160px] max-w-[200px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Assigned To {renderSortIcon('assignedTo')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('account')} className="px-4 py-3 min-w-[140px] max-w-[180px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Account {renderSortIcon('account')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('interacted')} className="px-4 py-3 min-w-[120px] max-w-[160px] cursor-pointer hover:bg-gray-100 transition-colors group whitespace-nowrap">
                    <div className="flex items-center gap-1 select-none">
                      Interacted {renderSortIcon('interacted')}
                    </div>
                  </th>
                  <th className="px-4 py-3 w-10 min-w-[40px] max-w-[40px]"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAndSortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <CustomCheckbox 
                          checked={!!lead.selected} 
                          onChange={() => handleCheckboxChange(lead.id)} 
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} alt={lead.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                              {lead.messageCount && (
                                <span className="flex items-center justify-center bg-[#8B5CF6] text-white text-[10px] font-bold px-1.5 h-4 rounded-full">
                                  <img src={MessageCountIcon} alt="msg" className="mr-0.5 w-3 h-3" /> {lead.messageCount}
                                </span>
                              )}
                            </div>
                          </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.handle || <span className='italic text-gray-400'>N/A</span>}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.cash}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.assignedTo}`} alt={lead.assignedTo} />
                        </div>
                        <span className="text-sm text-gray-700">{lead.assignedTo} <span className="text-gray-400">{lead.assignedRole}</span></span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{lead.account}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{lead.interacted}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LeadsPage;