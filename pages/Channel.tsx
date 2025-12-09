import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { HeroSection } from '../components/HeroSection';
import { Play, Filter, Clock, TrendingUp, Coins, Music, Mic, Newspaper, Users, Video } from '../components/Icons';
import { MediaType } from '../types';

export const Channel: React.FC = () => {
  const { videos, audios, playMedia, userStats } = useApp();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  // Combine content from different sources
  const allContent = useMemo(() => {
    return [...videos, ...audios];
  }, [videos, audios]);

  // Categories Map
  const categories = [
    { id: 'Todos', label: 'Todos', icon: Video },
    { id: 'Música', label: 'Música', icon: Music },
    { id: 'Podcast', label: 'Podcast', icon: Mic },
    { id: 'Jornais', label: 'Jornais', icon: Newspaper },
    { id: 'Entrevistas', label: 'Entrevistas', icon: Users },
  ];

  // Filtering Logic
  const filteredContent = useMemo(() => {
    let filtered = allContent;

    // Category Filter (Loose matching for demo purposes)
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter(item => {
        if (activeCategory === 'Música') return item.type === MediaType.AUDIO || item.category.includes('Music') || item.category.includes('Música');
        if (activeCategory === 'Podcast') return item.type === MediaType.PODCAST;
        if (activeCategory === 'Jornais') return item.category.includes('News') || item.category.includes('Notícias');
        if (activeCategory === 'Entrevistas') return item.category.includes('Interview') || item.category.includes('Talk');
        return true;
      });
    }

    // Sort Logic
    if (sortBy === 'popular') {
      return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    // Default recent (mock logic using array reverse as simpler proxy for date)
    return [...filtered].reverse();
  }, [allContent, activeCategory, sortBy]);

  return (
    <div className="pb-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Gamification Banner */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Coins size={28} className="text-yellow-300" /> Ganhe Assistindo!
                </h2>
                <p className="opacity-90 mt-1">
                    A cada <span className="font-bold text-yellow-300">60 segundos</span> assistidos:
                    <br/>
                    <span className="font-bold">+10 PTS</span> para você • <span className="font-bold">+10 PTS</span> para o criador.
                </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center min-w-[150px]">
                <p className="text-xs uppercase font-bold opacity-80">Seu Saldo</p>
                <p className="text-3xl font-black text-yellow-300">{userStats.protoStreamBalance} PTS</p>
            </div>
        </div>
        {/* Background Decoration */}
        <Coins className="absolute -right-10 -bottom-10 text-white/10 w-64 h-64 rotate-12" />
      </div>

      {/* 3. Filter & Sort Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 sticky top-20 z-20 bg-gray-50/95 dark:bg-dark-bg/95 p-2 rounded-xl backdrop-blur-sm">
         
         {/* Categories */}
         <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    <cat.icon size={16} /> {cat.label}
                </button>
            ))}
         </div>

         {/* Sorting */}
         <div className="flex items-center gap-2 bg-white dark:bg-dark-card p-1 rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
            <button 
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${
                    sortBy === 'recent' ? 'bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400' : 'text-gray-500'
                }`}
            >
                <Clock size={14} /> Recentes
            </button>
            <button 
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${
                    sortBy === 'popular' ? 'bg-gray-100 dark:bg-gray-700 text-brand-600 dark:text-brand-400' : 'text-gray-500'
                }`}
            >
                <TrendingUp size={14} /> Em Alta
            </button>
         </div>
      </div>

      {/* 4. Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContent.map(item => (
            <div 
                key={item.id} 
                className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800"
                onClick={() => playMedia(item)}
            >
                <div className={`relative ${item.type === MediaType.SHORT ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200 dark:bg-gray-800`}>
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-brand-600/90 backdrop-blur-sm p-3 rounded-full text-white shadow-lg transform group-hover:scale-110 transition">
                            <Play size={24} fill="currentColor" />
                        </div>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Coins size={10} className="text-yellow-400" /> +10
                    </div>

                    {item.isLive && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                            AO VIVO
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-brand-500 transition-colors">
                            {item.title}
                        </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                {item.author ? item.author.charAt(0) : 'F'}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
                                {item.author || 'Fluxx User'}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {item.views || 0} views
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
          <div className="text-center py-24">
              <div className="bg-gray-100 dark:bg-dark-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nenhum conteúdo encontrado</h3>
              <p className="text-gray-500">Tente mudar os filtros de categoria.</p>
          </div>
      )}
    </div>
  );
};