import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight, ShoppingBag, DollarSign, Users, Package, ChevronRight, Truck, TrendingUp } from '../common/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
    { title: "Total Revenue", value: `${CURRENCY}${totalRevenue.toLocaleString()}`, change: "+12.5%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", link: "/dashboard/analytics" },
    { title: "Active Orders", value: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length, change: "Live", icon: ShoppingBag, color: "text-indigo-600", bg: "bg-indigo-50", link: "/dashboard/orders" },
    { title: "Catalog Items", value: products.length, change: "Active", icon: Package, color: "text-amber-600", bg: "bg-amber-50", link: "/dashboard/products" },
    { title: "Customer Base", value: "1,248", change: "+4.2%", icon: Users, color: "text-rose-600", bg: "bg-rose-50", link: "/dashboard/customers" },
  ];

  const chartData = [
    { name: 'Mon', sales: 4200 },
    { name: 'Tue', sales: 3800 },
    { name: 'Wed', sales: 5100 },
    { name: 'Thu', sales: 4800 },
    { name: 'Fri', sales: 6200 },
    { name: 'Sat', sales: 7500 },
    { name: 'Sun', sales: 6900 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Store Overview</h1>
            <p className="text-gray-500 mt-1">Real-time performance metrics for {config.storeName}.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-4">
                {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="User" />
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">+5</div>
            </div>
            <button 
                onClick={() => navigate('/store')}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
            >
                View Live Site
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
            <div 
                key={idx} 
                onClick={() => navigate(stat.link)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-opacity-80`}>
                        <stat.icon size={22} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'}`}>
                        {stat.change}
                    </span>
                </div>
                <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{stat.value}</h3>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Revenue Velocity</h3>
                    <p className="text-sm text-gray-500">Trailing 7-day volume performance</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                    <TrendingUp size={16} /> +18.4%
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15}/>
                                <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: primaryColor, fontWeight: 700 }}
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

        {/* Live Order Feed */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Latest Orders</h3>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <ShoppingBag size={40} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 text-sm">Waiting for incoming orders...</p>
                    </div>
                ) : (
                    orders.slice(0, 6).map(order => (
                        <div 
                            key={order.id} 
                            onClick={() => navigate('/dashboard/orders')}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${order.customerEmail}`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{order.customerName}</p>
                                    <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{CURRENCY}{order.total.toLocaleString()}</p>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                    order.status === 'delivered' ? 'text-emerald-600' : 
                                    order.status === 'pending' ? 'text-amber-600' : 'text-indigo-600'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button 
                onClick={() => navigate('/dashboard/orders')}
                className="mt-6 w-full py-3 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
                Management Portal <ChevronRight size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;