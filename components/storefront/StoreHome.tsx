
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Plus, Check, ArrowUpRight, Filter } from '../common/Icons';
import { CURRENCY } from '../../constants';

const StoreHome: React.FC = () => {
  const { config, products, addToCart, cart } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const [addedToCartFeedback, setAddedToCartFeedback] = useState<Record<number, boolean>>({});

  const categories = ['All', 'Spirits', 'Wine', 'Beer', 'Snacks'];

  const getFilteredAndSearchedProducts = () => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('searchTerm')?.toLowerCase() || '';
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  };

  const featuredProducts = products.filter(p => p.featured);
  const filteredProducts = getFilteredAndSearchedProducts();

  const handleAddToCartClick = (product: any) => {
    addToCart(product, 1);
    setAddedToCartFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCartFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-white animate-in fade-in duration-700">
      {/* Editorial Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-[#0F0F0F] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
             <img src={config.heroImage} alt="Featured" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
            <div className="max-w-3xl animate-in slide-in-from-bottom-10 duration-1000">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-300 mb-6 block border-l-2 border-white pl-4">Premium Selection</span>
                <h1 className="font-serif text-6xl md:text-8xl font-medium mb-8 leading-[1.05] tracking-tight text-white">
                   {config.heroHeadline}
                </h1>
                <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-lg leading-relaxed font-light">
                    {config.heroSubheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        style={{ color: config.primaryColor }}
                    >
                        Explore Collection
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Scroll - Refined */}
      {featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-24 border-b border-neutral-100">
              <div className="flex justify-between items-end mb-12">
                  <h2 className="font-serif text-4xl font-medium text-neutral-900">Curator's Choice</h2>
                  <a href="#shop-section" className="text-xs font-bold uppercase tracking-widest underline underline-offset-8 decoration-neutral-300 hover:text-neutral-500 transition-colors">View All</a>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {featuredProducts.slice(0, 4).map((product, idx) => (
                      <div 
                          key={product.id} 
                          className="group flex flex-col cursor-pointer"
                          onClick={() => navigate(`/store/product/${product.id}`)}
                          style={{ animationDelay: `${idx * 100}ms` }}
                      >
                          <div className="aspect-[3/4] bg-[#FAFAFA] mb-6 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105">
                                  <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-contain mix-blend-multiply" 
                                  />
                              </div>
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                              <h3 className="font-serif text-lg font-medium text-neutral-900 leading-tight group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-2">{product.category}</p>
                              <div className="flex items-center justify-between mt-auto">
                                  <span className="text-sm font-semibold text-neutral-900">{CURRENCY}{product.price.toFixed(2)}</span>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); handleAddToCartClick(product); }}
                                      className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all"
                                      aria-label="Add to cart"
                                  >
                                      {addedToCartFeedback[product.id] ? <Check size={14} /> : <Plus size={14} />}
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      )}

      {/* Main Shop Grid - Filter Refined */}
      <section id="shop-section" className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur py-4 mb-12 border-b border-neutral-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="font-serif text-3xl font-medium">The Cellar</h2>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full border transition-all whitespace-nowrap ${
                                activeCategory === cat 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-black'
                            }`}
                            style={activeCategory === cat ? { backgroundColor: config.primaryColor, borderColor: config.primaryColor } : {}}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className={`grid gap-x-8 gap-y-16 ${config.layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map(product => (
                <div 
                    key={product.id} 
                    className={`group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 ${config.layout === 'list' ? 'flex-row items-center gap-8 p-6 border border-neutral-100 hover:border-neutral-200 transition-colors' : ''}`}
                >
                    <div 
                        onClick={() => navigate(`/store/product/${product.id}`)}
                        className={`${config.layout === 'grid' ? 'aspect-square bg-[#F9F9F9] p-8' : 'w-32 h-32 p-4 bg-[#F9F9F9]'} relative overflow-hidden cursor-pointer flex items-center justify-center`}
                    >
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                        />
                         {config.layout === 'grid' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleAddToCartClick(product); }}
                                className={`absolute bottom-4 right-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-black transition-all duration-300 ${addedToCartFeedback[product.id] ? 'bg-green-500 text-white' : 'hover:bg-black hover:text-white translate-y-14 group-hover:translate-y-0'}`}
                            >
                                {addedToCartFeedback[product.id] ? <Check size={16} /> : <Plus size={16} />}
                            </button>
                        )}
                    </div>
                    
                    <div className={`flex flex-col ${config.layout === 'grid' ? 'mt-6' : 'flex-1'}`}>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 
                                    onClick={() => navigate(`/store/product/${product.id}`)}
                                    className="font-serif text-lg text-neutral-900 leading-tight cursor-pointer hover:underline underline-offset-4 mb-1"
                                >
                                    {product.name}
                                </h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{product.category} • {product.volume}</p>
                            </div>
                            {config.layout === 'list' && (
                                <div className="text-right">
                                    <span className="block font-semibold text-lg">{CURRENCY}{product.price.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                        
                        {config.layout === 'list' && (
                             <div className="mt-4 flex justify-end">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); handleAddToCartClick(product); }}
                                    className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
                                    style={{ backgroundColor: addedToCartFeedback[product.id] ? '#22c55e' : config.primaryColor }}
                                 >
                                    {addedToCartFeedback[product.id] ? 'Added' : 'Add to Basket'}
                                 </button>
                             </div>
                        )}
                        
                        {config.layout === 'grid' && (
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm font-semibold text-neutral-900">{CURRENCY}{product.price.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Discovery Section */}
      <section className="grid md:grid-cols-2 min-h-[50vh]">
            <div className="relative group overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Wine" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col justify-center items-center text-white p-12 text-center">
                    <h3 className="font-serif text-5xl mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">The Sommelier</h3>
                    <p className="max-w-xs text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-8">Curated reds and sparkling whites from the world's finest vineyards.</p>
                    <span className="inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-widest">Shop Wine</span>
                </div>
            </div>
            <div className="relative group overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1574620593742-1e746dc178a5?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" alt="Spirits" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col justify-center items-center text-white p-12 text-center">
                    <h3 className="font-serif text-5xl mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">The Distiller</h3>
                    <p className="max-w-xs text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-8">Small batch whiskey, artisanal gin, and premium tequilas.</p>
                    <span className="inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-widest">Shop Spirits</span>
                </div>
            </div>
      </section>
    </div>
  );
};

export default StoreHome;
