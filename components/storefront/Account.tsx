import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { User, ShoppingBag, MapPin, LogOut, ChevronRight, Package, Truck, Check } from '../common/Icons';
import { CURRENCY } from '../../constants';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const { config, orders } = useStore();

  // Mock user data - in a real app, this would come from an auth context
  const user = {
    name: 'Adebayo Mensah',
    email: 'ade@lagos.com',
    memberSince: 'January 2023',
    ordersCount: 1,
    tier: 'Platinum Member'
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100 relative overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=adebayo" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h2 className="font-serif text-2xl font-medium mb-1">{user.name}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">{user.tier}</p>
              
              <div className="w-full pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xl font-bold">{user.ordersCount}</span>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Orders</span>
                </div>
                <div>
                  <span className="block text-xl font-bold">2.4k</span>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Points</span>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <button className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium hover:bg-neutral-50 transition-colors border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-neutral-400" />
                  Order History
                </div>
                <ChevronRight size={14} className="text-neutral-300" />
              </button>
              <button className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium hover:bg-neutral-50 transition-colors border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-neutral-400" />
                  Saved Addresses
                </div>
                <ChevronRight size={14} className="text-neutral-300" />
              </button>
              <button className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium hover:bg-neutral-50 transition-colors border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-neutral-400" />
                  Account Settings
                </div>
                <ChevronRight size={14} className="text-neutral-300" />
              </button>
              <button 
                onClick={() => navigate('/store')}
                className="w-full px-6 py-4 flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-medium">Order History</h1>
                <p className="text-neutral-500 text-sm">Manage and track your previous selections.</p>
              </div>
              <button 
                onClick={() => navigate('/store/track-order')}
                className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-lg"
              >
                Track Guest Order
              </button>
            </header>

            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-neutral-100 text-center flex flex-col items-center">
                  <Package size={48} strokeWidth={1} className="text-neutral-200 mb-6" />
                  <p className="text-neutral-500 font-serif mb-6">You haven't made any orders yet.</p>
                  <button onClick={() => navigate('/store')} className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-70">Begin Your Collection</button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/50">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Order ID</span>
                          <span className="font-mono text-sm font-medium">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Placed On</span>
                          <span className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Total Amount</span>
                          <span className="text-sm font-medium">{CURRENCY}{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{order.status.replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 mb-8">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="w-16 h-20 bg-neutral-50 rounded-lg p-2 flex-shrink-0 border border-neutral-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Truck size={14} /> Express Delivery
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Check size={14} className="text-green-500" /> Signature Required
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate(`/store/track-order?id=${order.id}`)}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline decoration-1 underline-offset-4"
                          style={{ color: config.primaryColor }}
                        >
                          View Progress <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;