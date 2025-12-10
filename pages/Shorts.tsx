
import React from 'react';
import { useApp } from '../context';
import { SHORTS_LIST } from '../constants';
import { Play, Film } from '../components/Icons';
import { HeroSection } from '../components/HeroSection';

export const Shorts: React.FC = () => {
  const { playMedia } = useApp();

  return (
    <div className="pb-24">
      {/* Optional: Reuse Hero or a smaller banner */}
      <HeroSection />

      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reels & Shorts</h1>
           <p className="text-gray-500 dark:text-gray-400">Vídeos curtos e dinâmicos para você.</p>
        </div>
        <Film size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {SHORTS_LIST.map((item) => (
          <div 
             key={item.id} 
             className="group cursor-pointer relative rounded-xl overflow-hidden aspect-[9/16] shadow-md bg-gray-900"
             onClick={() => playMedia(item)}
          >
             <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
             
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

             {/* Play Icon */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                   <Play size={32} className="text-white fill-current" />
                </div>
             </div>

             {/* Info */}
             <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight mb-1">{item.title}</h3>
                <p className="text-gray-300 text-xs truncate">{item.author}</p>
             </div>
             
             <div className="absolute top-2 right-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                REELS
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
