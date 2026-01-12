import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "./VoiceAssistant";
import { Bot, Sparkles, Languages } from "lucide-react";

export const VoiceAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 group transition-all duration-300 hover:scale-110"
          >
            <div className="relative">
              <Bot className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1">
                <Languages className="h-3 w-3 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Medical Assistant (English/हिंदी)
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Voice Assistant Component */}
      <VoiceAssistant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};