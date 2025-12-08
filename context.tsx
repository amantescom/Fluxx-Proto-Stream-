
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem, UserStats, User, Transaction, Product, MediaType, CartItem, SystemSettings, Ticket } from './types';
import { MOCK_USERS, RADIO_STATIONS, MOCK_PRODUCTS, VIDEOS as INITIAL_VIDEOS, AUDIOS as INITIAL_AUDIOS } from './constants';

interface AppContextType {
  activeMedia: MediaItem | null;
  isPlaying: boolean;
  playMedia: (media: MediaItem) => void;
  togglePlay: () => void;
  closePlayer: () => void;
  userStats: UserStats;
  addPoints: (amount: number) => void;
  earnProtoStream: (amount: number, description: string) => void;
  processMediaReward: (media: MediaItem) => void;
  unlockShop: () => boolean;
  buyProduct: (product: Product) => boolean;
  handleInteraction: (type: 'like' | 'share' | 'comment') => void;
  toggleFavorite: (id: string) => void;
  darkMode: boolean;
  toggleTheme: () => void;
  
  // Admin & System Data
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  
  users: User[];
  addUser: (user: Omit<User, 'id' | 'joinDate'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  adminAdjustBalance: (userId: string, amount: number, type: 'PS' | 'REAL', reason: string) => void;
  
  radios: MediaItem[];
  addRadio: (radio: Omit<MediaItem, 'id'>) => void;
  updateRadio: (id: string, updates: Partial<MediaItem>) => void;
  deleteRadio: (id: string) => void;
  
  videos: MediaItem[];
  audios: MediaItem[];
  addMedia: (media: Omit<MediaItem, 'id'>) => void;
  deleteMedia: (id: string) => void;
  approveMedia: (id: string, status: 'approved' | 'rejected') => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating'>) => boolean;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string, status: 'approved' | 'rejected') => void;
  
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  unlockedSellers: string[];
  unlockSellerContact: (productId: string) => boolean;
  
  deposit: (amountPS: number) => void;
  withdraw: (amountReal: number) => boolean;
  exchangeProtoToReal: (amountPS: number) => boolean;

  tickets: Ticket[];
  resolveTicket: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STATS: 'fluxx_db_stats_v3',
  THEME: 'fluxx_db_theme_v1',
  USERS: 'fluxx_db_users_v1',
  RADIOS: 'fluxx_db_radios_v2',
  VIDEOS: 'fluxx_db_videos_v3',
  AUDIOS: 'fluxx_db_audios_v2',
  PRODUCTS: 'fluxx_db_products_v3',
  CART: 'fluxx_db_cart_v1',
  UNLOCKED_SELLERS: 'fluxx_db_unlocked_v1',
  SETTINGS: 'fluxx_db_settings_v1',
  TICKETS: 'fluxx_db_tickets_v1'
};

const DEFAULT_STATS: UserStats = {
  points: 1250,
  protoStreamBalance: 200,
  walletBalance: 0.00,
  level: 5,
  watchedMinutes: 420,
  streakDays: 3,
  badges: ['Early Adopter'],
  favorites: [],
  isShopUnlocked: false,
  transactions: [
    { id: 't-init', type: 'EARN', amount: 200, description: 'Welcome Bonus', date: new Date().toISOString() }
  ]
};

const DEFAULT_SETTINGS: SystemSettings = {
  rewardPerMinute: 10,
  adCost: 100,
  shopUnlockCost: 100,
  conversionRate: 10,
  maintenanceMode: false
};

const CURRENT_USER_ID = 'u-me';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.THEME) || 'true'); } catch { return true; }
  });
  
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch { return DEFAULT_STATS; }
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || JSON.stringify(MOCK_USERS)); } catch { return MOCK_USERS; }
  });

  const [radios, setRadios] = useState<MediaItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.RADIOS) || JSON.stringify(RADIO_STATIONS)); } catch { return RADIO_STATIONS; }
  });

  const [videos, setVideos] = useState<MediaItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIDEOS) || JSON.stringify(INITIAL_VIDEOS)); } catch { return INITIAL_VIDEOS; }
  });

  const [audios, setAudios] = useState<MediaItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIOS) || JSON.stringify(INITIAL_AUDIOS)); } catch { return INITIAL_AUDIOS; }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || JSON.stringify(MOCK_PRODUCTS)); } catch { return MOCK_PRODUCTS; }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
     try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TICKETS) || '[]'); } catch { return []; }
  });

  const [cart, setCart] = useState<CartItem[]>(() => []);
  const [unlockedSellers, setUnlockedSellers] = useState<string[]>([]);

  // Persistence
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(userStats)); }, [userStats]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(darkMode)); 
    if (darkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }, [darkMode]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RADIOS, JSON.stringify(radios)); }, [radios]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIOS, JSON.stringify(audios)); }, [audios]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(systemSettings)); }, [systemSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets)); }, [tickets]);

  // --- Logic ---

  const updateSystemSettings = (updates: Partial<SystemSettings>) => setSystemSettings(prev => ({ ...prev, ...updates }));

  const playMedia = (media: MediaItem) => { setActiveMedia(media); setIsPlaying(true); };
  const togglePlay = () => setIsPlaying(prev => !prev);
  const closePlayer = () => { setIsPlaying(false); setActiveMedia(null); };

  const earnProtoStream = (amount: number, description: string) => {
    setUserStats(prev => ({
      ...prev,
      protoStreamBalance: prev.protoStreamBalance + amount,
      transactions: [{ id: `t-${Date.now()}`, type: 'EARN', amount, description, date: new Date().toISOString() }, ...prev.transactions]
    }));
  };

  const processMediaReward = (media: MediaItem) => {
    // Reward Viewer
    earnProtoStream(systemSettings.rewardPerMinute, `Assistiu 60s: ${media.title}`);

    // Update Media Stats
    const updateStats = (list: MediaItem[], setter: React.Dispatch<React.SetStateAction<MediaItem[]>>) => {
        setter(prev => prev.map(item => item.id === media.id ? { ...item, views: (item.views || 0) + 1, earnings: (item.earnings || 0) + systemSettings.rewardPerMinute } : item));
    };
    if (media.type === MediaType.VIDEO || media.type === MediaType.SHORT || media.type === MediaType.LIVE_TV) updateStats(videos, setVideos);
    else if (media.type === MediaType.AUDIO || media.type === MediaType.PODCAST) updateStats(audios, setAudios);

    // Reward Creator (Simulated if it's the current user)
    if (media.ownerId === CURRENT_USER_ID) {
        setTimeout(() => earnProtoStream(systemSettings.rewardPerMinute, `Seu conteúdo rendeu: ${media.title}`), 500); 
    }
  };

  const deposit = (amountPS: number) => {
    const costInReal = amountPS / systemSettings.conversionRate; 
    setUserStats(prev => ({
      ...prev,
      protoStreamBalance: prev.protoStreamBalance + amountPS,
      transactions: [{ id: `t-${Date.now()}`, type: 'DEPOSIT', amount: amountPS, description: `Recarga (R$ ${costInReal.toFixed(2)})`, date: new Date().toISOString() }, ...prev.transactions]
    }));
  };

  const withdraw = (amountReal: number): boolean => {
    if (userStats.walletBalance >= amountReal) {
        setUserStats(prev => ({
            ...prev,
            walletBalance: prev.walletBalance - amountReal,
            transactions: [{ id: `t-${Date.now()}`, type: 'WITHDRAW', amount: 0, description: `Saque: R$ ${amountReal.toFixed(2)}`, date: new Date().toISOString() }, ...prev.transactions]
        }));
        return true;
    }
    return false;
  };

  const exchangeProtoToReal = (amountPS: number): boolean => {
    if (userStats.protoStreamBalance >= amountPS) {
        const amountReal = amountPS / systemSettings.conversionRate;
        setUserStats(prev => ({
            ...prev,
            protoStreamBalance: prev.protoStreamBalance - amountPS,
            walletBalance: prev.walletBalance + amountReal,
            transactions: [{ id: `t-${Date.now()}`, type: 'EXCHANGE', amount: amountPS, description: `Conversão: ${amountPS} PS -> R$ ${amountReal.toFixed(2)}`, date: new Date().toISOString() }, ...prev.transactions]
        }));
        return true;
    }
    return false;
  };

  const buyProduct = (product: Product): boolean => {
    if (userStats.protoStreamBalance >= product.price) {
      setUserStats(prev => ({
        ...prev,
        protoStreamBalance: prev.protoStreamBalance - product.price,
        transactions: [{ id: `t-${Date.now()}`, type: 'PURCHASE', amount: product.price, description: `Compra: ${product.name}`, date: new Date().toISOString(), relatedItemId: product.id }, ...prev.transactions]
      }));
      if (product.seller.id === CURRENT_USER_ID) {
          setTimeout(() => setUserStats(prev => ({ ...prev, protoStreamBalance: prev.protoStreamBalance + product.price, transactions: [{ id: `t-${Date.now()}-sale`, type: 'SALE', amount: product.price, description: `Venda: ${product.name}`, date: new Date().toISOString(), relatedItemId: product.id }, ...prev.transactions] })), 500);
      }
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, soldCount: (p.soldCount || 0) + 1 } : p));
      return true;
    }
    return false;
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'rating'>): boolean => {
    if (userStats.protoStreamBalance < systemSettings.adCost) return false;
    setUserStats(prev => ({
        ...prev,
        protoStreamBalance: prev.protoStreamBalance - systemSettings.adCost,
        transactions: [{ id: `t-${Date.now()}`, type: 'SPEND', amount: systemSettings.adCost, description: 'Taxa de Anúncio', date: new Date().toISOString() }, ...prev.transactions]
    }));
    const product: Product = { ...newProduct, id: `p-${Date.now()}`, rating: 0, isNew: true, soldCount: 0, status: 'pending', seller: { id: CURRENT_USER_ID, name: 'Você', avatar: 'https://i.pravatar.cc/150?u=me', rating: 5, contactInfo: 'Desbloqueado' } };
    setProducts(prev => [product, ...prev]);
    return true;
  };

  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  const approveProduct = (id: string, status: 'approved' | 'rejected') => setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));

  const unlockShop = (): boolean => {
    if (userStats.protoStreamBalance >= systemSettings.shopUnlockCost) {
      setUserStats(prev => ({ ...prev, protoStreamBalance: prev.protoStreamBalance - systemSettings.shopUnlockCost, isShopUnlocked: true, transactions: [{ id: `t-${Date.now()}`, type: 'SPEND', amount: systemSettings.shopUnlockCost, description: 'Desbloqueio Shop', date: new Date().toISOString() }, ...prev.transactions] }));
      return true;
    }
    return false;
  };

  const unlockSellerContact = (productId: string): boolean => {
    if (unlockedSellers.includes(productId)) return true;
    if (userStats.protoStreamBalance >= 100) {
       setUserStats(prev => ({ ...prev, protoStreamBalance: prev.protoStreamBalance - 100, transactions: [{ id: `t-${Date.now()}`, type: 'SPEND', amount: 100, description: 'Contato Vendedor', date: new Date().toISOString() }, ...prev.transactions] }));
      setUnlockedSellers(prev => [...prev, productId]);
      return true;
    }
    return false;
  };

  const addToCart = (product: Product) => setCart(prev => [...prev, { ...product, cartId: `c-${Date.now()}` }]);
  const removeFromCart = (cartId: string) => setCart(prev => prev.filter(item => item.cartId !== cartId));

  const addMedia = (media: Omit<MediaItem, 'id'>) => {
      const newItem: MediaItem = { ...media, id: `m-${Date.now()}`, ownerId: CURRENT_USER_ID, views: 0, earnings: 0, status: 'pending' };
      if (media.type === MediaType.VIDEO || media.type === MediaType.SHORT || media.type === MediaType.LIVE_TV) setVideos(prev => [newItem, ...prev]);
      else if (media.type === MediaType.AUDIO || media.type === MediaType.PODCAST) setAudios(prev => [newItem, ...prev]);
  };

  const deleteMedia = (id: string) => { setVideos(prev => prev.filter(v => v.id !== id)); setAudios(prev => prev.filter(a => a.id !== id)); };
  const approveMedia = (id: string, status: 'approved' | 'rejected') => {
      setVideos(prev => prev.map(v => v.id === id ? { ...v, status } : v));
      setAudios(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Admin User Logic
  const addUser = (u: any) => setUsers(prev => [...prev, { ...u, id: `u-${Date.now()}` }]);
  const updateUser = (id: string, u: any) => setUsers(prev => prev.map(x => x.id === id ? { ...x, ...u } : x));
  const deleteUser = (id: string) => setUsers(prev => prev.filter(x => x.id !== id));
  
  const adminAdjustBalance = (userId: string, amount: number, type: 'PS' | 'REAL', reason: string) => {
      setUsers(prev => prev.map(u => {
          if (u.id === userId) {
              return { 
                  ...u, 
                  protoStreamBalance: type === 'PS' ? u.protoStreamBalance + amount : u.protoStreamBalance,
                  walletBalance: type === 'REAL' ? u.walletBalance + amount : u.walletBalance
              };
          }
          return u;
      }));
      // If adjusting SELF
      if (userId === CURRENT_USER_ID) {
          setUserStats(prev => ({
              ...prev,
              protoStreamBalance: type === 'PS' ? prev.protoStreamBalance + amount : prev.protoStreamBalance,
              walletBalance: type === 'REAL' ? prev.walletBalance + amount : prev.walletBalance,
              transactions: [{ id: `t-adj-${Date.now()}`, type: 'ADJUSTMENT', amount: amount, description: `Ajuste Admin: ${reason}`, date: new Date().toISOString() }, ...prev.transactions]
          }));
      }
  };

  const addRadio = (r: any) => setRadios(prev => [{ ...r, id: `r-${Date.now()}` }, ...prev]);
  const updateRadio = (id: string, r: any) => setRadios(prev => prev.map(x => x.id === id ? { ...x, ...r } : x));
  const deleteRadio = (id: string) => setRadios(prev => prev.filter(x => x.id !== id));

  // Support
  const resolveTicket = (id: string) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));

  // Misc
  const addPoints = (amount: number) => { setUserStats(prev => ({ ...prev, points: prev.points + amount })); };
  const handleInteraction = (type: 'like' | 'share' | 'comment') => { earnProtoStream(2, `Interaction: ${type}`); };
  const toggleFavorite = (id: string) => { setUserStats(prev => ({ ...prev, favorites: prev.favorites.includes(id) ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id] })); };
  const toggleTheme = () => setDarkMode(prev => !prev);

  // Init mock tickets if empty
  useEffect(() => {
      if (tickets.length === 0) {
          setTickets([
              { id: 't1', userId: 'u-1', userName: 'Alice', subject: 'Problema com saque', status: 'Open', date: new Date().toISOString() },
              { id: 't2', userId: 'u-2', userName: 'Bob', subject: 'Reportar conteúdo', status: 'Closed', date: new Date().toISOString() }
          ]);
      }
  }, []);

  return (
    <AppContext.Provider value={{
      activeMedia, isPlaying, playMedia, togglePlay, closePlayer,
      userStats, addPoints, earnProtoStream, processMediaReward,
      unlockShop, buyProduct, handleInteraction, toggleFavorite,
      darkMode, toggleTheme,
      systemSettings, updateSystemSettings,
      users, addUser, updateUser, deleteUser, adminAdjustBalance,
      radios, addRadio, updateRadio, deleteRadio,
      videos, audios, addMedia, deleteMedia, approveMedia,
      products, addProduct, deleteProduct, approveProduct, cart, addToCart, removeFromCart, unlockedSellers, unlockSellerContact,
      deposit, withdraw, exchangeProtoToReal,
      tickets, resolveTicket
    }}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-brand-50 text-gray-900 dark:bg-dark-bg dark:text-white min-h-screen transition-colors duration-300">
          {children}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
