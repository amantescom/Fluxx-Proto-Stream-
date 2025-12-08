import React from 'react';
import { useApp } from '../context';
import { Play, Radio as RadioIcon, Settings } from '../components/Icons';
import { HeroSection } from '../components/HeroSection';
import { MediaItem } from '../types';

export const Radio: React.FC = () => {
  const { playMedia, radios } = useApp();

  // Helper to render a horizontal scrollable section (Same as Home)
  const renderSection = (title: string, icon: React.ReactNode, items: MediaItem[]) => {
    if (items.length === 0) return null;
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
                className="min-w-[160px] w-[160px] cursor-pointer group"
                onClick={() => playMedia(item)}
            >
                <div className="relative h-28 rounded-xl overflow-hidden mb-2 shadow-sm bg-gray-200 dark:bg-gray-800">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Live Badge */}
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <span className="w-1 h-1 bg-white rounded-full"></span> LIVE
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <Play size={24} className="text-white fill-current" />
                      </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                   <span className="truncate flex-1">{item.location || item.subtitle}</span>
                </div>
                <div className="mt-1">
                   <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">
                     {item.category}
                   </span>
                </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Group stations
  const criciumaStations = radios.filter(r => r.location && r.location.includes('Criciúma'));
  const hitStations = radios.filter(r => r.category === 'Hits');
  const popStations = radios.filter(r => r.category === 'Pop');
  const rockStations = radios.filter(r => r.category === 'Rock');
  const newsStations = radios.filter(r => r.category === 'News');

  return (
    <div className="pb-24">
      {/* Global Hero Section */}
      <HeroSection />

      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Radios online e Fm</h1>
           <p className="text-gray-500 dark:text-gray-400">hub Fluxx Global de streming monetizado</p>
        </div>
        <RadioIcon size={48} className="text-brand-200 dark:text-brand-900 opacity-50" />
      </div>

      {/* Categories */}
      {renderSection(
        "Rádios", 
        <Settings size={20} className="text-brand-500" />, 
        criciumaStations
      )}

      {renderSection(
        "Top Hits", 
        <RadioIcon size={20} className="text-orange-500" />, 
        hitStations
      )}

      {renderSection(
        "Pop Music", 
        <RadioIcon size={20} className="text-pink-500" />, 
        popStations
      )}
      
      {renderSection(
        "Rock & Alternative", 
        <RadioIcon size={20} className="text-purple-500" />, 
        rockStations
      )}

      {renderSection(
        "News & Talk", 
        <RadioIcon size={20} className="text-blue-500" />, 
        newsStations
      )}

    </div>
  );
};