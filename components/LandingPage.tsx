
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, ArrowRight } from './common/Icons';
import { useStore } from '../context/StoreContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { config } = useStore();

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row animate-in fade-in duration-1000">
      {/* Customer Side */}
      <div 
        onClick={() => navigate('/store')}
        className="flex-1 group relative flex flex-col items-center justify-center p-12 border-b md:border-b-0 md:border-r border-neutral-100 cursor-pointer overflow-hidden transition-all duration-700 hover:bg-neutral-50"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 text-white rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: config.primaryColor }}>
                <ShoppingBag size={28} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-4">Customer Portal</span>
            <h2 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight">Enter the <br/>Boutique</h2>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed mb-8">
                Explore our curated collection of fine spirits and rare vintages.
            </p>
            <div 
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all"
                style={{ color: config.primaryColor }}
            >
                Shop Now <ArrowRight size={14} />
            </div>
        </div>
      </div>

      {/* Staff Side */}
      <div 
        onClick={() => navigate('/dashboard')}
        className="flex-1 group relative flex flex-col items-center justify-center p-12 cursor-pointer overflow-hidden transition-all duration-700 hover:bg-neutral-900"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[url('https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500" style={{ color: config.primaryColor }}>
                <LayoutDashboard size={28} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 group-hover:text-neutral-500 mb-4 transition-colors">Internal Access</span>
            <h2 className="font-serif text-5xl md:text-6xl font-medium mb-6 leading-tight group-hover:text-white transition-colors">Staff <br/>Management</h2>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed mb-8 group-hover:text-neutral-400 transition-colors">
                Control inventory, manage orders, and customize your store presence.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black group-hover:text-white group-hover:gap-4 transition-all">
                Open Dashboard <ArrowRight size={14} />
            </div>
        </div>
      </div>

      {/* Center Logo Bridge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 z-20 pointer-events-none">
          <div className="w-16 h-16 bg-white border border-neutral-100 shadow-2xl rounded-full flex items-center justify-center font-serif italic text-2xl font-bold">
            S
          </div>
          <div className="h-20 w-[1px] bg-neutral-100"></div>
      </div>
    </div>
  );
};

export default LandingPage;
