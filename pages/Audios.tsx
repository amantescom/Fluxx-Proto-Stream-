import React from 'react';
import { useApp } from '../context';
import { AUDIOS, PODCASTS } from '../constants';
import { Play, Music, Mic } from '../components/Icons';
import { MediaType, MediaItem } from '../types';
import { HeroSection } from '../components/HeroSection';

export const Audios: React.FC = () => {
  const { playMedia } = useApp();

  const music = AUDIOS.filter(a => a.type === MediaType.AUDIO);
  const podcasts = PODCASTS.filter(a => a.type === MediaType.PODCAST);

  // Helper to render a horizontal scrollable section (Same as Home)
  const renderSection = (title: string, icon: React.ReactNode, items: MediaItem[]) => (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
         <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
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
              <div className="relative h-40 rounded-xl overflow-hidden mb-2 shadow-sm bg-gray-200 dark:bg-gray-800">
                 <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                 
                 <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {item.type === MediaType.PODCAST ? 'PODCAST' : 'MUSIC'}
                 </div>

                 {/* Play Overlay */}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                       <Play size={24} className="text-white fill-current" />
                    </div>
                 </div>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.subtitle || item.author}</p>
           </div>
         ))}
      </div>
    </section>
  );

  return (
    <div className="pb-24">
       {/* Global Hero Section */}
       <HeroSection />

       <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Audio Streaming</h1>
           <p className="text-gray-500 dark:text-gray-400">Listen to the best music and podcasts.</p>
        </div>
        <Music size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      {/* Sections */}
      {renderSection(
        "Trending Music", 
        <Music size={20} className="text-pink-500" />, 
        music
      )}

      {renderSection(
        "Podcasts & Shows", 
        <Mic size={20} className="text-indigo-500" />, 
        podcasts
      )}
    </div>
  );
};