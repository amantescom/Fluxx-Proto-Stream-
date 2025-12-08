import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context';
import { HERO_SLIDES, FEATURED_CREATORS } from '../constants';
import { Play, ChevronLeft, ChevronRight, Users } from './Icons';

export const HeroSection: React.FC = () => {
  const { playMedia } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Randomized Featured Creators (Memoized)
  const randomCreators = useMemo(() => {
    return [...FEATURED_CREATORS].sort(() => 0.5 - Math.random());
  }, []);

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Hero / Featured Slider (Auto-Rotating) */}
      <section className="relative w-full h-[50vh] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
        
        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide.thumbnail} alt={slide.title} className="w-full h-full object-cover" />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-start">
                 <span className="inline-block bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-lg">
                   {slide.category}
                 </span>
                 <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                   {slide.title}
                 </h1>
                 <p className="text-gray-200 text-sm md:text-lg mb-6 line-clamp-2 max-w-2xl drop-shadow-md">
                   {slide.subtitle}
                 </p>
                 <button 
                   onClick={() => playMedia(slide)}
                   className="bg-white text-gray-900 hover:bg-brand-500 hover:text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 flex items-center gap-2 shadow-xl"
                 >
                   <Play size={20} fill="currentColor" /> Watch Now
                 </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={32} />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                index === currentSlide ? 'w-8 bg-brand-500' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Featured Creators / Channels Rail */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
           <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Users size={20} className="text-brand-500" /> Canais em Destaque
           </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4 pl-1">
           {randomCreators.map((creator) => (
             <div 
                key={creator.id} 
                className="flex flex-col items-center min-w-[80px] cursor-pointer group"
                onClick={() => alert(`Redirecting to ${creator.name}'s channel...`)}
             >
                <div className={`w-20 h-20 rounded-full p-1 mb-2 relative ${
                   creator.isLive 
                   ? 'bg-gradient-to-tr from-brand-400 to-purple-600' 
                   : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                   <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-bg" 
                   />
                   {creator.isLive && (
                     <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] font-bold px-1.5 rounded-full border-2 border-white dark:border-dark-bg animate-pulse">
                        LIVE
                     </div>
                   )}
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white text-center truncate w-full group-hover:text-brand-500 transition-colors">
                  {creator.name}
                </span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};