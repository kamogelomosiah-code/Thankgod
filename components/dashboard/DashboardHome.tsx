
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight, ShoppingBag, DollarSign, Users, Package, ChevronRight, Truck, TrendingUp, Activity } from '../common/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CURRENCY } from '../../constants';
import { useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const { orders, products, config } = useStore();
  const primaryColor = config.primaryColor;
  const navigate = useNavigate();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const stats = [
    { title: "Net Revenue", value: `${CURRENCY}${totalRevenue.toLocaleString()}`, change: "+14.2%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", link: "/dashboard/analytics" },
    { title: "Active Orders", value: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length, change: "Live", icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50", link: "/dashboard/orders" },
    { title: "Catalog Items", value: products.length, change: "Active", icon: Package, color: "text-amber-600", bg: "bg-amber-50", link: "/dashboard/products" },
    { title: "Concierge Leads", value: "24", change: "+12", icon: Users, color: "text-rose-600", bg: "bg-rose-50", link: "/dashboard/customers" },
  ];

  const chartData = [
    { name: 'Mon', sales: 4200 }, { name: 'Tue', sales: 3800 }, { name: 'Wed', sales: 5100 },
    { name: 'Thu', sales: 4800 }, { name: 'Fri', sales: 6200 }, { name: 'Sat', sales: 7500 },
    { name: 'Sun', sales: 6900 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">Executive Summary</h1>
            <p className="text-gray-500 mt-1 font-medium">Monitoring the pulse of {config.storeName}.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex -space-x-3 mr-4">
                {[12, 15, 22].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?img=${i}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100" alt="Staff" />
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+8</div>
            </div>
            <button 
                onClick={() => navigate('/store')}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
                Launch Storefront <ArrowUpRight size={14} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
            <div 
                key={idx} 
                onClick={() => navigate(stat.link)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-500`}>
                        <stat.icon size={22} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600 uppercase tracking-tighter'}`}>
                        {stat.change}
                    </span>
                </div>
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.15em] mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">{stat.value}</h3>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 font-serif">Revenue Performance</h3>
                    <p className="text-sm text-gray-400">Weekly accumulation across all channels</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">
                    <TrendingUp size={16} /> +18.4%
                </div>
            </div>
            <div className="h-80 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15}/>
                                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f9fafb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke={primaryColor} 
                            strokeWidth={4} 
                            fillOpacity={1} 
                            fill="url(#colorSales)"
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3, fill: primaryColor }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl flex flex-col text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity size={120} />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-serif">Live Feed</h3>
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Operational
                </span>
            </div>
            
            <div className="relative z-10 flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                {orders.slice(0, 5).map(order => (
                    <div 
                        key={order.id} 
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group border border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold border border-white/10">
                                {order.customerName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">{order.customerName}</p>
                                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{order.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-white">{CURRENCY}{order.total.toLocaleString()}</p>
                            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-tighter mt-0.5">Confirmed</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => navigate('/dashboard/orders')}
                className="relative z-10 mt-6 w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
                Management Hub <ChevronRight size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
