
import React, { useState } from 'react';
import { useApp } from '../context';
import { Radio, Plus, Trash2, Link, Image as ImageIcon, Play, Edit2, CheckCircle, XCircle } from '../components/Icons';
import { MediaType, MediaItem } from '../types';

export const AdminRadios: React.FC = () => {
  const { radios, addRadio, updateRadio, deleteRadio, playMedia } = useApp();
  
  // State for Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Hits',
    url: '',
    thumbnail: '',
    location: ''
  });

  const categories = ['Hits', 'Jazz', 'Pop', 'Rock', 'Classical', 'Adult Contemporary', 'Talk', 'News', 'Country', 'Gospel'];

  // Handler to load station into form for editing
  const handleEdit = (station: MediaItem) => {
    setEditingId(station.id);
    setFormData({
      title: station.title,
      subtitle: station.subtitle || '',
      category: station.category,
      url: station.url,
      thumbnail: station.thumbnail,
      location: station.location || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Hits',
      url: '',
      thumbnail: '',
      location: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      alert("Title and URL are required!");
      return;
    }

    if (editingId) {
      // Update existing
      updateRadio(editingId, {
        title: formData.title,
        subtitle: formData.subtitle || 'Custom Station',
        url: formData.url,
        thumbnail: formData.thumbnail || 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 1000),
        category: formData.category,
        location: formData.location || 'Unknown City'
      });
      setEditingId(null);
    } else {
      // Add new
      addRadio({
        title: formData.title,
        subtitle: formData.subtitle || 'Custom Station',
        type: MediaType.RADIO,
        url: formData.url,
        thumbnail: formData.thumbnail || 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 1000),
        category: formData.category,
        author: 'Admin',
        isLive: true,
        location: formData.location || 'Unknown City'
      });
    }

    // Reset Form
    setFormData({
      title: '',
      subtitle: '',
      category: 'Hits',
      url: '',
      thumbnail: '',
      location: ''
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this radio station?')) {
      deleteRadio(id);
      if (editingId === id) handleCancelEdit();
    }
  };

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Radio Manager</h1>
          <p className="text-gray-500 dark:text-gray-400">Register new external radio streams.</p>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-full text-brand-500">
          <Radio size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Registration/Edit Form */}
        <div className="lg:col-span-1">
          <div className={`bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border ${editingId ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-100 dark:border-gray-700'} sticky top-24 transition-all`}>
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold dark:text-white">{editingId ? 'Edit Station' : 'Register Station'}</h3>
               {editingId && (
                 <button onClick={handleCancelEdit} className="text-xs text-gray-500 hover:text-red-500">Cancel</button>
               )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Station Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mega Hits FM"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre/Tagline</label>
                <input 
                  type="text" 
                  placeholder="e.g. Best of 80s"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City/Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Criciúma, SC"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Link size={14} /> Stream URL (MP3/HLS)
                </label>
                <input 
                  type="url" 
                  placeholder="https://stream.example.com/radio.mp3"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <ImageIcon size={14} /> Logo URL (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50 dark:bg-dark-surface dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className={`w-full text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-brand-600 hover:bg-brand-700'}`}
              >
                {editingId ? <CheckCircle size={20} /> : <Plus size={20} />}
                {editingId ? 'Save Changes' : 'Add Station'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Radios List */}
        <div className="lg:col-span-2">
           <h3 className="text-xl font-bold mb-4 dark:text-white px-1">Active Stations ({radios.length})</h3>
           <div className="space-y-3">
             {radios.map((station) => (
               <div key={station.id} className={`flex items-center bg-white dark:bg-dark-card p-3 rounded-xl border shadow-sm transition-all ${editingId === station.id ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-gray-100 dark:border-gray-700'}`}>
                  <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0 relative group cursor-pointer" onClick={() => playMedia(station)}>
                    <img src={station.thumbnail} alt={station.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-white fill-current" />
                    </div>
                  </div>
                  
                  <div className="flex-1 px-4 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{station.title}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate mb-1">
                      {station.location || 'Unknown Location'} • {station.category}
                    </p>
                    <p className="text-[10px] text-gray-300 truncate font-mono">{station.url}</p>
                  </div>

                  <div className="flex flex-col gap-2 ml-2">
                    <button 
                        onClick={() => handleEdit(station)}
                        className={`p-2 rounded-lg transition ${editingId === station.id ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                    >
                        <Edit2 size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(station.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};
