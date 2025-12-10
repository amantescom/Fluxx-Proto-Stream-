
import React from 'react';
import { useApp } from '../context';
import { PODCASTS, VIDEO_PODCASTS } from '../constants';
import { Play, Mic, Headphones } from '../components/Icons';
import { HeroSection } from '../components/HeroSection';

export const Podcasts: React.FC = () => {
  const { playMedia } = useApp();
  const allPodcasts = [...VIDEO_PODCASTS, ...PODCASTS];

  return (
    <div className="pb-24">
      <HeroSection />

      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Podcasts</h1>
           <p className="text-gray-500 dark:text-gray-400">Conversas, histórias e debates profundos.</p>
        </div>
        <Mic size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allPodcasts.map((item) => (
          <div 
             key={item.id} 
             className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col"
             onClick={() => playMedia(item)}
          >
             <div className="relative aspect-square bg-gray-200 dark:bg-gray-800 cursor-pointer">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                   <Headphones size={12} /> {item.duration ? `${Math.floor(item.duration/60)}m` : 'Episódio'}
                </div>
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-brand-500 p-3 rounded-full text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                       <Play size={24} fill="currentColor" />
                    </div>
                </div>
             </div>

             <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs font-bold text-brand-500 mb-1 uppercase tracking-wide">{item.category}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{item.subtitle}</p>
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                   <span className="text-xs text-gray-400 font-medium">{item.author}</span>
                   <button className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 font-bold transition">Reproduzir</button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
