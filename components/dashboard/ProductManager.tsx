import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Search, Filter, Edit2, Trash2, X, Sparkles, ImageIcon, Check } from '../common/Icons';
import { CURRENCY } from '../../constants';
import { GoogleGenAI } from "@google/genai";

const ProductManager: React.FC = () => {
  const { products, deleteProduct, addProduct, updateProduct, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Products</h1>
           <p className="text-gray-500">Manage your inventory and catalog.</p>
        </div>
        <button 
            onClick={handleAddNew}
            className="px-4 py-2 text-white rounded-lg shadow-sm hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: config.primaryColor }}
            aria-label="Add new product"
        >
            <Plus size={18} aria-hidden="true" />
            <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                aria-label="Search products"
            />
         </div>
         <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm" aria-label="Filter products">
            <Filter size={16} aria-hidden="true" />
            <span>Filter</span>
         </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.volume} • {product.abv}% ABV</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-medium">
                                {CURRENCY}{product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} aria-hidden="true"></div>
                                    <span className="text-sm text-gray-600">{product.stock}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(product)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                        aria-label={`Edit ${product.name}`}
                                    >
                                        <Edit2 size={16} aria-hidden="true" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        aria-label={`Delete ${product.name}`}
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            product={editingProduct} 
            onSave={(p: Product) => {
                if (editingProduct) {
                    updateProduct(editingProduct.id, p);
                } else {
                    addProduct(p);
                }
                setIsModalOpen(false);
            }}
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
        if (!formData.name) return alert('Please enter a product name first.');
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `High-end commercial product photography of a ${formData.category} bottle named "${formData.name}". Minimalist aesthetics, studio lighting, clean white background, 4k resolution, extremely detailed, photorealistic.`;
            
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
            console.error('Image generation failed:', err);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none">
                                        <option>Spirits</option>
                                        <option>Wine</option>
                                        <option>Beer</option>
                                        <option>Snacks</option>
                                        <option>Mixers</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                    <input type="text" name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="e.g. Gin" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" step="0.01" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
                                </div>
                             </div>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative group">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                <div className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex flex-col gap-2 w-32">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-2 bg-white text-gray-900 rounded-md text-[10px] font-bold uppercase hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 shadow-sm"
                                        >
                                            <ImageIcon size={12} /> Upload
                                        </button>
                                        <button 
                                            onClick={generateImage}
                                            disabled={isGenerating}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md text-[10px] font-bold uppercase hover:bg-blue-500 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 shadow-sm"
                                        >
                                            {isGenerating ? 'Thinking...' : <><Sparkles size={12} /> AI Generate</>}
                                        </button>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ABV (%)</label>
                            <input type="number" name="abv" value={formData.abv} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" step="0.1" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg outline-none" rows={3}></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700">Feature on Home Page</label>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                    <button onClick={() => onSave(formData)} className="px-6 py-2 text-white rounded-lg shadow-sm hover:opacity-90 flex items-center gap-2 font-medium" style={{ backgroundColor: primaryColor }}>
                        <Check size={18} />
                        Save Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductManager;