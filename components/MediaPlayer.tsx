
import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context';
import { Play, Pause, X, Maximize2, SkipBack, SkipForward, Volume2, Award, Heart } from './Icons';
import { MediaType } from '../types';

export const MediaPlayer: React.FC = () => {
  const { activeMedia, isPlaying, togglePlay, closePlayer, userStats, toggleFavorite, processMediaReward } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  
  // Timer for 60s reward cycle
  const [secondsWatched, setSecondsWatched] = useState(0);

  // Sync play state with ref
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeMedia]);

  // Handle Reward Logic (Strict 60s timer)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying && activeMedia) {
      interval = setInterval(() => {
        setSecondsWatched(prev => {
          const newVal = prev + 1;
          if (newVal >= 60) {
            // Trigger Reward
            processMediaReward(activeMedia);
            setShowReward(true);
            setTimeout(() => setShowReward(false), 3000);
            return 0; // Reset timer
          }
          return newVal;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeMedia, processMediaReward]);

  // Handle progress visual updates (HTML5 Video Event)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 100;
      setProgress((current / duration) * 100);
    }
  };

  if (!activeMedia) return null;

  const isVideo = activeMedia.type === MediaType.VIDEO || activeMedia.type === MediaType.LIVE_TV || activeMedia.type === MediaType.SHORT;
  const isFavorite = userStats.favorites.includes(activeMedia.id);

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden
        ${isExpanded 
          ? 'inset-0 bg-black' 
          : 'bottom-16 lg:bottom-4 right-0 lg:right-4 w-full lg:w-96 bg-white dark:bg-dark-card border-t lg:border border-gray-200 dark:border-gray-700 lg:rounded-xl'
        }`}
    >
      {/* Visual Feedback for Rewards */}
      {showReward && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-brand-500 text-white px-6 py-3 rounded-full font-bold flex flex-col items-center shadow-2xl border-2 border-white">
            <div className="flex items-center gap-2">
                 <Award size={24} /> +10 Proto Stream!
            </div>
            <span className="text-xs font-normal opacity-90">Você e o criador ganharam.</span>
          </div>
        </div>
      )}

      {/* Media Content */}
      <div className={`relative ${isExpanded ? 'h-full flex items-center justify-center' : 'h-16 lg:h-56'}`}>
        {/* Video Element */}
        <video
          ref={videoRef}
          src={activeMedia.url}
          className={`${isVideo ? 'block' : 'hidden'} ${isExpanded ? 'w-full h-full object-contain' : 'w-full h-full object-cover'}`}
          onTimeUpdate={handleTimeUpdate}
          playsInline
          loop={activeMedia.isLive}
        />
        
        {/* Audio / Radio Visual Placeholder */}
        {!isVideo && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
            <div className="text-center p-4">
               <div className="w-16 h-16 mx-auto bg-brand-500 rounded-full flex items-center justify-center animate-pulse-slow">
                 <Volume2 className="text-white" size={32} />
               </div>
               {isExpanded && <h3 className="mt-4 text-white text-xl font-bold">{activeMedia.title}</h3>}
               {isExpanded && <p className="text-brand-400 mt-2 text-sm">Reward in: {60 - secondsWatched}s</p>}
            </div>
          </div>
        )}

        {/* Controls Overlay (Expanded) */}
        {isExpanded && (
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-8">
            <div className="flex justify-end items-center gap-4">
              <div className="text-white text-sm bg-white/10 px-3 py-1 rounded-full">
                 Reward in: <span className="font-bold text-brand-400">{60 - secondsWatched}s</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(activeMedia.id); }}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-brand-500 bg-white/10' : 'text-white hover:text-brand-500 hover:bg-white/10'}`}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button onClick={() => setIsExpanded(false)} className="text-white hover:text-brand-500 p-2">
                <Maximize2 size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-2xl font-bold">{activeMedia.title}</h2>
              <div className="w-full bg-gray-600 h-1 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex items-center justify-center gap-8">
                <button className="text-white hover:text-brand-500"><SkipBack size={32} /></button>
                <button 
                  onClick={togglePlay} 
                  className="bg-brand-500 text-white p-4 rounded-full hover:bg-brand-600 transform hover:scale-105 transition"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button className="text-white hover:text-brand-500"><SkipForward size={32} /></button>
              </div>
            </div>
          </div>
        )}

        {/* Mini Player Controls */}
        {!isExpanded && (
          <div className="absolute inset-0 flex items-center bg-white dark:bg-dark-card pr-4">
            {/* Mini Thumbnail */}
            <div className="w-16 h-16 lg:w-24 lg:h-full relative mr-3 shrink-0">
                <img src={activeMedia.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1 cursor-pointer" onClick={() => setIsExpanded(true)}>
              <h4 className="font-semibold text-sm truncate text-gray-900 dark:text-white">{activeMedia.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activeMedia.subtitle || activeMedia.category}</p>
              {/* Mini Progress */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Mini Actions */}
            <div className="flex items-center gap-2 pl-2">
              <button 
                onClick={(e) => {e.stopPropagation(); toggleFavorite(activeMedia.id);}}
                className={`p-2 ${isFavorite ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500 hover:text-brand-500'}`}
                title="Favorite"
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button onClick={(e) => {e.stopPropagation(); togglePlay();}} className="p-2 text-gray-800 dark:text-white hover:text-brand-500">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={(e) => {e.stopPropagation(); closePlayer();}} className="p-2 text-gray-500 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
