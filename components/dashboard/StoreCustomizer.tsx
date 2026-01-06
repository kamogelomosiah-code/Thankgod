import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { PrimaryColorPreset } from '../../types';
import { Palette, LayoutDashboard, Monitor, Smartphone, Check, Menu, ImageIcon, Plus, Trash2, Globe, Sparkles } from '../common/Icons';

const StoreCustomizer: React.FC = () => {
  const { config, updateConfig } = useStore();
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'visuals' | 'content'>('visuals');
  const [isPublishing, setIsPublishing] = useState(false);
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
    setTimeout(() => setIsPublishing(false), 1500);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
      {/* Settings Panel */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Storefront Editor</h2>
            <p className="text-sm text-gray-500 mt-1">Real-time design engine for your brand.</p>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
                onClick={() => setActiveTab('visuals')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'visuals' ? 'bg-white text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Visuals & Theme
            </button>
            <button 
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-white text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Editorial Content
            </button>
        </div>
        
        <div className="flex-1 p-6 space-y-10 overflow-y-auto custom-scrollbar">
            {activeTab === 'visuals' ? (
                <>
                    {/* Color Section */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Primary Brand Signature</label>
                        <div className="grid grid-cols-4 gap-4">
                            {presets.map(color => (
                                <button
                                    key={color}
                                    onClick={() => updateConfig({ primaryColor: color })}
                                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${config.primaryColor === color ? 'ring-4 ring-offset-2' : 'hover:ring-4 hover:ring-gray-100'}`}
                                    style={{ backgroundColor: color, ringColor: `${color}40` } as any}
                                    aria-label={`Set brand color to ${color}`}
                                >
                                    {config.primaryColor === color && <Check size={20} className="text-white drop-shadow-sm" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Layout Options */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Collection Architecture</label>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            <button 
                                onClick={() => updateConfig({ layout: 'grid' })}
                                className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${config.layout === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutDashboard size={16} className="mr-2" /> Gallery
                            </button>
                            <button 
                                onClick={() => updateConfig({ layout: 'list' })}
                                className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${config.layout === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Menu size={16} className="mr-2" /> List
                            </button>
                        </div>
                    </div>

                    {/* Hero Asset */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Hero Cinematography</label>
                        <div className="relative group aspect-[16/10] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                            <img src={config.heroImage} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt="Hero Asset" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                <button 
                                    onClick={() => heroInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-white rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-100 transition-all shadow-xl flex items-center gap-2"
                                >
                                    <ImageIcon size={14} /> Replace Asset
                                </button>
                            </div>
                            <input type="file" ref={heroInputRef} className="hidden" accept="image/*" onChange={handleHeroUpload} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Boutique Name</label>
                        <input 
                            type="text" 
                            value={config.storeName}
                            onChange={(e) => updateConfig({ storeName: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Editorial Headline</label>
                        <input 
                            type="text" 
                            value={config.heroHeadline}
                            onChange={(e) => updateConfig({ heroHeadline: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Editorial Subtext</label>
                        <textarea 
                            value={config.heroSubheadline}
                            onChange={(e) => updateConfig({ heroSubheadline: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium resize-none"
                            rows={4}
                        />
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
                {isPublishing ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Syncing...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} /> Publish Changes
                    </>
                )}
            </button>
        </div>
      </div>

      {/* Live Preview Container */}
      <div className="flex-1 flex flex-col bg-gray-100/50 rounded-3xl border border-gray-200 overflow-hidden shadow-inner relative">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Production Preview</span>
            </div>
            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-sm">
                <button 
                    onClick={() => setDeviceView('desktop')}
                    className={`p-2.5 rounded-lg transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Monitor size={18} />
                </button>
                <button 
                    onClick={() => setDeviceView('mobile')}
                    className={`p-2.5 rounded-lg transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Smartphone size={18} />
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
            <div 
                className={`bg-white shadow-2xl transition-all duration-700 overflow-hidden flex flex-col border border-gray-200 ${deviceView === 'mobile' ? 'w-[390px] h-[844px] rounded-[3rem] border-[12px] border-gray-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_50px_100px_-20px_rgba(0,0,0,0.3)]' : 'w-full h-full rounded-2xl'}`}
            >
                {/* Mock Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-serif italic text-xl font-bold" style={{ backgroundColor: config.primaryColor }}>L</div>
                    <div className="font-serif font-bold text-gray-900 tracking-tight">{config.storeName}</div>
                    <div className="flex gap-4">
                        <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-100"></div>
                    </div>
                </div>

                {/* Mock Hero */}
                <div className="relative h-64 bg-gray-900 flex-shrink-0">
                    <img src={config.heroImage} className="w-full h-full object-cover opacity-60" alt="Hero" />
                    <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
                        <h2 className="font-serif text-3xl font-bold mb-3 leading-[1.1]">{config.heroHeadline}</h2>
                        <p className="text-[11px] opacity-90 line-clamp-2 leading-relaxed max-w-sm">{config.heroSubheadline}</p>
                        <button className="mt-6 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest w-fit bg-white text-gray-900 shadow-xl">Shop Selection</button>
                    </div>
                </div>

                {/* Mock Content */}
                <div className="p-8 bg-gray-50 flex-1 overflow-hidden">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Featured Assets</h3>
                    <div className={`grid gap-6 ${config.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {[1, 2, 3, 4].map(i => (
                             <div key={i} className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500 delay-${i*100} ${config.layout === 'list' ? 'flex gap-5 items-center p-4' : ''}`}>
                                <div className={`bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center ${config.layout === 'grid' ? 'aspect-square w-full mb-3' : 'h-16 w-16 flex-shrink-0'}`}>
                                    <div className="w-full h-full bg-gray-200/50 rounded-lg"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2.5 w-20 bg-gray-100 rounded-full mb-2"></div>
                                    <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
                                </div>
                                {config.layout === 'list' && (
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">+</div>
                                )}
                             </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCustomizer;