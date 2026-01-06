
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Lock, User, Mail } from '../common/Icons';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { config } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth logic here.
    // For this prototype, we simulate a successful login and redirect to the account page.
    navigate('/store/account');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-neutral-50">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12">
            <h1 className="font-serif text-4xl mb-3">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-neutral-500 text-sm font-light">Join the Liqpur Spot collection community.</p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                            <input type="text" placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:border-black transition-colors outline-none" required />
                        </div>
                    </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                        <input type="email" placeholder="john@example.com" className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:border-black transition-colors outline-none" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                        <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:border-black transition-colors outline-none" required />
                    </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-lg mt-4"
                  style={{ backgroundColor: config.primaryColor }}
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={14} />
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                <p className="text-xs text-neutral-500">
                    {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                    <button 
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 font-bold text-black hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>

        <p className="mt-12 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
          Secure Banking & ID Verification Required
        </p>
      </div>
    </div>
  );
};

export default Auth;
