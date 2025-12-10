
import React, { useState } from 'react';
import { useApp } from '../context';
import { Play, Users, Bell, Search, Video, Mic, Share2, MoreVertical, Filter, Clock, TrendingUp, ShoppingBag, ShoppingCart, Film, MessageSquare, Star } from '../components/Icons';
import { MediaType, MediaItem } from '../types';
import { INTERVIEWS_LIST } from '../constants';

type ChannelTab = 'HOME' | 'SHOP' | 'VIDEOS' | 'AUDIOS' | 'REELS' | 'PODCAST' | 'INTERVIEW' | 'ABOUT';

export const Channel: React.FC = () => {
  const { userStats, videos, audios, products, playMedia, addToCart } = useApp();
  const [activeTab, setActiveTab] = useState<ChannelTab>('HOME');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Mock Channel Data
  const channelInfo = {
    name: 'Fluxx Official',
    handle: '@fluxx_stream',
    subscribers: '1.2M',
    videosCount: 458,
    description: 'O canal oficial da plataforma Fluxx. Trazendo o melhor do entretenimento, música, games e tecnologia. Vídeos novos toda semana!',
    banner: 'https://picsum.photos/1200/300?random=channel_banner',
    avatar: 'https://i.imgur.com/v8p5v9X.png',
    joinDate: 'Joined Oct 2023',
    location: 'Brasil'
  };

  // Content Filtering
  const allContent = [...videos, ...audios];
  
  // Specific Filters
  const myVideos = videos.filter(v => v.type === MediaType.VIDEO || v.type === MediaType.LIVE_TV);
  const myAudios = audios.filter(a => a.type === MediaType.AUDIO);
  const myShorts = videos.filter(v => v.type === MediaType.SHORT);
  const myPodcasts = audios.filter(a => a.type === MediaType.PODCAST);
  const myInterviews = [...INTERVIEWS_LIST, ...videos.filter(v => v.category === 'Entrevistas' || v.category === 'Business')];
  
  // Home Tab Content (Mix)
  const homeFeatured = myVideos[0] || allContent[0];
  const homeRecent = allContent.slice(0, 4);
  const homePopular = allContent.slice(4, 8);

  const renderVideoCard = (item: MediaItem) => (
    <div 
        key={item.id} 
        className="group cursor-pointer flex flex-col gap-2"
        onClick={() => playMedia(item)}
    >
        <div className={`relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 ${item.type === MediaType.SHORT ? 'aspect-[9/16]' : 'aspect-video'}`}>
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-brand-600/90 backdrop-blur-sm p-3 rounded-full text-white shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                    <Play size={24} fill="currentColor" />
                </div>
            </div>

            {item.type !== MediaType.SHORT && (
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '12:45'}
                </div>
            )}

            {item.isLive && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">
                    AO VIVO
                </div>
            )}
             {item.type === MediaType.SHORT && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  REELS
                </div>
             )}
        </div>
        <div>
            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight text-sm group-hover:text-brand-500 transition-colors">
                {item.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{item.views || 0} visualizações</span>
                <span className="mx-1">•</span>
                <span>há 2 dias</span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="pb-24"> 
      
      {/* 1. Channel Banner */}
      <div className="w-full h-40 md:h-64 lg:h-80 bg-gray-200 rounded-2xl relative overflow-hidden shadow-lg mb-6">
         <img src={channelInfo.banner} className="w-full h-full object-cover" alt="Channel Banner" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         
         {/* Social Links / Actions on Banner */}
         <div className="absolute bottom-4 right-4 flex gap-2">
             <button className="bg-black/40 hover:bg-black/60 backdrop-blur text-white p-2 rounded-full transition">
                <Share2 size={20} />
             </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-1">
          {/* 2. Channel Header Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 py-6 border-b border-gray-200 dark:border-gray-800">
              {/* Avatar */}
              <div className="relative -mt-16 md:-mt-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-dark-bg bg-gray-100 overflow-hidden shadow-lg">
                      <img src={channelInfo.avatar} className="w-full h-full object-cover" alt="Avatar" />
                  </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                      {channelInfo.name} <div className="bg-brand-500 text-white p-0.5 rounded-full"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                  </h1>
                  <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      <span className="font-bold text-gray-700 dark:text-gray-300">{channelInfo.handle}</span>
                      <span>•</span>
                      <span>{channelInfo.subscribers} inscritos</span>
                      <span>•</span>
                      <span>{channelInfo.videosCount} vídeos</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-1 md:line-clamp-2 max-w-2xl">
                      {channelInfo.description}
                  </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <button 
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${
                        isSubscribed 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300' 
                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20'
                    }`}
                  >
                      {isSubscribed ? (
                          <>Inscrito <Bell size={16} /></>
                      ) : (
                          'Inscrever-se'
                      )}
                  </button>
              </div>
          </div>

          {/* 3. Navigation Tabs */}
          <div className="flex overflow-x-auto gap-1 py-4 border-b border-gray-200 dark:border-gray-800 no-scrollbar sticky top-0 bg-gray-50/95 dark:bg-dark-bg/95 backdrop-blur z-20">
              {[
                  { id: 'HOME', label: 'Início' },
                  { id: 'SHOP', label: 'Shop' },
                  { id: 'VIDEOS', label: 'Vídeos' },
                  { id: 'AUDIOS', label: 'Áudios' },
                  { id: 'REELS', label: 'Reels' },
                  { id: 'PODCAST', label: 'Podcast' },
                  { id: 'INTERVIEW', label: 'Entrevista' },
                  { id: 'ABOUT', label: 'Sobre' },
              ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ChannelTab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                        activeTab === tab.id 
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                        : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                      {tab.label}
                  </button>
              ))}
              <div className="flex-1"></div>
              <div className="flex items-center gap-2 text-gray-400 px-2">
                  <Search size={20} className="cursor-pointer hover:text-brand-500" />
              </div>
          </div>

          {/* 4. Tab Content */}
          <div className="py-6 min-h-[50vh]">
              
              {/* HOME TAB */}
              {activeTab === 'HOME' && (
                  <div className="space-y-10">
                      {/* Featured Video */}
                      {homeFeatured && (
                          <div className="flex flex-col md:flex-row gap-6 items-start">
                              <div className="w-full md:w-2/5 aspect-video rounded-xl overflow-hidden shadow-lg bg-black relative group cursor-pointer" onClick={() => playMedia(homeFeatured)}>
                                  <img src={homeFeatured.thumbnail} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                      <Play size={48} className="text-white drop-shadow-lg" />
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <h2 className="text-xl font-bold dark:text-white mb-2">{homeFeatured.title}</h2>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                      <span>15K visualizações</span>
                                      <span>•</span>
                                      <span>há 5 horas</span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                                      {homeFeatured.subtitle || 'Assista ao vídeo em destaque do nosso canal. Curta, compartilhe e não se esqueça de se inscrever para mais novidades.'}
                                  </p>
                              </div>
                          </div>
                      )}

                      {/* Sections */}
                      <div>
                          <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                              <Clock size={18} /> Envios Recentes
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {homeRecent.map(item => renderVideoCard(item))}
                          </div>
                      </div>

                      <div>
                          <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                              <TrendingUp size={18} /> Vídeos Populares
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {homePopular.map(item => renderVideoCard(item))}
                          </div>
                      </div>
                  </div>
              )}

              {/* SHOP TAB */}
              {activeTab === 'SHOP' && (
                  <div>
                      <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                         <ShoppingBag size={18} /> Loja do Canal
                      </h3>
                      {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                                        </div>
                                        <div className="flex items-center text-yellow-500 text-xs font-bold gap-1 mb-3">
                                            <Star size={12} fill="currentColor" /> {product.rating}
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-lg font-black text-brand-500">{product.price} PTS</span>
                                            <button 
                                                onClick={() => addToCart(product)}
                                                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white transition"
                                            >
                                                <ShoppingCart size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                      ) : (
                          <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl">
                              <ShoppingBag size={48} className="mx-auto mb-2 text-gray-300" />
                              <p className="text-gray-500">A loja deste canal está vazia no momento.</p>
                          </div>
                      )}
                  </div>
              )}

              {/* VIDEOS TAB */}
              {activeTab === 'VIDEOS' && (
                  <div>
                      <div className="flex gap-2 mb-6">
                         <button className="px-4 py-1 rounded-full bg-black text-white text-xs font-bold">Mais recentes</button>
                         <button className="px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold">Populares</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
                          {myVideos.map(item => renderVideoCard(item))}
                      </div>
                  </div>
              )}

              {/* AUDIOS TAB */}
              {activeTab === 'AUDIOS' && (
                  <div>
                      <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                         <Mic size={18} /> Músicas & Áudios
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {myAudios.map(item => renderVideoCard(item))}
                      </div>
                  </div>
              )}

              {/* REELS TAB */}
              {activeTab === 'REELS' && (
                  <div>
                      <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                         <Film size={18} /> Reels & Shorts
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {myShorts.length > 0 ? myShorts.map(item => (
                              <div key={item.id} className="group cursor-pointer relative rounded-xl overflow-hidden aspect-[9/16] shadow-md bg-gray-900" onClick={() => playMedia(item)}>
                                  <img src={item.thumbnail} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Play size={32} className="text-white fill-current" />
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                      <p className="text-white text-xs font-bold line-clamp-2">{item.title}</p>
                                  </div>
                              </div>
                          )) : (
                              <div className="col-span-full text-center py-8 text-gray-500">Nenhum Reel disponível.</div>
                          )}
                      </div>
                  </div>
              )}

              {/* PODCAST TAB */}
              {activeTab === 'PODCAST' && (
                  <div>
                      <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                         <Mic size={18} /> Podcasts
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {myPodcasts.length > 0 ? myPodcasts.map(item => renderVideoCard(item)) : (
                              <div className="col-span-full text-center py-8 text-gray-500">Nenhum Podcast disponível.</div>
                          )}
                      </div>
                  </div>
              )}

              {/* INTERVIEW TAB */}
              {activeTab === 'INTERVIEW' && (
                  <div>
                      <h3 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2">
                         <MessageSquare size={18} /> Entrevistas
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {myInterviews.length > 0 ? myInterviews.map(item => (
                              <div key={item.id} className="flex flex-col sm:flex-row bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer" onClick={() => playMedia(item)}>
                                 <div className="sm:w-1/2 relative aspect-video sm:aspect-auto">
                                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                                        <Play size={32} className="text-white" />
                                    </div>
                                 </div>
                                 <div className="sm:w-1/2 p-4 flex flex-col justify-center">
                                    <h4 className="font-bold dark:text-white mb-2 line-clamp-2">{item.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.subtitle}</p>
                                    <span className="text-[10px] bg-brand-100 text-brand-600 px-2 py-1 rounded w-fit font-bold uppercase">{item.category}</span>
                                 </div>
                              </div>
                          )) : (
                              <div className="col-span-full text-center py-8 text-gray-500">Nenhuma entrevista encontrada.</div>
                          )}
                      </div>
                  </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'ABOUT' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                          <div>
                              <h3 className="text-lg font-bold dark:text-white mb-2">Descrição</h3>
                              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                  {channelInfo.description}
                                  {'\n\n'}
                                  Siga nossas redes sociais para acompanhar os bastidores e novidades exclusivas.
                                  {'\n\n'}
                                  Contato comercial: business@fluxx.com
                              </p>
                          </div>
                          <hr className="border-gray-200 dark:border-gray-800" />
                          <div>
                              <h3 className="text-lg font-bold dark:text-white mb-2">Detalhes</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                      <p className="text-gray-500">Para contato comercial:</p>
                                      <p className="font-medium dark:text-white">Ver endereço de e-mail</p>
                                  </div>
                                  <div>
                                      <p className="text-gray-500">Local:</p>
                                      <p className="font-medium dark:text-white">{channelInfo.location}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <h3 className="text-lg font-bold dark:text-white">Estatísticas</h3>
                          <div className="space-y-3 text-sm border-t border-gray-200 dark:border-gray-800 pt-4">
                              <p className="dark:text-white">{channelInfo.joinDate}</p>
                              <hr className="border-gray-200 dark:border-gray-800" />
                              <p className="dark:text-white">1,540,320 visualizações</p>
                              <hr className="border-gray-200 dark:border-gray-800" />
                              <div className="flex gap-4 pt-2">
                                  <Share2 className="cursor-pointer hover:text-brand-500" size={20} />
                                  <MoreVertical className="cursor-pointer hover:text-brand-500" size={20} />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};
