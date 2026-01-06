import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Palette, BarChart, Settings, Bell, Search, Menu, LogOut, ArrowUpRight, ShoppingBag } from '../common/Icons';
import { useStore } from '../../context/StoreContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { config } = useStore();
  const navigate = useNavigate();

  const primaryColor = config.primaryColor;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? `bg-opacity-10 font-medium` 
            : 'text-gray-600 hover:bg-gray-50'
        }`
      }
      style={({ isActive }) => isActive ? { color: primaryColor, backgroundColor: 'rgba(0,0,0,0.08)' } : {}}
      onClick={() => setSidebarOpen(false)}
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between lg:justify-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg`} style={{ backgroundColor: primaryColor }}>
                L
            </div>
            <span className="font-serif font-bold text-xl text-gray-900 tracking-tight">Liquor Spot</span>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                <Menu size={20} />
            </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/dashboard/products" icon={Package} label="Products" />
          <NavItem to="/dashboard/orders" icon={ShoppingCart} label="Orders" />
          <NavItem to="/dashboard/customers" icon={Users} label="Customers" />
          <NavItem to="/dashboard/design" icon={Palette} label="Design & Storefront" />
          <NavItem to="/dashboard/analytics" icon={BarChart} label="Analytics" />
          <NavItem to="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
           <button 
             onClick={() => navigate('/store')}
             className="w-full flex items-center gap-3 px-4 py-3 text-black font-bold text-sm bg-neutral-50 hover:bg-neutral-100 transition-colors rounded-lg border border-neutral-200 shadow-sm"
           >
               <ShoppingBag size={18} />
               <span>Enter Boutique</span>
               <ArrowUpRight size={14} className="ml-auto opacity-50" />
           </button>
           <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm" aria-label="Exit Dashboard">
               <LogOut size={20} />
               <span>Logout Portal</span>
           </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                    aria-label="Open sidebar menu"
                >
                    <Menu size={24} />
                </button>
                <div className="relative hidden md:block w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                    <input 
                        type="text" 
                        placeholder="Search orders, products, customers..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                        aria-label="Search dashboard"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" aria-label="View notifications">
                    <Bell size={20} />
                    <span className="sr-only">New notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" aria-hidden="true"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Store Owner</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;