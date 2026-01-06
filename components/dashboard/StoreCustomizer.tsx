
import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { PrimaryColorPreset } from '../../types';
import { Palette, LayoutDashboard, Monitor, Smartphone, Check, Menu, ImageIcon, Plus, Trash2, Globe, Sparkles, X, ChevronRight, ShoppingCart, User } from '../common/Icons';

const StoreCustomizer: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'visuals' | 'content'>('visuals');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const presets = Object.values(PrimaryColorPreset);

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            updateConfig({ heroImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
        setIsPublishing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Editor Panel */}
      <div className="w-full lg:w-96 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
                <Palette size={16} className="text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Design System</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Brand Editor</h2>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
                onClick={() => setActiveTab('visuals')}
                className={`flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'visuals' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Visual Identity
                {activeTab === 'visuals' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'content' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Editorial
                {activeTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900"></div>}
            </button>
        </div>
        
        <div className="flex-1 p-8 space-y-10 overflow-y-auto custom-scrollbar">
            {activeTab === 'visuals' ? (
                <>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Signature Palette</label>
                        <div className="grid grid-cols-4 gap-4">
                            {presets.map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateConfig({ primaryColor: color })}
                                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm ${config.primaryColor === color ? 'ring-4 ring-offset-2' : 'hover:ring-4 hover:ring-gray-100'}`}
                                    style={{ backgroundColor: color, ringColor: `${color}40` } as any}
                                >
                                    {config.primaryColor === color && <Check size={20} className="text-white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Asset Architecture</label>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button 
                                onClick={() => updateConfig({ layout: 'grid' })}
                                className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${config.layout === 'grid' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutDashboard size={14} className="mr-2" /> Gallery
                            </button>
                            <button 
                                onClick={() => updateConfig({ layout: 'list' })}
                                className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${config.layout === 'list' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Menu size={14} className="mr-2" /> Index
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Primary Cinematic Asset</label>
                        <div className="relative group aspect-[16/10] bg-gray-100 rounded-3xl border border-gray-100 overflow-hidden shadow-inner">
                            <img src={config.heroImage} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" alt="Hero" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button 
                                    onClick={() => heroInputRef.current?.click()}
                                    className="px-6 py-3 bg-white rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
                                >
                                    <ImageIcon size={14} /> Change Asset
                                </button>
                            </div>
                            <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={handleHeroUpload} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Boutique Nomenclature</label>
                        <input 
                            type="text" 
                            value={config.storeName}
                            onChange={(e) => updateConfig({ storeName: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-serif text-lg font-bold"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Main Narrative</label>
                        <textarea 
                            value={config.heroHeadline}
                            onChange={(e) => updateConfig({ heroHeadline: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-serif text-2xl font-medium resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Sub-Narrative</label>
                        <textarea 
                            value={config.heroSubheadline}
                            onChange={(e) => updateConfig({ heroSubheadline: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-light leading-relaxed resize-none"
                            rows={4}
                        />
                    </div>
                </div>
            )}
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            {showSuccess ? (
                <div className="w-full py-5 bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl flex items-center justify-center gap-3 animate-in zoom-in-95">
                    <Check size={16} /> Changes Synchronized
                </div>
            ) : (
                <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full py-5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                    {isPublishing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} /> Update Boutique
                        </>
                    )}
                </button>
            )}
        </div>
      </div>

      {/* Production Preview */}
      <div className="flex-1 flex flex-col bg-gray-100/50 rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-inner relative group">
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Live Production Preview</span>
            </div>
            <div className="flex bg-gray-200/50 p-1.5 rounded-2xl border border-gray-200">
                <button 
                    onClick={() => setDeviceView('desktop')}
                    className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${deviceView === 'desktop' ? 'bg-white shadow-lg text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Monitor size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Desktop</span>
                </button>
                <button 
                    onClick={() => setDeviceView('mobile')}
                    className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${deviceView === 'mobile' ? 'bg-white shadow-lg text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Smartphone size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">Mobile</span>
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-8 sm:p-12 flex justify-center items-center bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:24px_24px]">
            <div 
                className={`bg-white shadow-2xl transition-all duration-700 overflow-hidden flex flex-col border border-gray-200 relative ${deviceView === 'mobile' ? 'w-[390px] h-[800px] rounded-[3.5rem] border-[12px] border-gray-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_50px_100px_-20px_rgba(0,0,0,0.4)]' : 'w-full h-full rounded-3xl'}`}
            >
                {deviceView === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-30"></div>
                )}
                
                {/* Mock Browser/App Header */}
                <div className="h-20 border-b border-gray-50 flex items-center justify-between px-8 flex-shrink-0 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Menu size={20} className="text-gray-900" />
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-serif italic text-2xl font-bold" style={{ backgroundColor: config.primaryColor }}>L</div>
                    </div>
                    <div className="font-serif font-bold text-gray-900 tracking-tight text-xl">{config.storeName}</div>
                    <div className="flex gap-4">
                        <User size={20} className="text-gray-900" />
                        <ShoppingCart size={20} className="text-gray-900" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                    {/* Hero Section */}
                    <div className="relative h-[400px] bg-gray-900 flex-shrink-0">
                        <img src={config.heroImage} className="w-full h-full object-cover opacity-70" alt="Hero" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10 text-white">
                            <h2 className="font-serif text-4xl font-medium mb-4 leading-tight">{config.heroHeadline}</h2>
                            <p className="text-xs opacity-90 line-clamp-3 leading-relaxed max-w-sm mb-8 font-light tracking-wide">{config.heroSubheadline}</p>
                            <button className="w-fit px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-black shadow-2xl">Shop Selection</button>
                        </div>
                    </div>

                    {/* Collection Section */}
                    <div className="p-10">
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Our Vintage Collection</h3>
                            <ChevronRight size={16} className="text-gray-300" />
                        </div>
                        <div className={`grid gap-10 ${config.layout === 'grid' ? (deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3') : 'grid-cols-1'}`}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`group animate-in fade-in duration-500 delay-${i*100} ${config.layout === 'list' ? 'flex gap-8 items-center border-b border-gray-50 pb-8' : ''}`}>
                                    <div className={`bg-gray-50 rounded-[2rem] overflow-hidden p-8 flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-[1.02] transition-transform ${config.layout === 'grid' ? 'aspect-square w-full mb-5' : 'h-32 w-32 flex-shrink-0'}`}>
                                        <div className="w-full h-full bg-gray-200/40 rounded-2xl animate-pulse"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-3 w-32 bg-gray-100 rounded-full mb-3"></div>
                                        <div className="h-2 w-20 bg-gray-50 rounded-full mb-4"></div>
                                        <div className="h-3 w-16 bg-gray-900/5 rounded-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCustomizer;
