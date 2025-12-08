import React, { useState } from 'react';
import { useApp } from '../context';
import { LIVE_CHANNELS } from '../constants';
import { Play, Heart, Share2 } from '../components/Icons';

const categories = ['All', 'News', 'Sports', 'Entertainment', 'Kids'];

export const LiveTV: React.FC = () => {
  const { playMedia, activeMedia, userStats, toggleFavorite } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredChannels = activeCategory === 'All' 
    ? LIVE_CHANNELS 
    : LIVE_CHANNELS.filter(c => c.category === activeCategory || (activeCategory === 'Entertainment' && c.category === 'General'));

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Live TV</h1>
        <p className="text-gray-500 dark:text-gray-400">Watch your favorite channels live and earn points.</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                : 'bg-gray-200 dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChannels.map((channel) => {
          const isFavorite = userStats.favorites.includes(channel.id);
          const isPlaying = activeMedia?.id === channel.id;

          return (
            <div key={channel.id} className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative aspect-video">
                <img src={channel.thumbnail} alt={channel.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button 
                    onClick={() => playMedia(channel)}
                    className="bg-brand-500 text-white p-3 rounded-full hover:bg-brand-600 transform hover:scale-110 transition"
                   >
                     <Play size={24} fill="currentColor" />
                   </button>
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                      <h3 className={`font-bold text-lg truncate ${isPlaying ? 'text-brand-500' : 'text-gray-900 dark:text-white'}`}>
                          {channel.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{channel.category}</p>
                  </div>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFavorite(channel.id)}
                        className={`transition-colors ${isFavorite ? 'text-brand-500' : 'text-gray-400 hover:text-brand-500'}`}
                      >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button className="text-gray-400 hover:text-brand-500"><Share2 size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};