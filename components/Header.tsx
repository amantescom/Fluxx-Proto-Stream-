import React from 'react';
import { Search, Bell, Sun, Moon, Coins } from './Icons';
import { useApp } from '../context';

export const Header: React.FC = () => {
  const { userStats, darkMode, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 lg:px-8">
      {/* Mobile Logo Placeholder (Only visible on small screens) */}
      <div className="lg:hidden flex items-center">
        <img src="https://i.imgur.com/v8p5v9X.png" alt="Fluxx Proto" className="h-8 w-auto object-contain" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-brand-500" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search videos, podcasts, news..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent sm:text-sm transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-dark-bg"></span>
        </button>

        {/* Balance Display: Always Green/Emerald for Money context */}
        <div className="hidden md:flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Coins size={14} className="text-emerald-500 mr-1.5" />
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-1">{userStats.protoStreamBalance}</span>
          <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">PTS</span>
        </div>
      </div>
    </header>
  );
};