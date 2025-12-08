import React, { useState } from 'react';
import { useApp } from '../context';
import { Video, Film, Mic, Trash2, Plus, Play, Image as ImageIcon, Link, Music, Radio } from '../components/Icons';
import { MediaType } from '../types';

export const AdminVideos: React.FC = () => {
  const { videos, audios, addMedia, deleteMedia } = useApp();
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'AUDIO'>('VIDEO');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Geral',
    url: '',
    thumbnail: '',
    type: MediaType.VIDEO,
    isLive: false
  });

  const allMedia = activeTab === 'VIDEO' ? videos : audios;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedia({
      ...formData,
      author: 'Fluxx Official'
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Geral',
      url: '',
      thumbnail: '',
      type: MediaType.VIDEO,
      isLive: false
    });
    alert("Conteúdo adicionado com sucesso!");
  };

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gerenciar Mídia</h1>
          <p className="text-gray-500 dark:text-gray-400">Adicione ou remova Vídeos, Shorts, Lives e Áudios oficiais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} /> Adicionar Mídia
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-1">
        <button 
          onClick={() => setActiveTab('VIDEO')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'VIDEO' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Video size={18} /> Vídeos & Shorts
        </button>
        <button 
          onClick={() => setActiveTab('AUDIO')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'AUDIO' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          <Mic size={18} /> Áudios & Podcasts
        </button>
      </div>

      {/* Media List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allMedia.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 group hover:shadow-lg transition-all">
            <div className={`relative ${item.type === MediaType.SHORT ? 'aspect-[9/16]' : 'aspect-video'} bg-gray-200 dark:bg-gray-800`}>
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                 <span className="bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-bold uppercase border border-white/20">{item.type}</span>
                 {item.isLive && <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold animate-pulse">LIVE</span>}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                 <Play size={32} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white truncate mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500 mb-4">{item.category} • {item.author || 'Fluxx Official'}</p>
              
              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                 <div className="text-xs text-brand-500 font-bold flex items-center gap-1">
                    <Play size={12} /> {item.views || 0}
                 </div>
                 <button 
                    onClick={() => { if(window.confirm('Deletar este conteúdo permanentemente?')) deleteMedia(item.id); }}
                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Delete Media"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
           <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Adicionar Novo Conteúdo</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título</label>
                    <input 
                       required
                       type="text" 
                       value={formData.title}
                       onChange={e => setFormData({...formData, title: e.target.value})}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                       placeholder="Ex: Highlights da Semana"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                       <select 
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value as MediaType})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                       >
                          <option value={MediaType.VIDEO}>Vídeo</option>
                          <option value={MediaType.SHORT}>Short</option>
                          <option value={MediaType.LIVE_TV}>Live</option>
                          <option value={MediaType.AUDIO}>Música</option>
                          <option value={MediaType.PODCAST}>Podcast</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                       <input 
                          type="text" 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                          placeholder="Ex: Esportes"
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                       <Link size={14} /> URL da Mídia
                    </label>
                    <input 
                       required
                       type="url" 
                       placeholder="https://..."
                       value={formData.url}
                       onChange={e => setFormData({...formData, url: e.target.value})}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                       <ImageIcon size={14} /> URL da Thumbnail
                    </label>
                    <input 
                       type="url" 
                       placeholder="https://..."
                       value={formData.thumbnail}
                       onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                 </div>

                 <div className="flex items-center gap-2 bg-gray-50 dark:bg-dark-surface p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <input 
                       type="checkbox" 
                       id="isLive"
                       checked={formData.isLive}
                       onChange={e => setFormData({...formData, isLive: e.target.checked})}
                       className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                    />
                    <label htmlFor="isLive" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">É uma transmissão ao vivo?</label>
                 </div>

                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancelar</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-600/30 transition">Salvar</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};