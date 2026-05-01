"use client";

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

export default function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  return (
    <button 
      onClick={() => setIsDark(!isDark)}
      // Se eliminan las clases de posicionamiento fijo
      className={`p-4 rounded-full shadow-xl transition-all duration-300 active:scale-90 ${
        isDark ? 'bg-zinc-800 text-yellow-400' : 'bg-white text-zinc-900 border border-zinc-100'
      }`}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}