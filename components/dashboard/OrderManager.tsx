
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
// Added missing ShoppingCart and User icon imports
import { Search, Filter, Eye, Clock, Calendar, Check, X, Truck, ChevronRight, Package, MapPin, Phone, Mail, Box, ShoppingCart, User } from '../common/Icons';
import { CURRENCY } from '../../constants';

const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'out-for-delivery': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'cancelled': return 'bg-gray-100 text-gray-400 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
               <ShoppingCart size={16} className="text-gray-400" />
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Order Fulfilment</span>
           </div>
           <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">Sales Pipeline</h1>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pending Actions</p>
                    <p className="text-xl font-bold text-gray-900 leading-none">{orders.filter(o => o.status === 'pending').length} Orders</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders, customers, emails..." 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-gray-200 transition-all outline-none text-sm font-medium"
            />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {['All', 'pending', 'processing', 'out-for-delivery', 'delivered', 'cancelled'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        statusFilter === status 
                            ? `bg-gray-900 text-white border-gray-900 shadow-lg` 
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                    }`}
                >
                    {status.replace(/-/g, ' ')}
                </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer Profile</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total Value</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fulfilment Status</th>
                        <th className="px-10 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Review</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-10 py-32 text-center">
                                <Box size={64} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 font-serif">No Records Found</h3>
                                <p className="text-gray-400 mt-2">No transaction records match your current criteria.</p>
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-10 py-7 font-mono text-sm font-bold text-gray-900">
                                    {order.id}
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-400 border border-gray-200">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{order.customerName}</p>
                                            <p className="text-xs text-gray-400 font-medium">{order.items.length} items collected</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} className="text-gray-300" />
                                        {new Date(order.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-sm font-black text-gray-900">
                                    {CURRENCY}{order.total.toLocaleString()}
                                </td>
                                <td className="px-10 py-7">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                        {order.status.replace(/-/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-3 text-gray-400 hover:text-black hover:bg-white hover:shadow-xl rounded-2xl transition-all active:scale-90"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onUpdateStatus={updateOrderStatus}
            primaryColor={config.primaryColor}
        />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, primaryColor }: { order: Order, onClose: () => void, onUpdateStatus: (id: string, status: Order['status']) => void, primaryColor: string }) => {
    const [status, setStatus] = useState<Order['status']>(order.status);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onUpdateStatus(order.id, status);
            setSaving(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 overflow-hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}></div>
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl relative z-10 max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 block mb-1">Transaction Identity</span>
                            <h2 className="text-3xl font-bold text-gray-900 font-serif tracking-tight">{order.id}</h2>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-100"></div>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100`}>
                            {order.status.replace(/-/g, ' ')}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-4 hover:bg-gray-100 rounded-full transition-all active:scale-90"><X size={24} /></button>
                </div>

                <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Truck size={14} /> Shipping Destination
                            </h3>
                            <div className="space-y-4">
                                <p className="font-bold text-gray-900 text-lg leading-tight">{order.customerName}</p>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{order.deliveryAddress}</p>
                                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold mt-4 hover:underline cursor-pointer">
                                    <MapPin size={14} /> View Location on Map
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={14} /> Client Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Mail size={16} className="text-gray-300" />
                                    {order.customerEmail}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                    <Phone size={16} className="text-gray-300" />
                                    {order.customerPhone}
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Verification</p>
                                    <p className="text-xs font-bold text-emerald-600 mt-1">ID Verified on Delivery</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-[2rem] text-white flex flex-col justify-between">
                            <div>
                                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Order Valuation</h3>
                                <p className="text-4xl font-bold tracking-tighter">{CURRENCY}{order.total.toLocaleString()}</p>
                            </div>
                            <div className="space-y-2 mt-8">
                                <div className="flex justify-between text-xs text-white/50">
                                    <span>Asset Value</span>
                                    <span>{CURRENCY}{(order.total * 0.85).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-white/50">
                                    <span>Premium Delivery</span>
                                    <span>{CURRENCY}{(order.total * 0.15).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">Manifest Selection</h3>
                        <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Qty</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="bg-white">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-16 rounded-xl bg-gray-50 p-2 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 tracking-tight">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-500 font-medium text-right">{CURRENCY}{item.price.toFixed(2)}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-900 text-right">{item.quantity}</td>
                                            <td className="px-8 py-5 text-sm font-black text-gray-900 text-right">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-10 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">Fulfilment Pipeline</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">Adjust the status of this order to trigger real-time client notifications and system updates.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value as Order['status'])}
                                className="px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 font-bold text-sm min-w-[220px] shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="pending">Received (Pending)</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Preparing Asset</option>
                                <option value="out-for-delivery">En Route</option>
                                <option value="delivered">Delivered to Cellar</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-10 py-4 rounded-2xl text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
