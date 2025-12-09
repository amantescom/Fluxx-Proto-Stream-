
import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { 
  User, Wallet, Coins, TrendingUp, Settings, ShoppingBag, Lock, Unlock, 
  Video, Plus, BarChart2, Eye, Trash2, ShoppingCart, Film, Play 
} from '../components/Icons';
import { MediaType } from '../types';

type Tab = 'overview' | 'content' | 'shop' | 'purchases';

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

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Wallet Summary */}
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
      
      {/* Recent Activity */}
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

        {/* Stats */}
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

        {/* List */}
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

  const renderShopManager = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold dark:text-white">Meus Anúncios</h2>
                <p className="text-gray-500">Gerencie seus produtos à venda. Custo por anúncio: 100 PTS.</p>
            </div>
            {/* The actual button is in the Shop page, but we could link there */}
        </div>

        {/* Sales Stats */}
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

        {/* Product List */}
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
                    <button onClick={() => deleteProduct(p.id)} className="self-center p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
      
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar">
        {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart2 },
            { id: 'content', label: 'Meus Conteúdos', icon: Video },
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

      {/* Content Area */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'content' && renderContentManager()}
      {activeTab === 'shop' && renderShopManager()}
      {activeTab === 'purchases' && renderPurchases()}

      {/* Upload Modal (Universal for Video/Short) */}
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

    </div>
  );
};
