'use client';
import { MessageSquare } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-blue-500"/>
      </div>
      <h3 className="text-gray-900 font-medium mb-1">Your Inbox</h3>
      <p className="text-sm">Select a conversation to start chatting.</p>
    </div>
  );
}