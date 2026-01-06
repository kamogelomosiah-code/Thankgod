
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings as SettingsIcon, Bell, ShieldCheck, Mail, Globe, CreditCard, ChevronRight } from '../common/Icons';

const Settings: React.FC = () => {
  const { config, updateConfig } = useStore();

  const sections = [
    { title: 'General', icon: Globe, desc: 'Store name, currency, and language settings.' },
    { title: 'Notifications', icon: Bell, desc: 'Email alerts for new orders and low stock.' },
    { title: 'Payments', icon: CreditCard, desc: 'Connect Stripe, PayPal, and Apple Pay.' },
    { title: 'Security', icon: ShieldCheck, desc: 'Staff permissions and API key management.' },
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your store's back-office and administration.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-gray-300 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                <section.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.desc}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-bold">Store Concierge Email</h3>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              value={config.contactEmail}
              onChange={(e) => updateConfig({ contactEmail: e.target.value })}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-black outline-none transition-colors"
            />
          </div>
          <button className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
