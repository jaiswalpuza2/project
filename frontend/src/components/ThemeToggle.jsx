import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-indigo-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 border border-slate-200 dark:border-slate-700/50 shadow-sm"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="animate-in zoom-in duration-300" />
      ) : (
        <Moon size={20} className="animate-in zoom-in duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
