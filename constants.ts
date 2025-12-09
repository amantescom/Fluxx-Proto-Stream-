

import { MediaItem, MediaType, NewsItem, Mission, User, Product } from './types';

// ... (Keep existing HERO_SLIDES, FEATURED_CREATORS, TV_CHANNELS, LIVES_LIST, VIDEO_PODCASTS, INTERVIEWS_LIST, SHORTS_LIST, VLOGS_LIST, RADIO_STATIONS, LIVE_CHANNELS, VIDEOS, AUDIOS, PODCASTS, MOCK_FEED, DAILY_MISSIONS, MOCK_USERS, MOCK_NEWS - NO CHANGES NEEDED ABOVE, JUST RE-EXPORT THEM OR KEEP THEM IN FILE)

export const HERO_SLIDES: MediaItem[] = [
  // 1. Token Proto Stream
  {
    id: 'hero-token-1',
    title: 'Token Proto Stream',
    subtitle: 'A moeda que valoriza sua interação',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=10',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Crypto',
    isLive: false,
    likes: 1500,
    author: 'Fluxx System'
  },
  {
    id: 'hero-token-2',
    title: 'Ganhe Assistindo',
    subtitle: 'Acumule Proto Streams a cada play',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=11',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Rewards',
    isLive: false,
    likes: 1200,
    author: 'Fluxx System'
  },
  
  // 2. Comunidade Loucos por Grau
  {
    id: 'hero-grau-1',
    title: 'Comunidade Loucos por Grau',
    subtitle: 'A maior união de duas rodas do Brasil',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=12',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Community',
    isLive: true,
    likes: 5000,
    author: 'Loucos por Grau'
  },
  {
    id: 'hero-grau-2',
    title: 'Eventos e Encontros',
    subtitle: 'Fique por dentro dos rolês oficiais',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=13',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Events',
    isLive: false,
    likes: 3400,
    author: 'Loucos por Grau'
  },

  // 3. Aplicativos Proto Rider
  {
    id: 'hero-rider-1',
    title: 'Aplicativo Proto Rider',
    subtitle: 'Mobilidade e entregas com tecnologia blockchain',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=14',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    category: 'App',
    isLive: false,
    likes: 2100,
    author: 'Proto Rider'
  },
  {
    id: 'hero-rider-2',
    title: 'Seja um Parceiro',
    subtitle: 'As melhores taxas do mercado para pilotos',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=15',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    category: 'Business',
    isLive: false,
    likes: 1800,
    author: 'Proto Rider'
  },

  // 4. Marketing Place: Grau Shop
  {
    id: 'hero-shop-1',
    title: 'Grau Shop Oficial',
    subtitle: 'O marketplace exclusivo da comunidade',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=16',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    category: 'Shop',
    isLive: false,
    likes: 900,
    author: 'Grau Shop'
  },
  {
    id: 'hero-shop-2',
    title: 'Peças e Acessórios',
    subtitle: 'Equipe sua nave com descontos em Token',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=17',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    category: 'Shop',
    isLive: false,
    likes: 1100,
    author: 'Grau Shop'
  },

  // 5. A Hub de Streaming Fluxx
  {
    id: 'hero-hub-1',
    title: 'Fluxx Stream Hub',
    subtitle: 'TV, Rádio e Podcast em um só lugar',
    type: MediaType.LIVE_TV,
    thumbnail: 'https://picsum.photos/800/450?random=18',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    category: 'Streaming',
    isLive: true,
    likes: 4500,
    author: 'Fluxx Official'
  },
  {
    id: 'hero-hub-2',
    title: 'Multiplataforma',
    subtitle: 'Acesse pelo celular, web ou smart TV',
    type: MediaType.VIDEO,
    thumbnail: 'https://picsum.photos/800/450?random=19',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: 'Tech',
    isLive: false,
    likes: 2200,
    author: 'Fluxx Official'
  }
];

