import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappURL = base44.agents.getWhatsAppConnectURL('poker_advisor');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Tooltip */}
          <div className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap">
              <div className="font-semibold">Chat with Poker Advisor</div>
              <div className="text-xs text-gray-400">Get instant expert advice on WhatsApp</div>
            </div>
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
          </div>

          {/* Button */}
          <button
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group-hover:shadow-green-500/50"
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </button>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
          
          {/* Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-gray-950">
            <span className="text-gray-900 font-bold text-xs">AI</span>
          </div>
        </div>
      </a>
    </div>
  );
}