
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
// Added missing Package icon import
import { Plus, Search, Filter, Edit2, Trash2, X, Sparkles, ImageIcon, Check, Box, Tag, ChevronRight, AlertCircle, Package } from '../common/Icons';
import { CURRENCY } from '../../constants';
import { GoogleGenAI } from "@google/genai";

const ProductManager: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this asset from your master catalog? This action is permanent.')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const onModalSave = (p: any) => {
    if (editingProduct) {
        updateProduct(editingProduct.id, p);
    } else {
        addProduct(p);
    }
    setIsModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
               <Package size={16} className="text-gray-400" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Inventory Control</span>
           </div>
           <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">Master Catalog</h1>
        </div>
        <div className="flex items-center gap-4">
            {showSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 animate-in slide-in-from-right-4">
                    <Check size={14} /> Catalog Updated
                </div>
            )}
            <button 
                onClick={handleAddNew}
                className="px-8 py-4 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-bold uppercase tracking-[0.15em] text-[11px]"
                style={{ backgroundColor: config.primaryColor }}
            >
                <Plus size={18} />
                Entry New Asset
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vintages, categories, SKUs..." 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 transition-all outline-none text-sm font-medium"
            />
         </div>
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 text-gray-600 text-[11px] font-bold uppercase tracking-widest transition-all">
                <Filter size={16} />
                Sort / Filter
            </button>
            <div className="h-10 w-[1px] bg-gray-100 hidden sm:block"></div>
            <div className="flex flex-col text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total SKU Volume</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{products.length} Assets</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Vintage Identity</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Classification</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Asset Valuation</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Stock Health</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-10 py-32 text-center">
                                <Box size={64} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 font-serif">No Assets Located</h3>
                                <p className="text-gray-400 max-w-xs mx-auto mt-2">Try adjusting your search filters or add a new entry to the collection.</p>
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 p-3 group-hover:scale-110 transition-transform duration-500">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg leading-tight tracking-tight">{product.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1.5 uppercase tracking-widest">{product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                                        {product.subcategory || product.category}
                                    </span>
                                </td>
                                <td className="px-10 py-6">
                                    <p className="text-lg font-bold text-gray-900">{CURRENCY}{product.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">Per Unit</p>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between w-32">
                                            <span className="text-xs font-bold text-gray-600">{product.stock} Units</span>
                                            {product.stock < 10 && <AlertCircle size={14} className="text-amber-500" />}
                                        </div>
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${product.stock > 15 ? 'bg-emerald-500' : product.stock > 5 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="p-3 text-gray-400 hover:text-black hover:bg-white hover:shadow-xl rounded-2xl transition-all"
                                            aria-label="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:shadow-xl rounded-2xl transition-all"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            product={editingProduct} 
            onSave={onModalSave}
            primaryColor={config.primaryColor}
        />
      )}
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, product, onSave, primaryColor }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        category: 'Spirits',
        subcategory: '',
        price: 0,
        stock: 0,
        description: '',
        sku: `LS-${Math.random().toString(36).substring(7).toUpperCase()}`,
        image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1000',
        abv: 40.0,
        volume: '750ml',
        featured: false
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const generateImage = async () => {
        if (!formData.name) return alert('Asset name is required for AI processing.');
        setIsGenerating(true);
        try {
            // Updated GoogleGenAI initialization and generateContent call per coding guidelines
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Extreme luxury commercial product photography of a premium ${formData.category} bottle named "${formData.name}". Minimalist lighting, deep shadows, ultra-high resolution, studio background, elegant composition, 8k.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { imageConfig: { aspectRatio: "1:1" } }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setFormData(prev => ({ ...prev, image: `data:image/png;base64,${part.inlineData.data}` }));
                    break;
                }
            }
        } catch (err) {
            console.error('AI Processing Error:', err);
            alert('AI Sommelier is currently at capacity. Please upload manually.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 overflow-hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl relative z-10 max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif tracking-tight">{product ? 'Update Asset' : 'Catalog New Entry'}</h2>
                        <p className="text-sm text-gray-400 mt-1">Refining the master collection inventory.</p>
                    </div>
                    <button onClick={onClose} className="p-4 hover:bg-gray-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
                </div>
                
                <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Asset Nomenclature</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Vintage Highland Single Malt"
                                    className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold text-lg" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Classification</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold appearance-none">
                                        <option>Spirits</option>
                                        <option>Wine</option>
                                        <option>Beer</option>
                                        <option>Snacks</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Valuation ({CURRENCY})</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full lg:w-64 shrink-0">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-4 ml-1">Cinematic Visual</label>
                            <div className="aspect-square bg-gray-50 border border-gray-100 rounded-[2.5rem] overflow-hidden relative group shadow-inner flex items-center justify-center p-8">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-1000" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 gap-3">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3 bg-white text-gray-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2"
                                    >
                                        <ImageIcon size={14} /> Upload File
                                    </button>
                                    <button 
                                        onClick={generateImage}
                                        disabled={isGenerating}
                                        className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={14} /> AI Sommelier</>}
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Stock Vol.</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Unit Volume</label>
                            <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">ABV %</label>
                            <input type="number" name="abv" value={formData.abv} onChange={handleChange} className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-3xl focus:bg-white focus:border-gray-200 outline-none transition-all font-bold" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1">Editorial Notes & Provenance</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={4} 
                            className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-gray-200 outline-none transition-all font-medium resize-none leading-relaxed"
                            placeholder="Describe the notes, origin and character of this selection..."
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                        <input 
                            type="checkbox" 
                            name="featured" 
                            id="featured" 
                            checked={formData.featured} 
                            onChange={handleChange} 
                            className="w-6 h-6 rounded-lg text-gray-900 focus:ring-gray-900 border-gray-200 transition-all cursor-pointer" 
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">Promote to Premier Collection Spotlight</label>
                    </div>
                </div>

                <div className="p-10 border-t border-gray-100 flex justify-end gap-6 sticky bottom-0 bg-white/95 backdrop-blur-md">
                    <button onClick={onClose} className="px-8 py-5 text-gray-400 font-bold uppercase tracking-widest text-[11px] hover:text-gray-900 transition-all">Dismiss</button>
                    <button 
                        onClick={() => onSave(formData)} 
                        className="px-12 py-5 text-white rounded-[1.5rem] shadow-2xl hover:opacity-90 active:scale-95 transition-all font-bold uppercase tracking-[0.2em] text-[11px] flex items-center gap-3"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Check size={18} />
                        Update Catalog Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