export const FEATURED_CREATORS = [
  { id: 'c-1', name: 'DJ Cobra', avatar: 'https://i.pravatar.cc/150?u=1', isLive: true },
  { id: 'c-2', name: 'Tech Ninja', avatar: 'https://i.pravatar.cc/150?u=2', isLive: false },
  { id: 'c-3', name: 'Yoga with Sarah', avatar: 'https://i.pravatar.cc/150?u=3', isLive: true },
  { id: 'c-4', name: 'GamerX', avatar: 'https://i.pravatar.cc/150?u=4', isLive: true },
  { id: 'c-5', name: 'Cooking Mama', avatar: 'https://i.pravatar.cc/150?u=5', isLive: false },
  { id: 'c-6', name: 'Crypto King', avatar: 'https://i.pravatar.cc/150?u=6', isLive: false },
  { id: 'c-7', name: 'Speed Racer', avatar: 'https://i.pravatar.cc/150?u=7', isLive: true },
  { id: 'c-8', name: 'Music Lab', avatar: 'https://i.pravatar.cc/150?u=8', isLive: false },
  { id: 'c-9', name: 'News Daily', avatar: 'https://i.pravatar.cc/150?u=9', isLive: true },
  { id: 'c-10', name: 'Funny Clips', avatar: 'https://i.pravatar.cc/150?u=10', isLive: false },
];

