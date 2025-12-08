
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context';
import { SHOP_BANNERS } from '../constants';
import { ShoppingBag, Lock, Unlock, Coins, Filter, Star, Eye, Phone, ChevronLeft, ChevronRight, X, ShoppingCart, Plus, Image as ImageIcon, Upload } from '../components/Icons';
import { Product } from '../types';
import { HeroSection } from '../components/HeroSection';

export const Shop: React.FC = () => {
  const { userStats, unlockShop, buyProduct, addToCart, cart, unlockedSellers, unlockSellerContact, products, addProduct } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Sell Modal State
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Moda',
    type: 'Physical' as 'Physical' | 'Digital' | 'Service',
    images: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cart Calculations
  const cartTotalPS = cart.reduce((acc, item) => acc + item.price, 0);
  const cartTotalReal = (cartTotalPS / 10).toFixed(2); // 100 PS = R$ 10.00 -> 10 PS = R$ 1.00

  // Shop Slider Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHOP_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    if (userStats.protoStreamBalance >= 100) {
      if (window.confirm("Spend 100 Proto Stream to unlock the Marketplace?")) {
        unlockShop();
      }
    } else {
      alert("Insufficient Proto Stream balance!");
    }
  };

  const handleBuy = (product: Product) => {
    if (userStats.protoStreamBalance >= product.price) {
        if(window.confirm(`Buy ${product.name} for ${product.price} PS?`)) {
            buyProduct(product);
            alert("Purchase successful!");
            setSelectedProduct(null);
        }
    } else {
        alert("Not enough Proto Stream!");
    }
  };

  const handleUnlockContact = (product: Product) => {
     if (unlockSellerContact(product.id)) {
        alert("Contact Unlocked!");
     } else {
        alert("Insufficient Proto Stream balance (100 PS required)!");
     }
  };

  // Image Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const remainingSlots = 5 - newItem.images.length;
      
      if (remainingSlots <= 0) {
        alert("You can only upload up to 5 images.");
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setNewItem(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handlePublishItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description || newItem.price <= 0 || newItem.images.length === 0) {
      alert("Please fill in all fields and add at least one image.");
      return;
    }

    if (userStats.protoStreamBalance < 100) {
        alert("Insufficient Proto Stream balance to post an ad. You need 100 PS.");
        return;
    }

    const success = addProduct({
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      category: newItem.category,
      type: newItem.type,
      images: newItem.images,
      seller: {
        id: 'u-current',
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?u=me',
        rating: 5,
        contactInfo: 'Available upon unlock'
      }
    });

    if (success) {
        setIsSellModalOpen(false);
        setNewItem({
            name: '',
            description: '',
            price: 0,
            category: 'Moda',
            type: 'Physical',
            images: []
        });
        alert("Product published successfully! 100 PS fee deducted.");
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categories = ['All', 'Moda', 'Eletrônicos', 'Serviços', 'Digital', 'Casa', 'Esportes', 'Games', 'Educação'];

  // Locked View
  if (!userStats.isShopUnlocked) {
    return (
      <div className="min-h-screen flex flex-col">
        <HeroSection />

        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-gray-200 dark:bg-dark-card rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
            <Lock size={48} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Marketplace Locked</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Unlock the Fluxx Shop to buy and sell exclusive digital items, merch, and services.
            Entry requires a one-time fee.
          </p>
          
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg w-full max-w-sm">
             <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Unlock Fee</span>
                <span className="text-xl font-bold text-brand-500">100 PS</span>
             </div>
             <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Your Balance</span>
                <span className={`text-xl font-bold ${userStats.protoStreamBalance >= 100 ? 'text-green-500' : 'text-red-500'}`}>
                  {userStats.protoStreamBalance} PS
                </span>
             </div>
             <button 
               onClick={handleUnlock}
               disabled={userStats.protoStreamBalance < 100}
               className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                 userStats.protoStreamBalance >= 100 
                  ? 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/30' 
                  : 'bg-gray-400 cursor-not-allowed'
               }`}
             >
               <Unlock size={20} />
               {userStats.protoStreamBalance >= 100 ? 'Unlock Now' : 'Need more points'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked View
  return (
    <div className="pb-24 relative">
      
      {/* 1. Global Hero Section */}
      <HeroSection />

      {/* 2. Shop Specific Banner */}
       <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-2xl mb-8 group">
         {SHOP_BANNERS.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'}`}
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                 <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 shadow-lg">{slide.category}</span>
                 <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">{slide.title}</h1>
                 <p className="text-gray-100 text-lg drop-shadow-md">{slide.subtitle}</p>
              </div>
            </div>
         ))}
      </div>

      {/* 3. Controls & Filters & Sell Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2 flex-1">
            {categories.map(cat => (
               <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
                     activeCategory === cat 
                     ? 'bg-brand-500 text-white' 
                     : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-brand-600 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/30 transition whitespace-nowrap"
            >
                <Plus size={20} /> Sell Item
            </button>
            <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-xl w-fit whitespace-nowrap">
                <Coins className="text-brand-500" size={20} />
                <span className="font-bold text-brand-600 dark:text-brand-400">{userStats.protoStreamBalance} PS</span>
            </div>
         </div>
      </div>

      {/* 4. Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
             {/* Image */}
             <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded">
                   {product.category}
                </div>
                {/* Hover Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                      onClick={() => { setSelectedProduct(product); setViewImageIndex(0); }}
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-brand-500 hover:text-white transition"
                   >
                      <Eye size={18} /> View Details
                   </button>
                </div>
             </div>

             {/* Info */}
             <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                   <div className="flex items-center text-yellow-500 text-xs font-bold gap-1">
                      <Star size={12} fill="currentColor" /> {product.rating}
                   </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                   Sold by <span className="font-semibold text-gray-700 dark:text-gray-300">{product.seller.name}</span>
                </p>

                <div className="mt-auto">
                   <div className="flex items-end gap-2 mb-3">
                      <span className="text-xl font-black text-brand-500">{product.price} PS</span>
                      <span className="text-xs text-gray-400 mb-1">≈ R$ {(product.price / 10).toFixed(2)}</span>
                   </div>
                   <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-lg font-bold hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white transition flex items-center justify-center gap-2"
                   >
                      <ShoppingCart size={16} /> Add to Cart
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 5. Sell Item Modal */}
      {isSellModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
             <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={() => setIsSellModalOpen(false)}>
                   <div className="absolute inset-0 bg-gray-500 dark:bg-black opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white dark:bg-dark-card rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                   <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sell an Item</h3>
                        <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-800">
                           Fee: 100 PS
                        </div>
                      </div>
                      
                      <form onSubmit={handlePublishItem} className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input 
                               type="text" 
                               required
                               value={newItem.name}
                               onChange={e => setNewItem({...newItem, name: e.target.value})}
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                               placeholder="e.g. Vintage Camera"
                            />
                         </div>
                         
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price (Proto Stream)</label>
                            <div className="relative">
                               <input 
                                  type="number" 
                                  required
                                  min="1"
                                  value={newItem.price || ''}
                                  onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})}
                                  className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                               />
                               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Coins size={16} className="text-gray-400" />
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                               <select 
                                  value={newItem.category}
                                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-surface dark:text-white outline-none"
                               >
                                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                               <select 
                                  value={newItem.type}
                                  onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-surface dark:text-white outline-none"
                               >
                                  <option value="Physical">Physical Product</option>
                                  <option value="Digital">Digital Download</option>
                                  <option value="Service">Service</option>
                               </select>
                            </div>
                         </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea 
                               required
                               value={newItem.description}
                               onChange={e => setNewItem({...newItem, description: e.target.value})}
                               className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-dark-surface dark:text-white focus:ring-2 focus:ring-brand-500 outline-none h-24 resize-none"
                               placeholder="Describe your item..."
                            />
                         </div>

                         {/* Image Upload */}
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Images (Max 5)</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                               {newItem.images.map((img, idx) => (
                                  <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group">
                                     <img src={img} className="w-full h-full object-cover" />
                                     <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition"
                                     >
                                        <X size={12} />
                                     </button>
                                  </div>
                               ))}
                               {newItem.images.length < 5 && (
                                  <div 
                                     onClick={() => fileInputRef.current?.click()}
                                     className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition text-gray-400 hover:text-brand-500"
                                  >
                                     <ImageIcon size={24} />
                                     <span className="text-[10px] mt-1 font-bold">Add</span>
                                  </div>
                               )}
                            </div>
                            <input 
                               type="file" 
                               ref={fileInputRef}
                               onChange={handleImageUpload}
                               accept="image/*"
                               multiple
                               className="hidden"
                            />
                            <p className="text-xs text-gray-400 mt-1">Upload clear images to increase sales.</p>
                         </div>

                         <div className="pt-4 flex gap-3">
                            <button 
                               type="button"
                               onClick={() => setIsSellModalOpen(false)}
                               className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold"
                            >
                               Cancel
                            </button>
                            <button 
                               type="submit"
                               className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-600/30"
                            >
                               Publish Item (100 PS)
                            </button>
                         </div>

                      </form>
                   </div>
                </div>
             </div>
          </div>
      )}

      {/* 6. Product Detail Modal (Updated to render gallery) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
           <div className="bg-white dark:bg-dark-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              <button 
                 onClick={() => setSelectedProduct(null)}
                 className="absolute top-4 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition"
              >
                 <X size={20} />
              </button>

              {/* Left: Gallery */}
              <div className="md:w-1/2 bg-gray-100 dark:bg-black p-4 flex flex-col">
                 <div className="flex-1 rounded-2xl overflow-hidden mb-4 relative group bg-gray-800 flex items-center justify-center">
                    <img src={selectedProduct.images[viewImageIndex]} alt="" className="w-full h-full object-contain" />
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {selectedProduct.images.map((img, idx) => (
                       <button 
                          key={idx} 
                          onClick={() => setViewImageIndex(idx)}
                          className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition bg-gray-800 ${viewImageIndex === idx ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                       >
                          <img src={img} className="w-full h-full object-cover" />
                       </button>
                    ))}
                 </div>
              </div>

              {/* Right: Info */}
              <div className="md:w-1/2 p-8 flex flex-col">
                 <div className="mb-6">
                    <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                       {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2 leading-tight">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />
                          ))}
                       </div>
                       <span className="text-gray-400 text-sm">({selectedProduct.rating} Stars)</span>
                    </div>
                 </div>

                 <div className="flex items-end gap-3 mb-6 p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <span className="text-3xl font-black text-brand-500">{selectedProduct.price} PS</span>
                    <span className="text-lg text-gray-400 mb-1">≈ R$ {(selectedProduct.price / 10).toFixed(2)}</span>
                 </div>

                 <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {selectedProduct.description}
                 </p>

                 {/* Seller Card */}
                 <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-xl mb-8">
                    <div className="flex items-center gap-3 mb-3">
                       <img src={selectedProduct.seller.avatar} className="w-12 h-12 rounded-full object-cover" />
                       <div>
                          <p className="font-bold text-gray-900 dark:text-white">{selectedProduct.seller.name}</p>
                          <p className="text-xs text-gray-500">Seller</p>
                       </div>
                    </div>
                    
                    {unlockedSellers.includes(selectedProduct.id) ? (
                        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                           <Phone size={16} /> {selectedProduct.seller.contactInfo}
                        </div>
                    ) : (
                        <button 
                           onClick={() => handleUnlockContact(selectedProduct)}
                           className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                           <Lock size={16} /> Unlock Contact (100 PS)
                        </button>
                    )}
                 </div>

                 <div className="mt-auto flex gap-3">
                    <button 
                       onClick={() => addToCart(selectedProduct)}
                       className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                       Add to Cart
                    </button>
                    <button 
                       onClick={() => handleBuy(selectedProduct)}
                       className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-600/30 transition"
                    >
                       Buy Now
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 7. Floating Cart Widget */}
      {cart.length > 0 && (
         <div className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 animate-in slide-in-from-bottom-10">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl p-4 flex items-center gap-4 pr-6 cursor-pointer hover:scale-105 transition-transform">
               <div className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                     {cart.length}
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-medium opacity-80">Total</span>
                  <span className="font-bold leading-none">{cartTotalPS} PS <span className="text-[10px] opacity-70">(R$ {cartTotalReal})</span></span>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
