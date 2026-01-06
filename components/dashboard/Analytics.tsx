import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CURRENCY } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from '../common/Icons';

const Analytics: React.FC = () => {
  const { orders, config } = useStore();
  const primaryColor = config.primaryColor;

  const data = [
    { name: 'Jan', revenue: 4500, orders: 120 },
    { name: 'Feb', revenue: 5200, orders: 145 },
    { name: 'Mar', revenue: 4800, orders: 132 },
    { name: 'Apr', revenue: 6100, orders: 170 },
    { name: 'May', revenue: 5900, orders: 160 },
    { name: 'Jun', revenue: 7200, orders: 210 },
  ];

  const categoryData = [
    { name: 'Spirits', value: 45, color: primaryColor },
    { name: 'Wine', value: 30, color: '#4b5563' },
    { name: 'Beer', value: 15, color: '#9ca3af' },
    { name: 'Snacks', value: 10, color: '#e5e7eb' },
  ];

  const metrics = [
    { label: 'Net Liquidity', value: `${CURRENCY}42,500`, change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Order Volume', value: '1,248', change: '+3.2%', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Customer Retention', value: '84%', change: '+0.4%', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Active Sessions', value: '4,102', change: '+24%', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Deep Intelligence</h1>
            <p className="text-gray-500 mt-1">Algorithmic sales analysis and market trends.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            {['7D', '30D', '90D', '1Y'].map(range => (
                <button key={range} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === '30D' ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'}`}>{range}</button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900">Revenue Trajectory</h3>
            <p className="text-sm text-gray-500">Trailing monthly revenue accumulation</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: primaryColor, fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="revenue" stroke={primaryColor} fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900">Inventory Allocation</h3>
            <p className="text-sm text-gray-500">Distribution of stock across classifications</p>
          </div>
          <div className="h-80 flex flex-col md:flex-row items-center gap-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full md:w-56 space-y-5">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm font-bold text-gray-600">{cat.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;