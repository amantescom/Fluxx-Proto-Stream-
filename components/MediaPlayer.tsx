
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../context';
import { 
  Play, Pause, X, Maximize2, SkipBack, SkipForward, Volume2, Award, Heart, 
  MessageCircle, Send, Minimize2, Smile, ChevronDown, Share2 
} from './Icons';
import { MediaType, ChatMessage } from '../types';

// Helper for consistent username colors
const getUserColor = (username: string) => {
    const colors = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-purple-400', 'text-pink-400', 'text-orange-400', 'text-teal-400'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const MOCK_MESSAGES = [
  'Muito bom! 👏👏', 'Adorei esse conteúdo', 'Top demais 🔥', 'Manda salve!', 'Qual a música?', 'Sensacional', 
  'Isso é ao vivo?', 'Hahaha ri muito', 'Alguém sabe o nome do jogo?', 'First!', 'Salve do RJ',
  'Criciúma presente!', 'Lindoooo', 'Nossa, que qualidade', 'Travou aqui :(', 'Voltou!', 'Show de bola',
  'Merece muito mais views', 'Compartilhei no grupo', 'Faz mais vídeos assim', 'Aumenta o som!', 
  'Bom dia galera', 'Sextouuu', 'Esse canal é o melhor', 'Eu não acredito nisso kkkk'
];

const MOCK_USERS = [
  'Ana Silva', 'GamerPro', 'CryptoKing', 'Maria Eduarda', 'João', 'Viewer123', 'SpeedRacer', 'CoolCat',
  'DevMaster', 'DesignQueen', 'Lucas10', 'Julia_S', 'Felipe Neto Fake', 'Zezinho', 'Paula T', 'Rafa'
];

