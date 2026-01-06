
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Plus, Check, ChevronRight, Truck, Box, Tag, ArrowUpRight, Minus } from '../common/Icons';
import { CURRENCY } from '../../constants';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, cart, config } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="max-w-7xl mx-auto px-6 py-32 text-center">
      <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-100">
          <Box size={32} className="text-neutral-300" />
      </div>
      <h2 className="font-serif text-3xl font-medium mb-3">Product Not Found</h2>
      <button 
        onClick={() => navigate('/store')}
        className="px-10 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-800"
      >
        Return to Cellar
      </button>
    </div>
  );

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white pb-24 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Product Image */}
          <div className="bg-[#FAFAFA] aspect-[4/5] flex items-center justify-center p-12 lg:p-20 sticky top-32 rounded-sm border border-neutral-50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-700"
            />
          </div>

          {/* Product Specs */}
          <div className="py-4 lg:py-10">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 border border-neutral-200 px-2 py-1 rounded">{product.category}</span>
                 {product.subcategory && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 border border-neutral-200 px-2 py-1 rounded">{product.subcategory}</span>}
              </div>
              <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6 leading-[1.1] text-neutral-900">{product.name}</h1>
              <div className="text-3xl font-medium mb-8 flex items-center gap-4">
                  <span style={{ color: config.primaryColor }}>{CURRENCY}{product.price.toFixed(2)}</span>
                  {product.comparePrice && <span className="text-xl text-neutral-300 line-through decoration-1">{CURRENCY}{product.comparePrice.toFixed(2)}</span>}
              </div>
              <p className="text-neutral-600 leading-relaxed text-lg max-w-lg mb-10 font-light">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12 border-y border-neutral-100 py-8">
                <div>
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">SKU</span>
                    <span className="font-medium text-sm">{product.sku}</span>
                </div>
                <div>
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Volume</span>
                    <span className="font-medium text-sm">{product.volume}</span>
                </div>
                {product.abv !== undefined && product.abv > 0 && (
                    <div>
                        <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Strength</span>
                        <span className="font-medium text-sm">{product.abv}% ABV</span>
                    </div>
                )}
                <div>
                    <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Availability</span>
                    <span className={`font-medium text-sm ${product.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                        {product.stock > 0 ? 'In Stock & Ready' : 'Sold Out'}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-6 max-w-md">
                <div className="flex items-stretch gap-4 h-14">
                    <div className="flex items-center border border-neutral-200 w-32 px-4">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-neutral-400 hover:text-black transition-colors p-2"
                        disabled={quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        className="flex-1 text-center font-bold text-sm bg-transparent outline-none"
                        value={quantity}
                        readOnly
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-neutral-400 hover:text-black transition-colors p-2"
                        disabled={quantity >= product.stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: added ? '#22c55e' : config.primaryColor }}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Unavailable' : added ? 'Added to Selection' : 'Add to Collection'}
                    </button>
                </div>
                
                <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <Truck size={16} className="text-neutral-300" />
                        <span>Free express delivery on orders over {CURRENCY}1500</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <Check size={16} className="text-neutral-300" />
                        <span>Secure checkout with Stripe encryption</span>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Suggestion Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-24 border-t border-neutral-100">
            <div className="flex justify-between items-end mb-12">
              <h3 className="font-serif text-3xl font-medium">You May Also Appreciate</h3>
              <button onClick={() => navigate('/store')} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-70">View All</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map(rp => (
                <div 
                  key={rp.id}
                  onClick={() => navigate(`/store/product/${rp.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-[#FAFAFA] flex items-center justify-center p-8 mb-6 relative overflow-hidden">
                     <img src={rp.image} alt={rp.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-serif text-lg text-neutral-900 mb-1 group-hover:underline decoration-1 underline-offset-4">{rp.name}</h4>
                  <p className="text-sm font-medium text-neutral-500">{CURRENCY}{rp.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
