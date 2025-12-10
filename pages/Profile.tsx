
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context';
import { 
  User, Wallet, Coins, TrendingUp, Settings, ShoppingBag, Lock, Unlock, 
  Video, Plus, BarChart2, Eye, Trash2, ShoppingCart, Film, Play, 
  Cast, Facebook, Instagram, Youtube, Twitch, Globe, Signal, Wifi, Activity, CheckCircle, X,
  Music, Clock, MessageSquare, Send, MoreHorizontal,
  Camera, Mic, Monitor, Smartphone, Copy, Clipboard,
  Gift, Tag, Zap, Megaphone, MapPin, Link, Edit2, Tv
} from '../components/Icons';
import { MediaType, PlatformConnection, LiveStreamSession, ChatMessage, Product, MediaItem } from '../types';
import { Channel } from './Channel';

type Tab = 'overview' | 'channel' | 'content' | 'lives' | 'shop' | 'purchases';
type StreamStep = 'SETUP' | 'PERMISSIONS' | 'KEYS' | 'PREVIEW';

export const Profile: React.FC = () => {
  const { userStats, videos, addMedia, deleteMedia, products, deleteProduct, cart } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState({ 
    title: '', 
    category: 'Humor', 
    file: '',
    type: MediaType.SHORT as MediaType 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Stream State
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [activeStream, setActiveStream] = useState<LiveStreamSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Dashboard Chat Input
  const [dashboardChatInput, setDashboardChatInput] = useState('');

  // Fluxx Stream Logic
  const [streamStep, setStreamStep] = useState<StreamStep>('SETUP');
  const [generatedStreamKey, setGeneratedStreamKey] = useState('');
  const [hasPermissions, setHasPermissions] = useState(false);
  const [streamUrl, setStreamUrl] = useState('rtmp://live.fluxx.com/app');
  
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const viewerLocationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [viewerLocations, setViewerLocations] = useState<{city: string, count: number, flag: string}[]>([
      { city: 'Criciúma', count: 124, flag: '🇧🇷' },
      { city: 'São Paulo', count: 85, flag: '🇧🇷' },
      { city: 'Rio de Janeiro', count: 42, flag: '🇧🇷' },
      { city: 'Lisboa', count: 12, flag: '🇵🇹' },
      { city: 'Sangão', count: 5, flag: '🇧🇷' },
      { city: 'Nova York', count: 3, flag: '🇺🇸' },
  ]);

  // Stream Metrics State
  const [streamDuration, setStreamDuration] = useState(0); // in seconds
  const [peakViewers, setPeakViewers] = useState(0);
  const [currentViewers, setCurrentViewers] = useState(0);
  const [sessionEarnings, setSessionEarnings] = useState(0);

  // Streamer Tools State
  const [activeToolTab, setActiveToolTab] = useState<'ACTIONS' | 'STATS'>('ACTIONS');
  
  // 1. Fixar Link
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // 3. Quick Messages
  const [savedMessages, setSavedMessages] = useState<string[]>([
      "Deixe o like 👍",
      "Promoção ativa agora!",
      "De qual cidade vocês estão assistindo?",
      "Compartilhem a live!",
      "Link fixado acima!"
  ]);
  const [customQuickMessage, setCustomQuickMessage] = useState('');


  const [liveForm, setLiveForm] = useState({
      title: '',
      category: 'Geral',
      thumbnail: '',
      platforms: [] as string[]
  });

  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
      { id: 'fluxx', name: 'Custom RTMP', icon: 'Fluxx', connected: true }, // Internal is always true
      { id: 'fb', name: 'Facebook', icon: 'Facebook', connected: false },
      { id: 'insta', name: 'Instagram', icon: 'Instagram', connected: false },
      { id: 'yt', name: 'YouTube', icon: 'YouTube', connected: false },
      { id: 'tiktok', name: 'TikTok', icon: 'TikTok', connected: false },
      { id: 'kwai', name: 'Kwai', icon: 'Globe', connected: false },
  ]);

  const [recentLives, setRecentLives] = useState<LiveStreamSession[]>([
      { id: 'l1', title: 'Gameplay de Sexta', thumbnail: 'https://picsum.photos/300/200?random=88', startTime: '2023-10-20T18:00:00', endTime: '2023-10-20T20:00:00', status: 'ended', viewers: 1500, platforms: ['Facebook', 'YouTube'], earnings: 500 },
      { id: 'l2', title: 'Papo Furado', thumbnail: 'https://picsum.photos/300/200?random=89', startTime: '2023-10-18T20:00:00', endTime: '2023-10-18T21:30:00', status: 'ended', viewers: 800, platforms: ['Instagram'], earnings: 250 }
  ]);

  // Filter Data for Current User (Static ID: u-me)
  const myContent = videos.filter(v => v.ownerId === 'u-me');
  const myProducts = products.filter(p => p.seller.id === 'u-me');
  const myPurchases = userStats.transactions.filter(t => t.type === 'PURCHASE');
  
  // Total Earnings Stats
  const totalViews = myContent.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalContentEarnings = myContent.reduce((acc, curr) => acc + (curr.earnings || 0), 0);
  const totalSalesEarnings = userStats.transactions
    .filter(t => t.type === 'SALE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // --- Mock Chat & Geo Simulation ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timerInterval: ReturnType<typeof setInterval>;

    if (activeStream) {
        // Chat Simulation
        const generateMessage = (): ChatMessage => {
            const platformsList: ChatMessage['plataforma'][] = ['YouTube', 'Facebook', 'Instagram', 'TikTok', 'Fluxx Stream'];
            const plat = platformsList[Math.floor(Math.random() * platformsList.length)];
            const users = ['Ana Silva', 'João Gamer', 'CryptoKing', 'Maria Eduarda', 'Test User', 'Viewer 99', 'Lucas_Br', 'GamerX', 'Sarah_Fit'];
            const msgs = [
                'Top demais!', 'Manda salve!', 'Quanto custa?', 'Show!', '🔥🔥🔥', 'Qual a config do PC?', 'Boa noite!', 'Link na bio?',
                'Cheguei agora, o que rolou?', 'A imagem tá ótima', 'Kkkkkkkk', 'Salve pra Criciúma', 'Compartilhei', 'Like like like'
            ];
            
            const isSuper = Math.random() > 0.95; // 5% chance of Superchat
            const scAmount = isSuper ? [5, 10, 20, 50, 100][Math.floor(Math.random() * 5)] : 0;
            
            return {
                id: `msg-${Date.now()}-${Math.random()}`,
                plataforma: plat,
                canal_id: activeStream.id,
                usuario: users[Math.floor(Math.random() * users.length)],
                usuario_id: `u-${Math.floor(Math.random() * 1000)}`,
                avatar: `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000)}`,
                mensagem: isSuper ? `Enviou ${scAmount} PTS! ${msgs[Math.floor(Math.random() * msgs.length)]}` : msgs[Math.floor(Math.random() * msgs.length)],
                hora_utc: new Date().toISOString(),
                lingua: 'pt',
                meta: {
                    like_count: Math.floor(Math.random() * 10),
                    superchat: isSuper,
                    reacao: null,
                    priority: isSuper ? 'alta' : 'normal',
                    amount: scAmount
                }
            };
        };

        interval = setInterval(() => {
            setChatMessages(prev => {
                const newMsg = generateMessage();
                
                // Update earnings from simulated superchats
                if (newMsg.meta.superchat && newMsg.meta.amount) {
                    setSessionEarnings(curr => curr + (newMsg.meta.amount || 0));
                }

                const updated = [...prev, newMsg];
                if (updated.length > 50) return updated.slice(updated.length - 50); // Keep last 50
                return updated;
            });
            
            // Randomly update current viewers
            const baseViewers = 350;
            const variance = Math.floor(Math.random() * 20) - 10;
            const newViewers = Math.max(0, baseViewers + variance + streamDuration); // Slight growth over time
            setCurrentViewers(newViewers);
            setPeakViewers(prev => Math.max(prev, newViewers));

        }, Math.random() * 1500 + 500); // Random interval between 0.5s and 2s

        // Duration Timer
        timerInterval = setInterval(() => {
            setStreamDuration(prev => prev + 1);
        }, 1000);

        // Geo Simulation
        viewerLocationInterval.current = setInterval(() => {
            setViewerLocations(prev => prev.map(loc => ({
                ...loc,
                count: Math.max(0, loc.count + Math.floor(Math.random() * 5) - 2)
            })).sort((a,b) => b.count - a.count));
        }, 3000);
    }

    return () => {
        clearInterval(interval);
        clearInterval(timerInterval);
        if (viewerLocationInterval.current) clearInterval(viewerLocationInterval.current);
    };
  }, [activeStream, streamDuration]);

  // Cleanup Stream on Unmount
  useEffect(() => {
      return () => {
          if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
          }
      };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatMessages]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewMedia({ ...newMedia, file: ev.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePostMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title || !newMedia.file) {
      alert("Please provide a title and video file.");
      return;
    }

    addMedia({
      title: newMedia.title,
      type: newMedia.type,
      category: newMedia.category,
      url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // Mock URL
      thumbnail: 'https://picsum.photos/300/200?random=' + Math.floor(Math.random() * 1000),
      author: 'Você',
      isLive: false
    });
    setIsUploadModalOpen(false);
    setNewMedia({ title: '', category: 'Humor', file: '', type: MediaType.SHORT });
    alert("Conteúdo postado com sucesso! Ganhos automáticos ativados.");
  };

  // Live Stream Handlers
  const togglePlatform = (id: string) => {
      setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
  };

  const handlePlatformSelection = (name: string) => {
      setLiveForm(prev => {
          const exists = prev.platforms.includes(name);
          return {
              ...prev,
              platforms: exists ? prev.platforms.filter(p => p !== name) : [...prev.platforms, name]
          };
      });
  };

  // --- Fluxx Stream Logic Functions ---

  const generateKeys = () => {
      const segment = () => Math.random().toString(36).substr(2, 4).toUpperCase();
      const key = `FLUXX-${segment()}-${segment()}-${segment()}`;
      setGeneratedStreamKey(key);
      setStreamStep('PREVIEW');
  };

  const requestPermissions = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          if (previewVideoRef.current) {
              previewVideoRef.current.srcObject = stream;
          }
          setHasPermissions(true);
      } catch (err) {
          console.error("Permissions denied", err);
          alert("Permissão de câmera/microfone negada. Verifique as configurações do navegador.");
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      alert('Copiado para área de transferência!');
  };

  const startLive = () => {
      if(!liveForm.title) { alert('Digite um título para a live'); return; }
      
      const newLive: LiveStreamSession = {
          id: `live-${Date.now()}`,
          title: liveForm.title,
          thumbnail: liveForm.thumbnail || 'https://picsum.photos/300/200?random=live',
          startTime: new Date().toISOString(),
          status: 'live',
          viewers: 0,
          platforms: ['Fluxx Stream', ...liveForm.platforms],
          earnings: 0
      };
      
      setActiveStream(newLive);
      
      // Add to global feed so it appears in the app
      addMedia({
          title: newLive.title,
          type: MediaType.VIDEO,
          isLive: true,
          category: liveForm.category,
          thumbnail: newLive.thumbnail,
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Mock URL for viewers
          author: 'Você'
      });

      setChatMessages([]); // Reset chat
      setStreamDuration(0);
      setSessionEarnings(0);
      setPeakViewers(0);
      setCurrentViewers(0);
      setIsLiveModalOpen(false);
      setStreamStep('SETUP'); // Reset wizard
      
      alert('Transmissão iniciada! Agregador de chat ativado.');
  };

  const stopLive = () => {
      if(!activeStream) return;
      const endedLive = { ...activeStream, status: 'ended' as const, endTime: new Date().toISOString(), earnings: sessionEarnings };
      setRecentLives(prev => [endedLive, ...prev]);
      setActiveStream(null);
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
      }
  };

  // --- Streamer Tools Logic ---
  const handleStreamerAction = (message: string) => {
      const systemMsg: ChatMessage = {
          id: `sys-${Date.now()}`,
          plataforma: 'Fluxx Stream',
          canal_id: activeStream?.id || '',
          usuario: 'Fluxx Official (Você)',
          usuario_id: 'u-me',
          avatar: 'https://i.pravatar.cc/150?u=me',
          mensagem: message,
          hora_utc: new Date().toISOString(),
          lingua: 'pt',
          meta: { like_count: 0, superchat: false, reacao: null, priority: 'sistema' }
      };
      setChatMessages(prev => [...prev, systemMsg]);
  };

  const handleDashboardChatSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!dashboardChatInput.trim()) return;
      handleStreamerAction(dashboardChatInput);
      setDashboardChatInput('');
  };

  const handleFixLink = () => {
      if(!linkTitle.trim() || !linkUrl.trim()) {
          alert("Preencha título e URL");
          return;
      }
      handleStreamerAction(`🔗 ${linkTitle.toUpperCase()}\nClique aqui: ${linkUrl}`);
  };

  const updateSavedMessage = (index: number, text: string) => {
      const newMsgs = [...savedMessages];
      newMsgs[index] = text;
      setSavedMessages(newMsgs);
  };

  const sendSavedMessage = (index: number) => {
      const msg = savedMessages[index];
      if(msg.trim()) handleStreamerAction(msg);
  };
  
  const sendCustomQuickMessage = () => {
      if(customQuickMessage.trim()) {
          handleStreamerAction(customQuickMessage);
          setCustomQuickMessage('');
      }
  };

  const handleGiveaway = () => {
      if(chatMessages.length === 0) {
          alert("Precisa ter gente no chat para sortear!");
          return;
      }
      const eligibleUsers = chatMessages.filter(m => m.usuario_id !== 'u-me').map(m => m.usuario);
      const uniqueUsers = Array.from(new Set(eligibleUsers));
      
      if(uniqueUsers.length === 0) {
           alert("Nenhum espectador elegível encontrado.");
           return;
      }

      const winner = uniqueUsers[Math.floor(Math.random() * uniqueUsers.length)];
      handleStreamerAction(`🎉 SORTEIO AO VIVO!\n👤 ${winner} foi o sorteado!\n🎊 Parabéns! Entre em contato para resgatar.`);
  };

  const handleProductAnnounce = (p: Product) => {
      if (!activeStream) {
          alert("Você precisa iniciar uma transmissão para enviar produtos ao chat.");
          return;
      }
      const priceReal = (p.price / 10).toFixed(2).replace('.', ',');
      const msg = `🛒 Produto disponível agora!\n📦 ${p.name}\n💰 R$ ${priceReal}\n🔗 Compre aqui: fluxx.com/shop/${p.id}`;
      handleStreamerAction(msg);
  };


  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-brand-100 dark:border-brand-900/30 relative overflow-hidden">
             <div className="relative z-10">
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Saldo Total</p>
                 <h2 className="text-4xl font-black text-brand-600 dark:text-brand-500">{userStats.protoStreamBalance} PTS</h2>
                 <p className="text-xs text-gray-400 mt-2">Ganho por Interações & Vendas</p>
             </div>
             <Coins className="absolute bottom-4 right-4 text-brand-100 dark:text-brand-900/20" size={64} />
         </div>

         <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
             <div className="relative z-10">
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Carteira (R$)</p>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white">R$ {userStats.walletBalance.toFixed(2)}</h2>
                 <p className="text-xs text-gray-400 mt-2">Disponível para saque</p>
             </div>
             <Wallet className="absolute bottom-4 right-4 text-gray-100 dark:text-gray-800" size={64} />
         </div>

         <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
             <div className="relative z-10">
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">Nível</p>
                 <h2 className="text-4xl font-black text-blue-500">Lvl {userStats.level}</h2>
                 <p className="text-xs text-gray-400 mt-2">{userStats.badges.length} Badges Desbloqueadas</p>
             </div>
             <TrendingUp className="absolute bottom-4 right-4 text-blue-100 dark:text-blue-900/20" size={64} />
         </div>
      </div>
      
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg dark:text-white">Últimas Atividades</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {userStats.transactions.slice(0, 5).map(t => (
                <div key={t.id} className="p-4 flex justify-between items-center">
                    <div>
                        <p className="font-medium dark:text-white">{t.description}</p>
                        <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`font-bold ${t.type === 'EARN' || t.type === 'SALE' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                        {t.type === 'EARN' || t.type === 'SALE' ? '+' : '-'}{t.amount} PTS
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderContentManager = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold dark:text-white">Gerenciar Conteúdo</h2>
                <p className="text-gray-500">Poste vídeos ou shorts e ganhe 10 PTS a cada 60s de visualização.</p>
            </div>
            <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg"
            >
                <Plus size={20} /> Postar Novo
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-dark-card rounded-full text-purple-600"><Eye size={24} /></div>
                <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total Visualizações</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalViews}</h3>
                </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-dark-card rounded-full text-green-600"><Coins size={24} /></div>
                <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Ganhos com Conteúdo</p>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalContentEarnings} PTS</h3>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myContent.length > 0 ? myContent.map(item => (
                <div key={item.id} className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className={`relative ${item.type === MediaType.SHORT ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200`}>
                        <img src={item.thumbnail} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold uppercase">
                            {item.type}
                        </div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold dark:text-white truncate">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-green-500 font-bold text-sm">+{item.earnings || 0} PTS</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs">{item.views} views</span>
                                <button onClick={() => deleteMedia(item.id)} className="text-red-400 hover:text-red-600">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 dark:bg-dark-card rounded-xl">
                    <Film size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Você ainda não postou nenhum conteúdo.</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderLivesManager = () => (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-900/10 p-6 rounded-2xl border border-brand-500/20">
              <div>
                  <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                      <Signal className="text-red-500" /> Fluxx Stream & Multi-Platform
                  </h2>
                  <p className="text-gray-500 mt-1">Transmita simultaneamente para Facebook, YouTube, Twitch e mais.</p>
              </div>
              {!activeStream && (
                <button 
                  onClick={() => setIsLiveModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg animate-pulse hover:animate-none transition-all"
                >
                    <Wifi size={20} /> 🔴 Iniciar Live
                </button>
              )}
          </div>

          {activeStream && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="space-y-6">
                      <div className="bg-gray-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col h-[520px]">
                          <div className="p-3 bg-black/40 flex justify-between items-center border-b border-gray-700">
                              <div className="flex items-center gap-2">
                                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                                  <span className="font-bold text-red-500 text-xs uppercase">Em Transmissão</span>
                              </div>
                              <button onClick={stopLive} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-bold">
                                  Encerrar
                              </button>
                          </div>
                          
                          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                              {streamRef.current ? (
                                  <video 
                                    ref={el => { if(el) el.srcObject = streamRef.current; }}
                                    autoPlay 
                                    muted 
                                    className="h-full w-auto aspect-[9/16] object-cover mx-auto"
                                  />
                              ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-500">
                                      <Monitor size={48} className="mb-2" />
                                      <p>Aguardando sinal RTMP...</p>
                                  </div>
                              )}
                              
                              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono border border-white/10 text-brand-400">
                                  MOBILE MODE (9:16) - LOCKED
                              </div>
                          </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center h-[100px]">
                          <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full">
                                  <Eye size={24} />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-gray-500 uppercase">Visualizações</p>
                                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{currentViewers}</h3>
                              </div>
                          </div>
                          <div className="text-right space-y-1">
                              <p className="text-[10px] text-gray-400">Pico: <span className="text-gray-900 dark:text-white font-bold">{peakViewers}</span></p>
                              <div className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">
                                  <Clock size={10} /> {formatDuration(streamDuration)}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="h-[520px] flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                          <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-dark-surface">
                              <h3 className="font-bold dark:text-white flex items-center gap-2 text-sm">
                                  <MessageSquare size={16} className="text-brand-500" /> Chat Unificado
                              </h3>
                              <span className="text-[10px] text-gray-400">Agregando {activeStream.platforms.length} plataformas</span>
                          </div>

                          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50 dark:bg-black/20 text-sm">
                              {chatMessages.map((msg) => (
                                  <div key={msg.id} className={`flex gap-2 animate-in slide-in-from-left-2 duration-300 ${msg.meta.priority === 'alta' ? 'bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800' : ''}`}>
                                      <div className="shrink-0 relative">
                                          <img src={msg.avatar || 'https://i.pravatar.cc/150'} className="w-6 h-6 rounded-full object-cover" />
                                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-dark-card rounded-full p-0.5 shadow-sm">
                                              {msg.plataforma === 'YouTube' && <Youtube size={8} className="text-red-600" />}
                                              {msg.plataforma === 'Facebook' && <Facebook size={8} className="text-blue-600" />}
                                              {msg.plataforma === 'Instagram' && <Instagram size={8} className="text-pink-600" />}
                                              {msg.plataforma === 'TikTok' && <Music size={8} className="text-black dark:text-white" />}
                                              {msg.plataforma === 'Fluxx Stream' && <Activity size={8} className="text-brand-500" />}
                                          </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-0.5">
                                              <span className="font-bold text-[10px] text-gray-700 dark:text-gray-300 truncate">{msg.usuario}</span>
                                              {msg.meta.superchat && <span className="text-[8px] bg-yellow-400 text-yellow-900 px-1 rounded font-bold">SC {msg.meta.amount}</span>}
                                          </div>
                                          <p className="text-xs text-gray-800 dark:text-gray-200 leading-snug break-words whitespace-pre-wrap">{msg.mensagem}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>

                          <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-card">
                              <form onSubmit={handleDashboardChatSubmit} className="relative">
                                  <input 
                                    type="text" 
                                    value={dashboardChatInput}
                                    onChange={(e) => setDashboardChatInput(e.target.value)}
                                    placeholder="Responder..." 
                                    className="w-full pl-3 pr-8 py-2 rounded-full bg-gray-100 dark:bg-dark-surface text-xs outline-none dark:text-white" 
                                  />
                                  <button type="submit" className="absolute right-1 top-1 p-1 bg-brand-600 text-white rounded-full"><Send size={12} /></button>
                              </form>
                          </div>
                      </div>

                      <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 h-[100px]">
                          <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full">
                               <Coins size={24} />
                          </div>
                          <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Ganhos na Live</p>
                              <h3 className="text-2xl font-black text-brand-500">{sessionEarnings} PTS</h3>
                              <p className="text--[10px] text-gray-400">Shop, Doações, Stickers</p>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="h-[520px] flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                          <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface">
                               <button 
                                    onClick={() => setActiveToolTab('ACTIONS')}
                                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeToolTab === 'ACTIONS' ? 'text-brand-500 border-b-2 border-brand-500 bg-white dark:bg-dark-card' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card/50'}`}
                               >
                                    <Zap size={14} /> Ferramentas
                               </button>
                               <button 
                                    onClick={() => setActiveToolTab('STATS')}
                                    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${activeToolTab === 'STATS' ? 'text-brand-500 border-b-2 border-brand-500 bg-white dark:bg-dark-card' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-card/50'}`}
                               >
                                    <BarChart2 size={14} /> Dados
                               </button>
                          </div>
                          
                          <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-hide">
                               {activeToolTab === 'ACTIONS' ? (
                                    <>
                                        <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-800">
                                                <div className="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-400 font-bold text-xs uppercase">
                                                    <Link size={14} /> Fixar Link
                                                </div>
                                                <div className="space-y-2">
                                                    <input 
                                                        type="text" 
                                                        value={linkTitle}
                                                        onChange={(e) => setLinkTitle(e.target.value)}
                                                        placeholder="Título (Ex: Promoção)"
                                                        className="w-full px-2 py-1.5 rounded text-xs border border-purple-200 dark:border-purple-700 bg-white dark:bg-dark-surface dark:text-white outline-none focus:border-purple-500"
                                                    />
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={linkUrl}
                                                            onChange={(e) => setLinkUrl(e.target.value)}
                                                            placeholder="https://..."
                                                            className="flex-1 px-2 py-1.5 rounded text-xs border border-purple-200 dark:border-purple-700 bg-white dark:bg-dark-surface dark:text-white outline-none focus:border-purple-500"
                                                        />
                                                        <button 
                                                            onClick={handleFixLink}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded transition-colors"
                                                        >
                                                            <Send size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800">
                                                <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-bold text-xs uppercase">
                                                    <Tag size={14} /> Enviar Produto
                                                </div>
                                                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                                    {myProducts.slice(0, 3).map(p => (
                                                        <div key={p.id} onClick={(e) => { e.stopPropagation(); handleProductAnnounce(p); }} className="flex items-center gap-2 p-2 bg-white dark:bg-dark-surface hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded cursor-pointer transition-colors shadow-sm border border-gray-100 dark:border-gray-700">
                                                            <img src={p.images[0]} className="w-8 h-8 rounded object-cover" />
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] font-bold truncate dark:text-white">{p.name}</p>
                                                                <p className="text-[10px] text-brand-500 font-mono">{p.price} PTS</p>
                                                            </div>
                                                            <Send size={12} className="ml-auto text-blue-500" />
                                                        </div>
                                                    ))}
                                                    {myProducts.length === 0 && <span className="text-[10px] text-gray-400">Sem produtos.</span>}
                                                </div>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-800">
                                                <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400 font-bold text-xs uppercase">
                                                    <Zap size={14} /> Msgs Rápidas
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 mb-2">
                                                    {savedMessages.map((msg, idx) => (
                                                        <div key={idx} className="flex gap-1">
                                                            <input 
                                                                type="text" 
                                                                value={msg}
                                                                onChange={(e) => updateSavedMessage(idx, e.target.value)}
                                                                className="flex-1 px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface dark:text-white outline-none focus:border-green-500"
                                                            />
                                                            <button 
                                                                onClick={() => sendSavedMessage(idx)}
                                                                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors"
                                                                title="Enviar"
                                                            >
                                                                <Send size={10} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-2 border-t border-green-200 dark:border-green-800">
                                                    <p className="text-[9px] text-green-700 dark:text-green-400 font-bold mb-1">Nova Mensagem:</p>
                                                    <div className="flex gap-1">
                                                        <input 
                                                            type="text"
                                                            value={customQuickMessage}
                                                            onChange={(e) => setCustomQuickMessage(e.target.value)}
                                                            placeholder="Digite sua msg..."
                                                            className="flex-1 px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface dark:text-white outline-none focus:border-green-500"
                                                        />
                                                        <button 
                                                            onClick={sendCustomQuickMessage}
                                                            className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded transition-colors"
                                                        >
                                                            <Send size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                        </div>
                                    </>
                               ) : (
                                    <>
                                        <div className="bg-white dark:bg-dark-surface p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-1 mb-2 border-b border-gray-100 dark:border-gray-700 pb-1">
                                                    <Globe size={12} className="text-blue-500" />
                                                    <span className="text-[10px] font-bold uppercase text-gray-500">Cidades (Live)</span>
                                                </div>
                                                <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
                                                    {viewerLocations.map((loc, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[10px] bg-gray-50 dark:bg-dark-card p-1.5 rounded">
                                                            <div className="flex items-center gap-1 truncate">
                                                                <span>{loc.flag}</span>
                                                                <span className="dark:text-gray-300 truncate">{loc.city}</span>
                                                            </div>
                                                            <span className="font-bold text-brand-500">{loc.count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                        </div>

                                        <div className="bg-white dark:bg-dark-surface p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-1 mb-2">
                                                <Smartphone size={12} className="text-purple-500" />
                                                <span className="text-[10px] font-bold uppercase text-gray-500">Dispositivos</span>
                                            </div>
                                            <div className="flex items-center justify-between px-2">
                                                <div className="flex flex-col items-center">
                                                    <Smartphone size={16} className="text-purple-500 mb-1" />
                                                    <span className="text-xs font-bold dark:text-white">85%</span>
                                                    <span className="text-[9px] text-gray-400">Mobile</span>
                                                </div>
                                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                                                <div className="flex flex-col items-center">
                                                    <Monitor size={16} className="text-gray-400 mb-1" />
                                                    <span className="text-xs font-bold dark:text-white">15%</span>
                                                    <span className="text-[9px] text-gray-400">Desktop</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-dark-surface p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-1 mb-2">
                                                <Activity size={12} className="text-green-500" />
                                                <span className="text-[10px] font-bold uppercase text-gray-500">Origem do Tráfego</span>
                                            </div>
                                            <div className="space-y-2 px-1">
                                                <div className="flex items-center gap-2">
                                                    <Youtube size={12} className="text-red-500" />
                                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="w-[40%] h-full bg-red-500 rounded-full"></div>
                                                    </div>
                                                    <span className="text-[9px] font-mono dark:text-white w-6 text-right">40%</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Instagram size={12} className="text-pink-500" />
                                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="w-[30%] h-full bg-pink-500 rounded-full"></div>
                                                    </div>
                                                    <span className="text-[9px] font-mono dark:text-white w-6 text-right">30%</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Music size={12} className="text-black dark:text-white" />
                                                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="w-[20%] h-full bg-black dark:bg-white rounded-full"></div>
                                                    </div>
                                                    <span className="text-[9px] font-mono dark:text-white w-6 text-right">20%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                               )}
                          </div>

                          <div className="p-3 bg-gray-50 dark:bg-dark-surface border-t border-gray-100 dark:border-gray-700 text-center">
                              <p className="text-[9px] text-gray-400">Fluxx Stream v2.2</p>
                          </div>
                      </div>

                      <div className="h-[100px] bg-red-500 rounded-2xl shadow-lg border border-red-600 p-1 relative overflow-hidden group">
                           <button 
                                onClick={handleGiveaway}
                                className="w-full h-full flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                           >
                                <Gift size={28} className="mb-1 animate-bounce" />
                                <span className="text-sm font-black uppercase">Sortear Espectador</span>
                                <span className="text-[10px] opacity-80 mt-1">1 Clique • Automático</span>
                           </button>
                      </div>
                  </div>
              </div>
          )}

          {!activeStream && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                          <Cast size={20} className="text-brand-500" /> Conexões de Plataforma
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {platforms.map(platform => (
                              <div key={platform.id} className={`p-4 rounded-xl border transition-all ${platform.connected ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-700'}`}>
                                  <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-full ${platform.connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                              {platform.icon === 'Facebook' && <Facebook size={20} />}
                                              {platform.icon === 'Instagram' && <Instagram size={20} />}
                                              {platform.icon === 'YouTube' && <Youtube size={20} />}
                                              {platform.icon === 'Twitch' && <Twitch size={20} />}
                                              {platform.icon === 'TikTok' && <Music size={20} />}
                                              {platform.icon === 'Fluxx' && <Activity size={20} />}
                                              {platform.icon === 'Globe' && <Globe size={20} />}
                                          </div>
                                          <div>
                                              <h4 className="font-bold text-sm dark:text-white">{platform.name}</h4>
                                              <p className="text-xs text-gray-500">{platform.connected ? 'Conectado' : 'Desconectado'}</p>
                                          </div>
                                      </div>
                                      <div onClick={() => togglePlatform(platform.id)} className={`w-10 h-5 rounded-full cursor-pointer relative transition-colors ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`}>
                                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${platform.connected ? 'left-6' : 'left-1'}`}></div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                          <Clock size={20} className="text-gray-400" /> Lives Recentes
                      </h3>
                      <div className="space-y-3">
                          {recentLives.map(live => (
                              <div key={live.id} className="bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex gap-3">
                                  <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                      <img src={live.thumbnail} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-sm dark:text-white truncate">{live.title}</h4>
                                      <p className="text-xs text-gray-500">{new Date(live.startTime).toLocaleDateString()}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold">+{live.earnings} PTS</span>
                                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Eye size={10} /> {live.viewers}</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderShopManager = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold dark:text-white">Meus Anúncios</h2>
                <p className="text-gray-500">Gerencie seus produtos à venda. Custo por anúncio: 100 PTS.</p>
            </div>
        </div>

        <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white dark:bg-dark-card rounded-full text-orange-600"><ShoppingBag size={32} /></div>
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalSalesEarnings} PTS</h3>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Total em Vendas</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{myProducts.length}</p>
                <p className="text-sm text-gray-500">Anúncios Ativos</p>
            </div>
        </div>

        <div className="space-y-4">
            {myProducts.length > 0 ? myProducts.map(p => (
                <div key={p.id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                    <img src={p.images[0]} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-lg dark:text-white">{p.name}</h4>
                            <span className="font-bold text-brand-500">{p.price} PTS</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs font-bold text-gray-400">
                            <span>Categoria: {p.category}</span>
                            <span>Vendas: {p.soldCount || 0}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleProductAnnounce(p)}
                        className="self-center p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mr-2"
                        title="Divulgar no Chat"
                    >
                        <Megaphone size={20} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="self-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 size={20} />
                    </button>
                </div>
            )) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-dark-card rounded-xl">
                    <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Nenhum produto anunciado.</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold dark:text-white">Histórico de Compras</h2>
        <div className="space-y-3">
            {myPurchases.length > 0 ? myPurchases.map(t => (
                <div key={t.id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{t.description}</p>
                            <p className="text-xs text-gray-500">Vendedor ID: {t.relatedItemId ? 'Verificado' : 'Sistema'}</p>
                            <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-gray-900 dark:text-white mb-1">-{t.amount} PTS</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Concluído</span>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 dark:bg-dark-card rounded-xl">
                    <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Você ainda não fez nenhuma compra.</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="pb-24 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-card dark:to-black rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-brand-500 bg-gray-700 flex items-center justify-center text-4xl font-bold">
               C
            </div>
            <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">CANAL User</h1>
                <p className="text-gray-400">Membro desde 2024 • Lvl {userStats.level}</p>
            </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
        {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
            { id: 'channel', label: 'Canal', icon: Tv },
            { id: 'content', label: 'Meus Conteúdos', icon: Video },
            { id: 'lives', label: 'Minhas Lives', icon: Signal },
            { id: 'shop', label: 'Minha Loja', icon: ShoppingBag },
            { id: 'purchases', label: 'Minhas Compras', icon: ShoppingCart },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' 
                    : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
                <tab.icon size={20} /> {tab.label}
            </button>
        ))}
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'channel' && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><Channel /></div>}
      {activeTab === 'content' && renderContentManager()}
      {activeTab === 'lives' && renderLivesManager()}
      {activeTab === 'shop' && renderShopManager()}
      {activeTab === 'purchases' && renderPurchases()}

      {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
             <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Postar Novo Conteúdo</h3>
                <form onSubmit={handlePostMedia} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo de Conteúdo</label>
                        <select 
                            value={newMedia.type}
                            onChange={(e) => setNewMedia({...newMedia, type: e.target.value as MediaType})}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-surface dark:border-gray-600 dark:text-white"
                        >
                            <option value={MediaType.SHORT}>Short (Vídeo Curto)</option>
                            <option value={MediaType.VIDEO}>Vídeo (Longo)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                        <input 
                            type="text" 
                            required
                            value={newMedia.title}
                            onChange={(e) => setNewMedia({...newMedia, title: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-surface dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                        <select 
                            value={newMedia.category}
                            onChange={(e) => setNewMedia({...newMedia, category: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-dark-surface dark:border-gray-600 dark:text-white"
                        >
                            <option>Humor</option>
                            <option>Dança</option>
                            <option>Esportes</option>
                            <option>Vlog</option>
                            <option>Educação</option>
                            <option>Gameplay</option>
                            <option>Música</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Arquivo de Vídeo</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500 hover:text-brand-500 transition"
                        >
                            {newMedia.file ? (
                                <span className="text-green-500 font-bold">Arquivo Selecionado</span>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Video size={32} className="mb-2" />
                                    <span>Clique para selecionar</span>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsUploadModalOpen(false)} className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold">Cancelar</button>
                        <button type="submit" className="flex-1 py-2 bg-brand-600 text-white rounded-lg font-bold">Postar</button>
                    </div>
                </form>
             </div>
          </div>
      )}

      {isLiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
             <div className="bg-white dark:bg-dark-card p-0 rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Signal size={24} className="text-red-600" /> Fluxx Stream
                        </h3>
                        <p className="text-xs text-gray-500">Configuração de Transmissão Vertical (9:16)</p>
                    </div>
                    <button onClick={() => { setIsLiveModalOpen(false); setStreamStep('SETUP'); }} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {streamStep === 'SETUP' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título da Live</label>
                                    <input 
                                        type="text" 
                                        value={liveForm.title}
                                        onChange={(e) => setLiveForm({...liveForm, title: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border dark:bg-dark-surface dark:text-white mb-4 outline-none focus:ring-2 focus:ring-brand-500"
                                        placeholder="Ex: Gameplay de Sexta"
                                    />
                                    
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                                    <select 
                                        value={liveForm.category}
                                        onChange={(e) => setLiveForm({...liveForm, category: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border dark:bg-dark-surface dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                                    >
                                        <option>Geral</option>
                                        <option>Games</option>
                                        <option>Música</option>
                                        <option>IRL</option>
                                        <option>Educação</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Plataformas Conectadas</label>
                                    <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                                        {platforms.map(p => (
                                            <div key={p.id} 
                                                onClick={() => handlePlatformSelection(p.name)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${liveForm.platforms.includes(p.name) ? 'bg-green-50 border-green-500' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${liveForm.platforms.includes(p.name) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                                                    {liveForm.platforms.includes(p.name) && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <span className={`text-sm font-bold ${liveForm.platforms.includes(p.name) ? 'text-green-700' : 'text-gray-500'}`}>{p.name}</span>
                                                {p.connected && <span className="ml-auto text-[10px] bg-green-200 text-green-800 px-1.5 rounded">Linked</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400">Selecione onde deseja retransmitir.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {streamStep === 'PERMISSIONS' && (
                        <div className="flex flex-col items-center justify-center text-center py-8">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Camera size={40} />
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white mb-2">Permissões de Dispositivo</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                                O Fluxx Stream precisa de acesso à sua câmera e microfone para capturar o feed de vídeo. 
                                Certifique-se de permitir o acesso no navegador.
                            </p>
                            
                            {!hasPermissions ? (
                                <button 
                                    onClick={requestPermissions}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"
                                >
                                    <CheckCircle size={20} /> Solicitar Acesso
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="bg-green-100 text-green-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <CheckCircle size={18} /> Acesso Concedido
                                    </div>
                                    <p className="text-sm text-gray-400">Tudo pronto! Vamos gerar suas chaves.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {streamStep === 'KEYS' && (
                        <div className="space-y-6">
                             <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl flex items-start gap-3">
                                 <Lock className="text-yellow-600 shrink-0 mt-1" size={20} />
                                 <div>
                                     <h4 className="font-bold text-yellow-800 dark:text-yellow-500 text-sm">Chave de Transmissão Privada</h4>
                                     <p className="text-xs text-yellow-700 dark:text-yellow-600">Nunca compartilhe sua chave de stream. Ela permite que qualquer pessoa transmita no seu canal.</p>
                                 </div>
                             </div>

                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Servidor RTMP</label>
                                     <div className="flex gap-2">
                                         <input readOnly value={streamUrl} className="flex-1 px-4 py-3 rounded-xl border dark:bg-dark-surface dark:text-white bg-gray-100 text-gray-500" />
                                         <button onClick={() => copyToClipboard(streamUrl)} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl font-bold hover:bg-gray-300"><Copy size={18}/></button>
                                     </div>
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Chave da Stream</label>
                                     <div className="flex gap-2">
                                         <input readOnly value={generatedStreamKey || '•••• •••• ••••'} className="flex-1 px-4 py-3 rounded-xl border dark:bg-dark-surface dark:text-white bg-gray-100 text-gray-500 font-mono" />
                                         {generatedStreamKey ? (
                                              <button onClick={() => copyToClipboard(generatedStreamKey)} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl font-bold hover:bg-gray-300"><Copy size={18}/></button>
                                         ) : (
                                              <button onClick={generateKeys} className="bg-brand-600 text-white px-6 rounded-xl font-bold hover:bg-brand-700">Gerar</button>
                                         )}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {streamStep === 'PREVIEW' && (
                        <div className="flex flex-col items-center">
                            <div className="w-64 aspect-[9/16] bg-black rounded-2xl overflow-hidden mb-6 relative shadow-2xl border-4 border-gray-800">
                                <video ref={previewVideoRef} autoPlay muted className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <div className="bg-black/60 backdrop-blur p-2 rounded-full text-white"><Mic size={14}/></div>
                                    <div className="bg-black/60 backdrop-blur p-2 rounded-full text-white"><Camera size={14}/></div>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">PREVIEW</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-2">Verifique seu enquadramento e iluminação.</p>
                        </div>
                    )}

                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface flex justify-between">
                    {streamStep !== 'SETUP' && (
                        <button 
                            onClick={() => {
                                if(streamStep === 'PERMISSIONS') setStreamStep('SETUP');
                                if(streamStep === 'KEYS') setStreamStep('PERMISSIONS');
                                if(streamStep === 'PREVIEW') setStreamStep('KEYS');
                            }}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Voltar
                        </button>
                    )}
                    
                    <div className="ml-auto">
                        {streamStep === 'SETUP' && (
                            <button onClick={() => setStreamStep('PERMISSIONS')} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg">Continuar</button>
                        )}
                        {streamStep === 'PERMISSIONS' && (
                            <button disabled={!hasPermissions} onClick={() => setStreamStep('KEYS')} className="bg-brand-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg transition">Continuar</button>
                        )}
                        {streamStep === 'KEYS' && (
                            <button disabled={!generatedStreamKey} onClick={() => setStreamStep('PREVIEW')} className="bg-brand-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg transition">Ir para Preview</button>
                        )}
                        {streamStep === 'PREVIEW' && (
                            <button onClick={startLive} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 animate-pulse">🔴 Iniciar Transmissão</button>
                        )}
                    </div>
                </div>

             </div>
          </div>
      )}
    </div>
  );
};
