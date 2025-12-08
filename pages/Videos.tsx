
import React from 'react';
import { useApp } from '../context';
import { TV_CHANNELS, LIVES_LIST, VIDEO_PODCASTS, INTERVIEWS_LIST, SHORTS_LIST, VLOGS_LIST } from '../constants';
import { Play, Video, Film, Radio as LiveIcon, Mic, Users, Tv } from '../components/Icons';
import { MediaType, MediaItem } from '../types';
import { HeroSection } from '../components/HeroSection';

export const Videos: React.FC = () => {
  const { playMedia } = useApp();

  // Helper to render a horizontal scrollable section (Same as Home)
  const renderSection = (title: string, icon: React.ReactNode, items: MediaItem[]) => {
    if (!items || items.length === 0) return null;
    return (
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
                className={`min-w-[200px] w-[200px] cursor-pointer group`}
                onClick={() => playMedia(item)}
             >
                <div className={`relative ${item.type === MediaType.SHORT ? 'aspect-[9/16] w-[140px] min-w-[140px]' : 'aspect-video'} rounded-xl overflow-hidden mb-2 shadow-sm bg-gray-200 dark:bg-gray-800`}>
                   <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                   
                   {/* Badge Overlays */}
                   {item.isLive && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse">
                        LIVE
                      </div>
                   )}
                   {item.type === MediaType.SHORT && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        SHORT
                      </div>
                   )}
  
                   {/* Play Overlay */}
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                         <Play size={28} className="text-white fill-current" />
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
  };

  return (
    <div className="pb-24">
       {/* Global Hero Section */}
       <HeroSection />

       <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Videos & Live TV</h1>
           <p className="text-gray-500 dark:text-gray-400">Watch the best channels, lives, podcasts, and shorts.</p>
        </div>
        <Video size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      {/* 1. TV Online */}
      {renderSection(
        "TV Online (Canais Abertos)", 
        <Tv size={20} className="text-blue-500" />, 
        TV_CHANNELS
      )}

      {/* 2. Lives (Music, Games, Edu) */}
      {renderSection(
        "Lives em Destaque", 
        <LiveIcon size={20} className="text-red-500" />, 
        LIVES_LIST
      )}

      {/* 3. Video Podcasts */}
      {renderSection(
        "Video Podcasts", 
        <Mic size={20} className="text-purple-500" />, 
        VIDEO_PODCASTS
      )}

      {/* 4. Interviews */}
      {renderSection(
        "Entrevistas & Business", 
        <Users size={20} className="text-green-500" />, 
        INTERVIEWS_LIST
      )}

      {/* 5. Shorts & Clips */}
      {renderSection(
        "Shorts & Clips", 
        <Film size={20} className="text-pink-500" />, 
        SHORTS_LIST
      )}

      {/* 6. Vlogs */}
      {renderSection(
        "Vlogs & Lifestyle", 
        <Video size={20} className="text-orange-500" />, 
        VLOGS_LIST
      )}
    </div>
  );
};
