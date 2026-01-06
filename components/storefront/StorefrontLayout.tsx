
import React, { useState } from 'react';
import { Outlet, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Search, Menu, User, X, ShoppingBag, ChevronRight, LogOut, ArrowRight, MapPin } from '../common/Icons';
import { CURRENCY } from '../../constants';
import AIConcierge from './AIConcierge';

const StorefrontLayout: React.FC = () => {
  const { config, cart, removeFromCart, updateCartItemQuantity } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearchTerm = searchParams.get('searchTerm') || '';
  const [searchInput, setSearchInput] = useState(currentSearchTerm);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const categories = [
    { name: 'Spirits', sub: ['Whisky', 'Gin', 'Tequila', 'Vodka', 'Rum'] },
    { name: 'Wine', sub: ['Red', 'White', 'Champagne', 'Rosé'] },
    { name: 'Beer', sub: ['IPA', 'Lager', 'Craft'] },
    { name: 'Snacks', sub: ['Olives', 'Crisps', 'Nuts'] }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/store?searchTerm=${encodeURIComponent(searchInput)}`);
    } else {
      searchParams.delete('searchTerm');
      setSearchParams(searchParams);
      navigate('/store');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-neutral-100">
      <AIConcierge />
      
      {/* Side Navigation Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-serif font-bold text-2xl tracking-tighter">LIQUOR SPOT</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-8">
                <div className="space-y-10">
                    {categories.map((cat) => (
                        <div key={cat.name}>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4">{cat.name}</h3>
                            <ul className="space-y-4">
                                {cat.sub.map(sub => (
                                    <li key={sub}>
                                        <button 
                                            onClick={() => { navigate(`/store?searchTerm=${sub}`); setIsMenuOpen(false); }}
                                            className="text-lg font-medium hover:pl-2 transition-all flex items-center gap-2 group"
                                        >
                                            {sub} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>

            <div className="p-8 border-t border-neutral-100 space-y-4">
                <button onClick={() => { navigate('/store/account'); setIsMenuOpen(false); }} className="w-full py-4 border border-neutral-200 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3">
                    <User size={18} /> My Account
                </button>
                <button onClick={() => { navigate('/store/track-order'); setIsMenuOpen(false); }} className="w-full py-4 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors">
                    Track Order
                </button>
            </div>
        </div>
      </div>

      {/* Boutique Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button onClick={() => setIsMenuOpen(true)} className="p-2 -ml-2 text-black hover:opacity-70 transition-opacity" aria-label="Open Menu">
                    <Menu size={24} />
                </button>
                <Link to="/store" className="group flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center text-white font-serif italic text-xl transition-transform group-hover:scale-105" style={{ backgroundColor: config.primaryColor }}>L</div>
                    <span className="font-serif font-bold text-2xl tracking-tight hidden sm:block">Liquor Spot</span>
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative group">
                    <input 
                        type="text" 
                        placeholder="Search collection..."
                        className="w-48 bg-neutral-50 rounded-full px-5 py-2 text-sm transition-all focus:w-64 outline-none border border-neutral-200"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Search size={16} className="absolute right-4 text-neutral-400" />
                </form>
                
                <button onClick={() => navigate('/store/track-order')} className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors px-3 py-2 border border-transparent hover:border-neutral-100 rounded-full">
                    Track Order
                </button>

                <div className="h-6 w-[1px] bg-neutral-100 hidden sm:block mx-2"></div>

                <button onClick={() => navigate('/store/auth')} className="p-2.5 text-neutral-600 hover:text-black transition-colors rounded-full" aria-label="Account">
                    <User size={20} />
                </button>
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="p-2.5 bg-black text-white rounded-full relative hover:opacity-90 transition-opacity ml-2"
                    aria-label="Cart"
                >
                    <ShoppingCart size={18} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black border-2 border-black text-[10px] font-bold rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Cart Slider */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Selection</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag size={48} strokeWidth={1} className="mb-6 text-neutral-200" />
                            <p className="text-neutral-500 font-serif">Your basket is currently empty.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.productId} className="flex gap-4">
                                <div className="w-20 h-24 bg-neutral-50 p-2 rounded flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="font-serif text-sm font-medium leading-tight">{item.name}</h4>
                                        <p className="text-xs text-neutral-400 mt-1">{CURRENCY}{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)} className="text-neutral-400 hover:text-black"><X size={10} /></button>
                                            <span className="text-xs font-bold">{item.quantity}</span>
                                            <button onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)} className="text-neutral-400 hover:text-black"><ArrowRight size={10} className="-rotate-90" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.productId)} className="text-[10px] font-bold uppercase text-red-500">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="p-8 border-t border-neutral-100 bg-neutral-50">
                        <div className="flex justify-between mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total</span>
                            <span className="text-xl font-medium">{CURRENCY}{cartTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => { setIsCartOpen(false); navigate('/store/checkout'); }}
                            className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontLayout;
