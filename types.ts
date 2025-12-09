

export enum MediaType {
  VIDEO = 'VIDEO',
  LIVE_TV = 'LIVE_TV',
  RADIO = 'RADIO',
  PODCAST = 'PODCAST',
  AUDIO = 'AUDIO',
  SHORT = 'SHORT'
}

export interface MediaItem {
  id: string;
  title: string;
  subtitle?: string; // Artist, Channel Name, etc.
  type: MediaType;
  thumbnail: string;
  url: string; // Stream URL
  duration?: number; // In seconds, if applicable
  isLive?: boolean;
  category: string;
  location?: string; // City, State
  likes?: number; // For social feed
  author?: string; // Display Name
  ownerId?: string; // ID of the user who posted
  views?: number; // For traffic stats
  earnings?: number; // Total PS earned by this content
  status?: 'pending' | 'approved' | 'rejected'; // Moderation Status
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  timestamp: string;
  pointsValue: number;
}

export interface Transaction {
  id: string;
  type: 'EARN' | 'SPEND' | 'WITHDRAW' | 'DEPOSIT' | 'SALE' | 'PURCHASE' | 'EXCHANGE' | 'ADJUSTMENT';
  amount: number;
  description: string;
  date: string;
  relatedItemId?: string; // ID of the product or video
}

export interface UserStats {
  points: number; // Legacy points (can be kept for level)
  protoStreamBalance: number; // The main currency
  walletBalance: number; // Real money value equivalent
  level: number;
  watchedMinutes: number;
  streakDays: number;
  badges: string[];
  favorites: string[];
  isShopUnlocked: boolean;
  transactions: Transaction[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Moderator' | 'Finance';
  status: 'Active' | 'Inactive' | 'Banned';
  protoStreamBalance: number;
  walletBalance: number;
  points: number;
  plan: 'Free' | 'Premium' | 'Family';
  joinDate: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // In Proto Stream
  images: string[]; // Array of image URLs (Max 5)
  category: string;
  rating: number; // 0-5 stars
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    contactInfo: string; // Phone/Email (Hidden until unlocked)
  };
  pickupAddress: string; // Endereço de coleta informado pelo vendedor
  type: 'Digital' | 'Physical' | 'Service';
  isNew?: boolean;
  soldCount?: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CartItem extends Product {
  cartId: string;
}

export interface ShippingAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

// Admin System Types
export interface SystemSettings {
  rewardPerMinute: number;
  adCost: number;
  shopUnlockCost: number;
  conversionRate: number;
  maintenanceMode: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  status: 'Open' | 'Resolved' | 'Closed';
  date: string;
}