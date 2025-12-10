
import React from 'react';
import { useApp } from '../context';
import { INTERVIEWS_LIST } from '../constants';
import { Play, Users, MessageSquare } from '../components/Icons';
import { HeroSection } from '../components/HeroSection';

export const Interviews: React.FC = () => {
  const { playMedia } = useApp();

  return (
    <div className="pb-24">
      <HeroSection />

      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Entrevistas</h1>
           <p className="text-gray-500 dark:text-gray-400">Bate-papos com personalidades e especialistas.</p>
        </div>
        <Users size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {INTERVIEWS_LIST.map((item) => (
          <div 
             key={item.id} 
             className="flex flex-col sm:flex-row bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer"
             onClick={() => playMedia(item)}
          >
             <div className="sm:w-1/2 relative aspect-video sm:aspect-auto">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={40} className="text-white drop-shadow-lg" />
                </div>
             </div>
             
             <div className="sm:w-1/2 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {item.category}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-brand-500 transition-colors">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{item.subtitle}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                    <MessageSquare size={14} />
                    <span>Entrevista por {item.author}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