export const TV_CHANNELS: MediaItem[] = [
  { id: 'tv-globo', title: 'TV Globo', subtitle: 'Jornalismo, Novelas e Esportes', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=101', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', category: 'TV Aberta', isLive: true, author: 'Globo' },
  { id: 'tv-sbt', title: 'SBT', subtitle: 'A TV Mais Feliz do Brasil', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=102', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', category: 'TV Aberta', isLive: true, author: 'SBT' },
  { id: 'tv-record', title: 'Record TV', subtitle: 'Jornalismo e Realities', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=103', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', category: 'TV Aberta', isLive: true, author: 'Record' },
  { id: 'tv-band', title: 'Band', subtitle: 'O Canal do Esporte', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=104', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', category: 'TV Aberta', isLive: true, author: 'Band' },
  { id: 'tv-redetv', title: 'RedeTV!', subtitle: 'Entretenimento e Humor', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=105', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', category: 'TV Aberta', isLive: true, author: 'RedeTV!' },
  { id: 'tv-cultura', title: 'TV Cultura', subtitle: 'Cultura e Educação', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=106', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', category: 'Educativo', isLive: true, author: 'FPA' },
  { id: 'tv-brasil', title: 'TV Brasil', subtitle: 'Cidadania e Notícia', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=107', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', category: 'Pública', isLive: true, author: 'EBC' },
  { id: 'tv-redevida', title: 'Rede Vida', subtitle: 'O Canal da Família', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=108', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', category: 'Religioso', isLive: true, author: 'Rede Vida' },
  { id: 'tv-aparecida', title: 'TV Aparecida', subtitle: 'Fé e Devoção', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=109', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', category: 'Religioso', isLive: true, author: 'Aparecida' },
  { id: 'tv-recnews', title: 'Record News', subtitle: 'Notícia 24h', type: MediaType.LIVE_TV, thumbnail: 'https://picsum.photos/300/200?random=110', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', category: 'Notícias', isLive: true, author: 'Record' },
];

export const LIVES_LIST: MediaItem[] = [
  { id: 'live-anitta', title: 'Anitta: Ensaio de Verão', subtitle: 'Ao Vivo do Rio', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=201', url: '', category: 'Música', isLive: true, author: 'Anitta' },
  { id: 'live-marilia', title: 'Especial Marília Mendonça', subtitle: 'Tributo e Saudade', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=202', url: '', category: 'Música', isLive: false, author: 'Marília Real' },
  { id: 'live-ivete', title: 'Ivete Sangalo em Casa', subtitle: 'Axé para o Mundo', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=203', url: '', category: 'Música', isLive: true, author: 'Veveta' },
  { id: 'live-alanzoka', title: 'Zerando Resident Evil', subtitle: 'Gameplay Tensa', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=204', url: '', category: 'Games', isLive: true, author: 'Alanzoka' },
  { id: 'live-gaules', title: 'Major de CS:GO', subtitle: 'A Tribo Cuida', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=205', url: '', category: 'Games', isLive: true, author: 'Gaules' },
  { id: 'live-nobru', title: 'Copa Nobru de Free Fire', subtitle: 'Final do Campeonato', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=206', url: '', category: 'Games', isLive: true, author: 'Nobru' },
  { id: 'live-karnal', title: 'Filosofia Moderna', subtitle: 'O Dilema das Redes', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=207', url: '', category: 'Educação', isLive: true, author: 'Leandro Karnal' },
  { id: 'live-porta', title: 'Porta dos Fundos Ao Vivo', subtitle: 'Improviso e Humor', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=208', url: '', category: 'Humor', isLive: true, author: 'Porta' },
];

export const VIDEO_PODCASTS: MediaItem[] = [
  { id: 'pod-mamilos', title: 'Mamilos: Polêmica', subtitle: 'Debates Profundos', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=301', url: '', category: 'Cultura', author: 'B9' },
  { id: 'pod-podpah', title: 'Podpah com Neymar', subtitle: 'A Resenha Lendária', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=302', url: '', category: 'Entrevistas', author: 'Podpah' },
  { id: 'pod-flow', title: 'Flow Podcast', subtitle: 'Conversa Livre', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=303', url: '', category: 'Entrevistas', author: 'Flow' },
  { id: 'pod-naoouvo', title: 'Não Ouvo', subtitle: 'Bancada do Humor', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=304', url: '', category: 'Humor', author: 'Cid Cidoso' },
  { id: 'pod-hipsters', title: 'Hipsters Ponto Tech', subtitle: 'O Futuro da AI', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=305', url: '', category: 'Tech', author: 'Alura' },
  { id: 'pod-nerdcast', title: 'NerdCast Stories', subtitle: 'RPG de Ghanor', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=306', url: '', category: 'Geek', author: 'Jovem Nerd' },
];

export const INTERVIEWS_LIST: MediaItem[] = [
  { id: 'int-adm', title: 'Café com ADM', subtitle: 'Liderança e Gestão', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=401', url: '', category: 'Business', author: 'Administradores' },
  { id: 'int-gv', title: 'Geração de Valor', subtitle: 'Flávio Augusto', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=402', url: '', category: 'Business', author: 'Geração de Valor' },
  { id: 'int-boss', title: 'Like a Boss', subtitle: 'CEOs do Brasil', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=403', url: '', category: 'Business', author: 'Alura & Caelum' },
];

export const SHORTS_LIST: MediaItem[] = [
  { id: 'short-motiv', title: 'Não Desista!', subtitle: 'Motivação Diária', type: MediaType.SHORT, thumbnail: 'https://picsum.photos/200/350?random=501', url: '', category: 'Motivação', author: 'Mindset' },
  { id: 'short-fail', title: 'Funny Fails 2024', subtitle: 'Tente não rir', type: MediaType.SHORT, thumbnail: 'https://picsum.photos/200/350?random=502', url: '', category: 'Humor', author: 'FailArmy' },
  { id: 'short-fact', title: 'Você Sabia?', subtitle: 'Curiosidades Rápidas', type: MediaType.SHORT, thumbnail: 'https://picsum.photos/200/350?random=503', url: '', category: 'Curiosidades', author: 'Fatos' },
  { id: 'short-fit', title: 'Treino de 30s', subtitle: 'Queime Calorias', type: MediaType.SHORT, thumbnail: 'https://picsum.photos/200/350?random=504', url: '', category: 'Fitness', author: 'FitLife' },
  { id: 'short-tech', title: 'iPhone vs Android', subtitle: 'Qual é melhor?', type: MediaType.SHORT, thumbnail: 'https://picsum.photos/200/350?random=505', url: '', category: 'Tech', author: 'TechReviews' },
];

export const VLOGS_LIST: MediaItem[] = [
  { id: 'vlog-travel', title: 'Fui para o Japão!', subtitle: 'Diário de Viagem', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=601', url: '', category: 'Viagem', author: 'Viajante' },
  { id: 'vlog-routine', title: 'Minha Rotina Matinal', subtitle: '5 AM Club', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=602', url: '', category: 'Rotina', author: 'Lifestyle' },
  { id: 'vlog-food', title: 'Provando Comidas de Rua', subtitle: 'Gastronomia', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=603', url: '', category: 'Comida', author: 'Foodie' },
  { id: 'vlog-tech', title: 'Setup Tour 2024', subtitle: 'Meu Escritório', type: MediaType.VIDEO, thumbnail: 'https://picsum.photos/300/200?random=604', url: '', category: 'Tech', author: 'TechGuy' },
];

export const RADIO_STATIONS: MediaItem[] = [
  { id: 'rad-cric-1', title: 'Rádio 105 FM', subtitle: 'A Rádio de Criciúma', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=101', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', category: 'Hits', isLive: true, author: '105 FM', location: 'Criciúma, SC' },
  { id: 'rad-cric-2', title: 'Rádio Mix FM', subtitle: 'O Melhor Mix do Brasil', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=102', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', category: 'Pop', isLive: true, author: 'Mix FM', location: 'Criciúma, SC' },
  { id: 'rad-cric-3', title: 'Rádio Montecarlo FM', subtitle: 'Sua Rádio Premium', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=103', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', category: 'Hits', isLive: true, author: 'Montecarlo', location: 'Criciúma, SC' },
  { id: 'rad-cric-4', title: 'Rádio Cidade FM', subtitle: 'A Rádio 10', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=104', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', category: 'Hits', isLive: true, author: 'Cidade', location: 'Criciúma, SC' },
  { id: 'rad-cric-5', title: 'Rádio 92 FM', subtitle: 'A Rádio do Rock', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=105', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', category: 'Rock', isLive: true, author: '92 FM', location: 'Criciúma, SC' },
  { id: 'rad-cric-6', title: 'Rádio Atlântida', subtitle: 'A Rádio da Sua Vida', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=106', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', category: 'Pop', isLive: true, author: 'Atlântida', location: 'Criciúma, SC' },
  { id: 'rad-cric-7', title: 'Rádio Som Maior', subtitle: 'A Rádio que Informa', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=107', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', category: 'News', isLive: true, author: 'Som Maior', location: 'Criciúma, SC' },
  { id: 'rad-cric-8', title: 'Rádio Jovem Pan FM', subtitle: 'O Som do Brasil', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=108', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', category: 'Pop', isLive: true, author: 'Jovem Pan', location: 'Criciúma, SC' },
  { id: 'rad-generic-1', title: 'Rádio Nacional', subtitle: 'Sintonia Brasil', type: MediaType.RADIO, thumbnail: 'https://picsum.photos/200/200?random=109', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', category: 'News', isLive: true, author: 'EBC', location: 'Brasília, DF' },
];

export const LIVE_CHANNELS = TV_CHANNELS;
export const VIDEOS = [...LIVES_LIST, ...VIDEO_PODCASTS, ...VLOGS_LIST];
export const AUDIOS: MediaItem[] = [
  { id: 'aud-1', title: 'Midnight Rain', subtitle: 'Single', type: MediaType.AUDIO, thumbnail: 'https://picsum.photos/200/200?random=30', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', category: 'Music', author: 'Indie Band', likes: 55 },
  { id: 'aud-2', title: 'Urban Beats', subtitle: 'Album', type: MediaType.AUDIO, thumbnail: 'https://picsum.photos/200/200?random=31', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', category: 'Music', author: 'DJ Cool', likes: 120 },
];
export const PODCASTS: MediaItem[] = [
  { id: 'pod-1', title: 'Tech Talk Daily', subtitle: 'Ep 405: AI Revolution', type: MediaType.PODCAST, thumbnail: 'https://picsum.photos/200/200?random=11', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', category: 'Technology', author: 'Tech Guys' },
  { id: 'pod-2', title: 'True Crime Files', subtitle: 'The Missing Key', type: MediaType.PODCAST, thumbnail: 'https://picsum.photos/200/200?random=12', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', category: 'True Crime', author: 'Crime Network' },
];

export const MOCK_FEED = [...HERO_SLIDES, ...VIDEOS, ...AUDIOS];

export const MOCK_PRODUCTS: Product[] = [
  { 
    id: 'p-1', 
    name: 'Camiseta Estilo Streetwear', 
    description: 'Camiseta confortável de algodão, disponível em várias cores e tamanhos. Ideal para o dia a dia ou ocasiões casuais.', 
    price: 100, // 100 PS = R$ 10.00
    images: [
      'https://picsum.photos/600/600?random=70',
      'https://picsum.photos/600/600?random=71',
      'https://picsum.photos/600/600?random=72',
      'https://picsum.photos/600/600?random=73',
      'https://picsum.photos/600/600?random=74'
    ],
    category: 'Moda',
    rating: 4,
    seller: {
      id: 's-1',
      name: 'João Silva',
      avatar: 'https://i.pravatar.cc/150?u=20',
      rating: 4,
      contactInfo: '+55 48 99999-9999 | joao@email.com'
    },
    pickupAddress: 'Rua das Flores, 123, Centro, Criciúma - SC',
    type: 'Physical',
    isNew: true
  },
  { 
    id: 'p-2', 
    name: 'Premium Badge', 
    description: 'Show off your support on your profile', 
    price: 500, 
    images: ['https://picsum.photos/600/600?random=40'],
    category: 'Digital',
    rating: 5,
    seller: {
      id: 's-system',
      name: 'Fluxx System',
      avatar: 'https://picsum.photos/100/100?random=99',
      rating: 5,
      contactInfo: 'support@fluxx.com'
    },
    pickupAddress: 'Digital Delivery (E-mail)',
    type: 'Digital' 
  },
  { 
    id: 'p-3', 
    name: 'Online Music Lesson', 
    description: '1 hour guitar lesson via Zoom', 
    price: 2000, 
    images: ['https://picsum.photos/600/600?random=41'],
    category: 'Serviços',
    rating: 4.5,
    seller: {
      id: 's-2',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?u=21',
      rating: 4.5,
      contactInfo: 'alice@music.com'
    },
    pickupAddress: 'Online via Zoom',
    type: 'Service' 
  },
  { 
    id: 'p-4', 
    name: 'Exclusive Beat', 
    description: 'Royalty free beat for your songs', 
    price: 800, 
    images: ['https://picsum.photos/600/600?random=43'],
    category: 'Digital',
    rating: 3,
    seller: {
      id: 's-3',
      name: 'DJ Cool',
      avatar: 'https://i.pravatar.cc/150?u=22',
      rating: 3,
      contactInfo: 'djcool@beat.com'
    },
    pickupAddress: 'Download Link',
    type: 'Digital' 
  },
];

export const SHOP_BANNERS = [
  { id: 'b-1', title: 'Summer Sale', subtitle: 'Até 50% OFF em Moda', image: 'https://picsum.photos/1200/400?random=90', category: 'Promoção' },
  { id: 'b-2', title: 'Tech Week', subtitle: 'Gadgets com desconto', image: 'https://picsum.photos/1200/400?random=91', category: 'Eletrônicos' },
  { id: 'b-3', title: 'Novas Coleções', subtitle: 'Streetwear Exclusivo', image: 'https://picsum.photos/1200/400?random=92', category: 'Moda' },
  { id: 'b-4', title: 'Serviços Digitais', subtitle: 'Contrate Freelancers', image: 'https://picsum.photos/1200/400?random=93', category: 'Serviços' },
  { id: 'b-5', title: 'Música & Áudio', subtitle: 'Beats e Samples', image: 'https://picsum.photos/1200/400?random=94', category: 'Áudio' },
  { id: 'b-6', title: 'Casa & Decor', subtitle: 'Renove seu ambiente', image: 'https://picsum.photos/1200/400?random=95', category: 'Casa' },
  { id: 'b-7', title: 'Esportes', subtitle: 'Tudo para seu treino', image: 'https://picsum.photos/1200/400?random=96', category: 'Esportes' },
  { id: 'b-8', title: 'Gamers Zone', subtitle: 'Acessórios e Jogos', image: 'https://picsum.photos/1200/400?random=97', category: 'Games' },
  { id: 'b-9', title: 'Livros e Cursos', subtitle: 'Aprenda algo novo', image: 'https://picsum.photos/1200/400?random=98', category: 'Educação' },
  { id: 'b-10', title: 'Ofertas Relâmpago', subtitle: 'Aproveite agora', image: 'https://picsum.photos/1200/400?random=99', category: 'Ofertas' },
];

export const DAILY_MISSIONS: Mission[] = [
  { id: 'm-1', title: 'Social Butterfly', description: 'Share 3 Videos', pointsReward: 50, completed: false },
  { id: 'm-2', title: 'Tune In', description: 'Listen to Radio for 10 mins', pointsReward: 100, completed: false },
  { id: 'm-3', title: 'Supporter', description: 'Unlock the Shop', pointsReward: 150, completed: false },
];

export const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Active', points: 1250, protoStreamBalance: 1250, walletBalance: 0, plan: 'Premium', joinDate: '2023-10-15' },
  { id: 'u-2', name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Inactive', points: 450, protoStreamBalance: 450, walletBalance: 0, plan: 'Free', joinDate: '2023-11-02' },
  { id: 'u-3', name: 'Charlie Admin', email: 'admin@fluxx.com', role: 'Admin', status: 'Active', points: 5000, protoStreamBalance: 5000, walletBalance: 0, plan: 'Premium', joinDate: '2023-01-01' },
];

export const MOCK_NEWS: NewsItem[] = [
  { 
    id: 'n-1', 
    title: 'New AI Model Revolutionizes Content Creation', 
    summary: 'The latest AI tools are making it easier than ever for creators to produce high-quality videos and art.', 
    category: 'Technology', 
    imageUrl: 'https://picsum.photos/600/400?random=50', 
    timestamp: '2 hours ago', 
    pointsValue: 10 
  },
  { 
    id: 'n-2', 
    title: 'Global Music Festival Announced for 2024', 
    summary: 'Top artists from around the world will gather for a week-long celebration of music and culture.', 
    category: 'Music', 
    imageUrl: 'https://picsum.photos/600/400?random=51', 
    timestamp: '5 hours ago', 
    pointsValue: 15 
  },
  { 
    id: 'n-3', 
    title: 'Local Sports Team Wins Championship', 
    summary: 'In a stunning upset, the underdogs took home the trophy last night in front of a roaring crowd.', 
    category: 'Sports', 
    imageUrl: 'https://picsum.photos/600/400?random=52', 
    timestamp: '1 day ago', 
    pointsValue: 10 
  },
  {
    id: 'n-4',
    title: 'Cryptocurrency Market Trends to Watch',
    summary: 'Analysts predict a volatile but potentially profitable year for major digital currencies.',
    category: 'Finance',
    imageUrl: 'https://picsum.photos/600/400?random=53',
    timestamp: '1 day ago',
    pointsValue: 20
  }
];