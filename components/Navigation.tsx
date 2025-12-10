
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Video, Music, Wallet, LayoutDashboard, ShoppingBag, Users, Globe, Send, MessageCircle, Phone } from './Icons';
import { useApp } from '../context';

const mainNav = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/videos', label: 'Vídeos', icon: Video },
  { path: '/audios', label: 'Áudios', icon: Music },
  { path: '/shop', label: 'Grau Shop', icon: ShoppingBag },
];

const communityNav = [
  { path: 'https://loucosporgrau.com.br', label: 'Loucos por Grau', icon: Users, external: true },
  { path: 'https://twitter.com', label: 'X (antigo Twitter)', icon: Globe, external: true },
  { path: 'https://t.me/fluxx_comunidade', label: 'Telegram – Comunidade', icon: Send, external: true },
];

const supportNav = [
  { path: 'https://t.me/fluxx_suporte', label: 'Telegram – Suporte', icon: MessageCircle, external: true },
  { path: 'https://wa.me/', label: 'WhatsApp – Suporte', icon: Phone, external: true },
];

const managementNav = [
  { path: '/wallet', label: 'Minha Carteira', icon: Wallet },
  { path: '/admin/dashboard', label: 'Admin', icon: LayoutDashboard },
];

export const Sidebar: React.FC = () => {
  const { userStats } = useApp();

  const renderLink = (item: { path: string, label: string, icon: React.ElementType, external?: boolean }) => {
    if (item.external) {
       return (
        <a
          key={item.label}
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <item.icon size={20} />
          <span className="font-medium text-sm">{item.label}</span>
        </a>
       );
    }
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 mb-1 ${
            isActive
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`
        }
      >
        <item.icon size={20} />
        <span className="font-medium text-sm">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 z-40">
      <div className="p-6 flex items-center justify-center">
        <img src="https://i.imgur.com/v8p5v9X.png" alt="Fluxx Proto" className="h-12 w-auto object-contain transition-transform hover:scale-105" />
      </div>

      <nav className="flex-1 px-4 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        
        <div className="mb-6">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">MENU PRINCIPAL</p>
          {mainNav.map(renderLink)}
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Comunidade</p>
          {communityNav.map(renderLink)}
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Suporte</p>
          {supportNav.map(renderLink)}
        </div>

        <div className="mb-6">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gerenciamento</p>
          {managementNav.map(renderLink)}
        </div>

      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <NavLink to="/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold">
            C
          </div>
          <div>
            <p className="text-sm font-semibold dark:text-white">DASHBOARD</p>
            <p className="text-xs text-brand-500 font-bold">{userStats.protoStreamBalance} PTS</p>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export const MobileNav: React.FC = () => {
  const mobileItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/videos', label: 'Vídeos', icon: Video },
    { path: '/shop', label: 'Shop', icon: ShoppingBag },
    { path: '/wallet', label: 'Carteira', icon: Wallet },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 p-2 z-40 flex justify-around pb-safe">
      {mobileItems.map((item) => (
         <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 p-2 rounded-lg min-w-[60px] ${
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
              `flex flex-col items-center justify-center space-y-1 p-2 rounded-lg min-w-[60px] ${
                isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
              C
            </div>
            <span className="text-[10px] font-bold">Perfil</span>
      </NavLink>
    </div>
  );
};
