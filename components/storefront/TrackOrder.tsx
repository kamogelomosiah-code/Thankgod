import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Search, Package, Truck, Check, MapPin, Box, ChevronRight, Clock } from '../common/Icons';
import { CURRENCY } from '../../constants';

const TrackOrder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, config } = useStore();
  
  const queryParams = new URLSearchParams(location.search);
  const initialId = queryParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initialId);
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError('');
    
    // Simulate lookup delay
    setTimeout(() => {
      const order = orders.find(o => o.id === orderId.trim());
      if (order) {
        setFoundOrder(order);
      } else {
        setFoundOrder(null);
        setError('Order not found. Please check your ID and try again.');
      }
      setIsSearching(false);
    }, 800);
  };

  useEffect(() => {
    if (initialId) {
      handleSearch();
    }
  }, [initialId, orders]);

  const steps = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'processing', label: 'Preparing Selection', icon: Package },
    { key: 'out-for-delivery', label: 'En Route', icon: Truck },
    { key: 'delivered', label: 'In Your Cellar', icon: Check }
  ];

  const getActiveStep = (status: string) => {
    const statusMap: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'processing': 1,
      'out-for-delivery': 2,
      'delivered': 3
    };
    return statusMap[status] ?? 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 lg:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
            <h1 className="font-serif text-4xl mb-3">Track Your Collection</h1>
            <p className="text-neutral-500 text-sm font-light">Enter your Order ID to see real-time delivery status.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                    <input 
                        type="text" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="ORD-XXXXXX"
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black transition-colors"
                    />
                </div>
                <button 
                    disabled={isSearching}
                    className="px-8 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    style={{ backgroundColor: config.primaryColor }}
                >
                    {isSearching ? 'Searching...' : 'Track'}
                </button>
            </form>
            {error && <p className="mt-4 text-xs text-red-500 font-bold ml-2">{error}</p>}
        </div>

        {foundOrder && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                  <div className="flex justify-between items-start mb-12">
                      <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Status</span>
                          <h2 className="text-2xl font-serif font-medium">{foundOrder.status.replace(/-/g, ' ').toUpperCase()}</h2>
                      </div>
                      <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Estimate Arrival</span>
                          <p className="text-sm font-medium">Within 60 Minutes</p>
                      </div>
                  </div>

                  <div className="relative flex justify-between items-center px-4">
                      {/* Progress Line */}
                      <div className="absolute left-10 right-10 top-5 h-[2px] bg-neutral-100 -z-0">
                          <div 
                            className="h-full bg-black transition-all duration-1000"
                            style={{ width: `${(getActiveStep(foundOrder.status) / (steps.length - 1)) * 100}%`, backgroundColor: config.primaryColor }}
                          ></div>
                      </div>

                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx <= getActiveStep(foundOrder.status);
                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-white border-black' : 'bg-white border-neutral-100 text-neutral-200'}`} style={isActive ? { borderColor: config.primaryColor } : {}}>
                                  <Icon size={18} style={isActive ? { color: config.primaryColor } : {}} />
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-widest text-center max-w-[60px] ${isActive ? 'text-black' : 'text-neutral-300'}`}>{step.label}</span>
                          </div>
                        );
                      })}
                  </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6 pb-2 border-b border-neutral-50">Selection Details</h3>
                  <div className="space-y-4">
                      {foundOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-neutral-600">{item.name} <span className="text-neutral-300 ml-2">x{item.quantity}</span></span>
                              <span className="font-medium">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                      ))}
                      <div className="pt-4 mt-4 border-t border-neutral-100 flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-widest">Total Collection Value</span>
                          <span className="text-lg font-bold">{CURRENCY}{foundOrder.total.toFixed(2)}</span>
                      </div>
                  </div>
              </div>

              <div className="flex gap-4">
                  <button onClick={() => navigate('/store')} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">Return to Cellar</button>
                  <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                      <Clock size={14} /> Need Help?
                  </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;