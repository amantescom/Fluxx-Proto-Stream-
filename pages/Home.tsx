import React from 'react';
import { useApp } from '../context';
import { LIVE_CHANNELS, VIDEOS, AUDIOS, PODCASTS, HERO_SLIDES } from '../constants';
import { Play, Radio, Video, Star, Flame, Headphones } from '../components/Icons';
import { MediaItem } from '../types';
import { HeroSection } from '../components/HeroSection';

export const Home: React.FC = () => {
  const { playMedia, radios } = useApp();

  // Helper to render a horizontal scrollable section
  const renderSection = (title: string, icon: React.ReactNode, items: MediaItem[], colorClass: string = "text-gray-900 dark:text-white") => (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
         <h2 className={`text-lg font-bold flex items-center gap-2 ${colorClass}`}>
            {icon} {title}
         </h2>
         <span className="text-xs font-bold text-brand-500 cursor-pointer hover:underline">View All</span>
      </div>
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 pl-1">
         {items.map((item) => (
           <div 
              key={item.id} 
              className="min-w-[160px] w-[160px] cursor-pointer group"
              onClick={() => playMedia(item)}
           >
              <div className="relative h-28 rounded-xl overflow-hidden mb-2 shadow-sm bg-gray-200 dark:bg-gray-800">
                 <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                 
                 {/* Badge Overlays */}
                 {item.isLive && (
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                      LIVE
                    </div>
                 )}
                 {item.type === 'SHORT' && (
                    <div className="absolute top-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      SHORT
                    </div>
                 )}

                 {/* Play Overlay */}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                       <Play size={24} className="text-white fill-current" />
                    </div>
                 </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle || item.category}</p>
           </div>
         ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-6 pb-24">
      
      {/* 1. Hero & Featured Channels (Global Component) */}
      <HeroSection />

      {/* 3. Live Channels */}
      {renderSection(
        "Live Channels", 
        <div className="relative flex h-3 w-3 mr-1">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>, 
        LIVE_CHANNELS
      )}

      {/* 4. Melhores Streamings */}
      {renderSection(
        "Melhores Streamings", 
        <Star size={20} className="text-yellow-500 fill-yellow-500" />, 
        [...HERO_SLIDES, ...LIVE_CHANNELS, ...VIDEOS].sort(() => 0.5 - Math.random()) // Randomize for variety
      )}

      {/* 5. Novidades */}
      {renderSection(
        "Novidades", 
        <Flame size={20} className="text-orange-500 fill-orange-500" />, 
        [...VIDEOS, ...AUDIOS].reverse() // Show newest (bottom of list) first
      )}

      {/* 6. Radios */}
      {renderSection(
        "Rádios", 
        <Radio size={20} className="text-blue-500" />, 
        radios
      )}

      {/* 7. Videos */}
      {renderSection(
        "Vídeos", 
        <Video size={20} className="text-purple-500" />, 
        VIDEOS
      )}

      {/* 8. Audios */}
      {renderSection(
        "Áudios", 
        <Headphones size={20} className="text-pink-500" />, 
        [...AUDIOS, ...PODCASTS]
      )}

    </div>
  );
};