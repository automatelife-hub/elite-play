import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="relative w-9 h-9 rounded-lg transition-all duration-300 hover:bg-slate-800/50"
    >
      <Sun className={`h-4 w-4 absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-yellow-400'}`} />
      <Moon className={`h-4 w-4 absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100 text-cyan-400' : 'opacity-0 -rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}