export const MediaPlayer: React.FC = () => {
  const { activeMedia, isPlaying, togglePlay, closePlayer, userStats, toggleFavorite, processMediaReward } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReward, setShowReward] = useState(false);
  
  // Controls Visibility State (Mobile optimized)
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
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

  // Reset chat when media changes
  useEffect(() => {
    setChatMessages([]);
  }, [activeMedia]);

  // Handle Controls Visibility
  const interactControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && isExpanded) {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying, isExpanded]);

  useEffect(() => {
    if (isExpanded) {
        interactControls();
    }
    return () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current); };
  }, [isExpanded, isPlaying, interactControls]);

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

  // --- Chat Simulation Logic ---
  useEffect(() => {
    const simulateChat = () => {
        if (!isExpanded || !activeMedia || !isPlaying) return;

        const generateMessage = (): ChatMessage => {
            const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
            
            return {
                id: `msg-${Date.now()}-${Math.random()}`,
                plataforma: 'Fluxx Stream',
                canal_id: activeMedia.id,
                usuario: user,
                usuario_id: `u-${Math.floor(Math.random() * 1000)}`,
                avatar: `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000)}`,
                mensagem: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
                hora_utc: new Date().toISOString(),
                lingua: 'pt',
                meta: { like_count: 0, superchat: false, reacao: null, priority: 'normal' }
            };
        };

        setChatMessages(prev => {
            const updated = [...prev, generateMessage()];
            return updated.slice(-50); // Keep last 50
        });

        // Schedule next message with random delay for realism
        const nextDelay = Math.random() * 3000 + 1000; // 1s to 4s
        chatTimeoutRef.current = setTimeout(simulateChat, nextDelay);
    };

    if (isExpanded && isPlaying) {
        chatTimeoutRef.current = setTimeout(simulateChat, 1000);
    }

    return () => {
        if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    };
  }, [isExpanded, activeMedia, isPlaying]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, showChat, isExpanded]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMedia) return;

    const myMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        plataforma: 'Fluxx Stream',
        canal_id: activeMedia.id,
        usuario: 'Você',
        usuario_id: 'u-me',
        avatar: 'https://i.pravatar.cc/150?u=me',
        mensagem: newMessage,
        hora_utc: new Date().toISOString(),
        lingua: 'pt',
        meta: { like_count: 0, superchat: false, reacao: null, priority: 'normal' }
    };

    setChatMessages(prev => [...prev, myMsg]);
    setNewMessage('');
    
    // Auto scroll to bottom
    setTimeout(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, 100);
  };

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

  const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
          setShowChat(true); // Auto show chat on desktop when expanded, logic handled in render
      }
  };

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl overflow-hidden bg-black
        ${isExpanded 
          ? 'inset-0 flex flex-col lg:flex-row' 
          : 'bottom-[84px] lg:bottom-4 right-2 lg:right-4 left-2 lg:left-auto w-auto lg:w-96 h-16 lg:h-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl'
        }`}
    >
      {/* Visual Feedback for Rewards */}
      {showReward && isExpanded && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold flex flex-col items-center shadow-2xl border-2 border-white">
            <div className="flex items-center gap-2">
                 <Award size={24} /> +10 PTS!
            </div>
            <span className="text-xs font-normal opacity-90">Você ganhou!</span>
          </div>
        </div>
      )}

      {/* Main Content Container (Flex for Expanded) */}
      <div 
        className={`relative flex-1 flex flex-col bg-black ${isExpanded ? 'lg:mr-[350px] transition-all' : ''}`}
        onClick={() => { if (!isExpanded) toggleExpanded(); }}
      >
          
          {/* Video Area */}
          <div 
            className="flex-1 relative flex items-center justify-center bg-black group"
            onClick={(e) => { 
                 if(isExpanded) {
                     e.stopPropagation(); 
                     if(showControls) setShowControls(false); 
                     else interactControls(); 
                 }
            }}
          >
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500 via-transparent to-transparent animate-pulse-slow"></div>
                
                <div className="text-center p-4 relative z-10">
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto bg-brand-500/20 rounded-full flex items-center justify-center animate-pulse border-2 border-brand-500/50 mb-6">
                    <Volume2 className="text-brand-500" size={40} />
                  </div>
                  {isExpanded && (
                      <>
                        <h3 className="text-white text-2xl font-bold mb-2">{activeMedia.title}</h3>
                        <p className="text-brand-400 text-sm">Próxima recompensa: {60 - secondsWatched}s</p>
                      </>
                  )}
                </div>
              </div>
            )}

            {/* Expanded Controls Overlay (Mobile Optimized) */}
            {isExpanded && (
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 transition-opacity duration-300 flex flex-col justify-between p-4 md:p-8 z-20 pointer-events-none 
                ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
              >
                {/* Top Bar */}
                <div className="flex justify-between items-start pointer-events-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} 
                    className="text-white p-3 rounded-full hover:bg-white/10 backdrop-blur-sm transition-colors"
                  >
                    <ChevronDown size={28} />
                  </button>
                  
                  <div className="flex items-center gap-3">
                     <div className="text-white text-xs font-bold bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <Award size={14} className="text-yellow-400" />
                        <span>{60 - secondsWatched}s</span>
                     </div>
                  </div>
                </div>

                {/* Center Play Button (Large Touch Target) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                   {!isPlaying && (
                       <button 
                          onClick={(e) => { e.stopPropagation(); togglePlay(); interactControls(); }}
                          className="bg-brand-500/90 text-white p-6 rounded-full hover:bg-brand-500 hover:scale-110 transition-all shadow-xl backdrop-blur-sm"
                       >
                           <Play size={40} fill="currentColor" />
                       </button>
                   )}
                </div>

                {/* Bottom Controls */}
                <div className="flex flex-col gap-4 w-full pointer-events-auto pb-safe">
                  <div className="text-left">
                     <h2 className="text-white text-lg md:text-2xl font-bold drop-shadow-md line-clamp-1">{activeMedia.title}</h2>
                     <p className="text-gray-300 text-xs md:text-sm line-clamp-1">{activeMedia.subtitle || activeMedia.category}</p>
                  </div>
                  
                  {/* Progress Bar (Thicker for touch) */}
                  <div 
                    className="w-full bg-gray-600/50 h-2 md:h-1.5 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm group"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <div className="bg-brand-500 h-full shadow-[0_0_15px_rgba(34,197,94,0.7)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-2">
                     <div className="flex gap-4 items-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); togglePlay(); interactControls(); }} 
                            className="text-white hover:text-brand-500 p-2"
                        >
                            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                        </button>
                        <button className="text-white hover:text-brand-500 p-2 hidden md:block"><SkipBack size={24} /></button>
                        <button className="text-white hover:text-brand-500 p-2 hidden md:block"><SkipForward size={24} /></button>
                     </div>
                     
                     <div className="flex gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(activeMedia.id); }}
                          className={`p-3 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-white hover:text-red-400'}`}
                        >
                          <Heart size={24} fill={isFavorite ? "currentColor" : "none"} /> 
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowChat(!showChat); }}
                            className={`p-3 rounded-full transition-colors relative ${showChat ? 'text-brand-500 bg-brand-500/10' : 'text-white hover:text-brand-400'}`}
                        >
                            <MessageCircle size={24} />
                            {/* Chat Badge */}
                            {!showChat && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mini Player Controls (Only when NOT expanded) */}
          {!isExpanded && (
            <div className="absolute inset-0 flex items-center bg-white dark:bg-dark-card pr-3 pl-1">
              {/* Mini Thumbnail */}
              <div className="w-14 h-14 lg:w-24 lg:h-full relative mr-3 shrink-0 rounded-lg overflow-hidden my-1">
                  <img src={activeMedia.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
                <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white leading-tight">{activeMedia.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activeMedia.subtitle || activeMedia.category}</p>
                {/* Mini Progress */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-0.5 mt-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              {/* Mini Actions */}
              <div className="flex items-center gap-1 pl-2">
                <button 
                    onClick={(e) => {e.stopPropagation(); togglePlay();}} 
                    className="p-3 text-gray-800 dark:text-white hover:text-brand-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                </button>
                <button 
                    onClick={(e) => {e.stopPropagation(); closePlayer();}} 
                    className="p-3 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* CHAT SIDEBAR (Right Side in Expanded Mode - Desktop) */}
      {isExpanded && (
        <div className={`hidden lg:flex w-[350px] bg-gray-900 border-l border-gray-800 flex-col absolute right-0 top-0 bottom-0 z-30 transition-transform duration-300 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageCircle size={18} className="text-brand-500" /> Chat da Transmissão
                </h3>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-white">
                    <X size={18} />
                </button>
            </div>
            
            {/* Desktop Chat Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <img src={msg.avatar || 'https://i.pravatar.cc/150'} className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
                        <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-xs font-bold ${msg.usuario_id === 'u-me' ? 'text-brand-500' : getUserColor(msg.usuario)}`}>
                                    {msg.usuario}
                                </span>
                            </div>
                            <p className="text-sm text-gray-200 break-words leading-snug">{msg.mensagem}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="relative">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Envie uma mensagem..." 
                        className="w-full bg-gray-900 text-white text-sm rounded-full pl-4 pr-10 py-3 border border-gray-700 focus:border-brand-500 focus:outline-none placeholder-gray-500"
                    />
                    <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-1 top-1 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* MOBILE CHAT OVERLAY (Bottom Sheet style) */}
      {isExpanded && showChat && (
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-[60vh] bg-black/80 backdrop-blur-xl border-t border-gray-800/50 flex flex-col z-40 rounded-t-3xl animate-in slide-in-from-bottom duration-300 shadow-2xl">
             <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-3xl">
                <div className="flex items-center gap-2 pl-2">
                   <span className="w-10 h-1 bg-gray-500/50 rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2"></span>
                   <span className="text-xs font-bold text-white uppercase tracking-wider mt-2">Chat ao Vivo</span>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 text-white/70 hover:text-white mt-1"><X size={20}/></button>
             </div>
             
             <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 mask-image-b">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-bottom-1">
                         <img src={msg.avatar || 'https://i.pravatar.cc/150'} className="w-6 h-6 rounded-full bg-gray-700 shrink-0 mt-0.5" />
                         <div className="bg-white/10 rounded-lg rounded-tl-none px-3 py-2 min-w-0 max-w-[85%]">
                            <span className={`text-[10px] font-bold block mb-0.5 ${msg.usuario_id === 'u-me' ? 'text-brand-400' : getUserColor(msg.usuario)}`}>{msg.usuario}</span>
                            <span className="text-sm text-white break-words leading-snug">{msg.mensagem}</span>
                         </div>
                    </div>
                ))}
             </div>
             
             <div className="p-3 bg-black border-t border-white/10 pb-safe">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input 
                        className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-3 outline-none border border-transparent focus:border-brand-500 placeholder-gray-500"
                        placeholder="Digite algo..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onFocus={() => { if(isExpanded) setShowControls(false); }}
                    />
                    <button type="submit" className="text-white bg-brand-600 p-3 rounded-full hover:bg-brand-500 shadow-lg disabled:opacity-50" disabled={!newMessage.trim()}>
                        <Send size={18}/>
                    </button>
                </form>
             </div>
        </div>
      )}

    </div>
  );
};
