import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Search, Filter, Edit2, Trash2, X, Sparkles, ImageIcon, Check, Box, Tag, ChevronRight } from '../common/Icons';
import { CURRENCY } from '../../constants';
import { GoogleGenAI } from "@google/genai";

const ProductManager: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this vintage from the collection?')) {
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
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 font-serif">Product Catalog</h1>
           <p className="text-gray-500 mt-1">Curate your premium collection of spirits and wines.</p>
        </div>
        <div className="flex items-center gap-4">
            {saveSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 animate-in slide-in-from-right-4">
                    <Check size={16} /> Changes Persistent
                </div>
            )}
            <button 
                onClick={handleAddNew}
                className="px-6 py-3 text-white rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
                style={{ backgroundColor: config.primaryColor }}
            >
                <Plus size={18} />
                Add New Asset
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collection..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-200 focus:ring-0 transition-all outline-none text-sm"
            />
         </div>
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
                <Filter size={18} />
                Filter
            </button>
            <div className="h-10 w-[1px] bg-gray-100 hidden sm:block"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                Total: {products.length}
            </p>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Asset Details</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Category</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Inventory</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                                <Box size={40} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400">No assets matching your search were found.</p>
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map(product => (
                            <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 p-2">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">{product.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">{product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                                        {product.subcategory || product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-gray-900 font-bold">
                                    {CURRENCY}{product.price.toLocaleString()}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between w-24">
                                            <span className="text-xs font-bold text-gray-500">{product.stock} units</span>
                                            <span className={`text-[10px] font-bold ${product.stock > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {product.stock > 10 ? 'Healthy' : 'Low'}
                                            </span>
                                        </div>
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button 
                                            onClick={() => handleEdit(product)}
                                            className="p-2.5 text-gray-400 hover:text-black hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
        sku: '',
        image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1000',
        abv: 0,
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
        if (!formData.name) return alert('Define the asset name first.');
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Hyper-luxury professional product catalog photography of ${formData.category} bottle named "${formData.name}". Minimalist dark aesthetic, dramatic backlighting, high contrast, 8k resolution, photorealistic.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: [{ parts: [{ text: prompt }] }],
                config: { imageConfig: { aspectRatio: "1:1" } }
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setFormData(prev => ({ ...prev, image: `data:image/png;base64,${part.inlineData.data}` }));
                    break;
                }
            }
        } catch (err) {
            console.error('AI failed:', err);
            alert('AI Sommelier is busy. Please try manual upload.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-serif">{product ? 'Refine Asset' : 'New Collection Entry'}</h2>
                        <p className="text-sm text-gray-500">All changes are saved to persistent local storage.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Asset Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Classification</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium appearance-none">
                                        <option>Spirits</option>
                                        <option>Wine</option>
                                        <option>Beer</option>
                                        <option>Snacks</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Price ({CURRENCY})</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-56 shrink-0">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3 ml-1">Asset Visual</label>
                            <div className="aspect-square bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden relative group shadow-inner flex items-center justify-center p-6">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105 duration-500" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4 gap-3">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-2.5 bg-white text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ImageIcon size={14} /> Upload
                                    </button>
                                    <button 
                                        onClick={generateImage}
                                        disabled={isGenerating}
                                        className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isGenerating ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={14} /> AI Sommelier</>}
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Inventory</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Volume</label>
                            <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">ABV (%)</label>
                            <input type="number" name="abv" value={formData.abv} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Provenance & Notes</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            rows={4} 
                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 outline-none transition-all font-medium resize-none"
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-gray-300 transition-all cursor-pointer" />
                        <label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">Showcase in Premier Collection (Homepage)</label>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 bg-white/95 backdrop-blur-md">
                    <button onClick={onClose} className="px-6 py-4 text-gray-500 font-bold uppercase tracking-widest text-[11px] hover:text-gray-900 transition-colors">Dismiss</button>
                    <button 
                        onClick={() => onSave(formData)} 
                        className="px-10 py-4 text-white rounded-2xl shadow-xl hover:opacity-90 transition-all font-bold uppercase tracking-widest text-[11px] flex items-center gap-3"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Check size={18} />
                        Update Catalog
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;