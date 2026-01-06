import React, { useState } from 'react';
import { INITIAL_CUSTOMERS, CURRENCY } from '../../constants';
import { useStore } from '../../context/StoreContext';
import { Search, Filter, Mail, Phone, MapPin, User, ChevronRight } from '../common/Icons';

const CustomerManager: React.FC = () => {
  const { config } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = INITIAL_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
           <p className="text-gray-500">Manage your premium membership base across Africa.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
            <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or city..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                aria-label="Search customers"
            />
         </div>
         <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm" aria-label="Filter customers">
            <Filter size={16} aria-hidden="true" />
            <span>Filter</span>
         </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-bold border border-neutral-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${customer.email}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-xs text-gray-500">{customer.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                                    <MapPin size={14} className="text-gray-400" />
                                    {customer.location}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-medium">
                                {CURRENCY}{customer.totalSpent.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(customer.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg">
                                    <ChevronRight size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManager;