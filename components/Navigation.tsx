

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, Radio, Music, ShoppingBag, Shield, Users, Wallet, LayoutDashboard, Film, Lock } from './Icons';
import { useApp } from '../context';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/videos', label: 'Videos', icon: Video },
  { path: '/audios', label: 'Audios', icon: Music },
  { path: '/radio', label: 'Radio', icon: Radio },
  { path: '/shop', label: 'Shop', icon: ShoppingBag },
];

export const Sidebar: React.FC = () => {
  const { userStats } = useApp();

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 z-40">
      <div className="p-6 flex items-center justify-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-orange-500">
          Fluxx
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        
        {/* MANAGEMENT Section */}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Management</p>
          
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Wallet size={20} />
            <span className="font-medium">Carteira</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Users size={20} />
            <span className="font-medium">Usuários</span>
          </NavLink>

           <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Admin</span>
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <NavLink to="/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <p className="text-sm font-semibold dark:text-white">CANAL</p>
            <p className="text-xs text-brand-500 font-bold">{userStats.protoStreamBalance} PS</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export const MobileNav: React.FC = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 p-2 z-40 flex justify-around pb-6 md:pb-4">
      {navItems.map((item) => (
         <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 p-2 rounded-lg ${
                isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <item.icon size={24} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
      ))}
      <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 p-2 rounded-lg ${
                isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
              C
            </div>
            <span className="text-[10px] font-bold">Profile</span>
      </NavLink>
    </div>
  );
};