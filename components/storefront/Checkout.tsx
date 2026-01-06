
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Check, CreditCard, Lock, MapPin, ChevronRight, Plus, Trash2, Box, Truck, Search, ShieldCheck } from '../common/Icons';
import { CURRENCY } from '../../constants';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, config, checkout } = useStore();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [mapPinned, setMapPinned] = useState(false);

  // Form State
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    lat: -26.2041,
    lng: 28.0473
  });

  // Stripe-style Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 1500 ? 0 : 150; // Free shipping over R1500
  const total = subtotal + shipping;

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'number') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (name === 'expiry') value = value.replace(/\D/g, '').replace(/^(\d{2})(\d{0,2})/, '$1/$2').trim();
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const orderId = checkout({
        name: `${contact.firstName} ${contact.lastName}`,
        email: contact.email,
        phone: contact.phone,
        address: `${contact.address}, ${contact.city}, ${contact.zip}`
      });
      setLoading(false);
      navigate(`/store/order-confirmation/${orderId}`);
    }, 2500);
  };

  const handlePinLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setContact(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setMapPinned(true);
        setLoading(false);
      },
      () => {
        setMapPinned(true); // Fallback
        setLoading(false);
      }
    );
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-neutral-100 shadow-sm">
            <Box size={32} className="text-neutral-300" />
        </div>
        <h2 className="font-serif text-3xl font-medium mb-4">Your selection is empty</h2>
        <p className="text-neutral-500 mb-10 max-w-sm mx-auto">Discover our curated collection and add your favorite expressions to the basket.</p>
        <button 
          onClick={() => navigate('/store')}
          className="px-12 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-neutral-800 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: config.primaryColor }}
        >
          Return to Cellar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 lg:py-20 selection:bg-neutral-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Checkout Flow */}
        <div className="lg:col-span-7 space-y-16">
            
            {/* Step 1: Delivery Details */}
            <section className={step === 2 ? 'opacity-40 grayscale pointer-events-none transition-all duration-500' : 'transition-all duration-500'}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                    <h2 className="font-serif text-2xl font-medium flex items-center gap-4">
                        <span className="text-xs font-bold w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-sans">1</span>
                        Delivery Details
                    </h2>
                    {step === 2 && (
                        <button onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest hover:underline">Edit</button>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Email Address</label>
                            <input name="email" value={contact.email} onChange={handleContactChange} type="email" placeholder="you@example.com" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder-neutral-300" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">First Name</label>
                            <input name="firstName" value={contact.firstName} onChange={handleContactChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Last Name</label>
                            <input name="lastName" value={contact.lastName} onChange={handleContactChange} className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block">Delivery Address</label>
                        <input name="address" value={contact.address} onChange={handleContactChange} placeholder="Street Address" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder-neutral-300" />
                        <div className="grid grid-cols-2 gap-6">
                            <input name="city" value={contact.city} onChange={handleContactChange} placeholder="City" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder-neutral-300" />
                            <input name="zip" value={contact.zip} onChange={handleContactChange} placeholder="Postal Code" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-black transition-colors placeholder-neutral-300" />
                        </div>
                    </div>

                    {/* Enhanced Map UI */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block flex justify-between">
                            <span>Pin Location for Driver</span>
                            {mapPinned && <span className="text-green-600 flex items-center gap-1"><Check size={12}/> Exact Location Pinned</span>}
                        </label>
                        <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-neutral-200 shadow-inner bg-neutral-100 group">
                            {/* Visual Map Mockup */}
                            <div className="absolute inset-0 opacity-60 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.google.com/maps/vt/pb=!1m4!1m3!1i14!2i9025!3i10543!2m3!1e0!2sm!3i600123456!3m17!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zY29sb3I6MHhmNWY1ZjUsaGlkZTp0cnVlLC4uLg!4e0!5m1!5f2!23i1301875")', backgroundSize: 'cover' }}></div>
                            
                            {/* Interactive Elements */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className={`relative transition-all duration-500 ${mapPinned ? 'scale-100 translate-y-0' : 'scale-110 -translate-y-4'}`}>
                                    <MapPin size={48} className={`drop-shadow-xl ${mapPinned ? 'text-black fill-white' : 'text-neutral-500 animate-bounce'}`} />
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-sm"></div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePinLocation}
                                className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 ${mapPinned ? 'bg-green-600 text-white' : 'bg-black text-white hover:scale-105'}`}
                            >
                                {mapPinned ? <Check size={14}/> : <MapPin size={14}/>}
                                {mapPinned ? 'Location Confirmed' : 'Confirm Pin Location'}
                            </button>
                        </div>
                    </div>

                    {step === 1 && (
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-5 text-white text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:opacity-90 transition-all rounded-lg mt-4"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Continue to Payment
                        </button>
                    )}
                </div>
            </section>

            {/* Step 2: Payment Gateway (Stripe Inspired) */}
            <section className={step === 1 ? 'opacity-30 pointer-events-none blur-sm' : 'animate-in fade-in slide-in-from-bottom-8 duration-700'}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
                    <h2 className="font-serif text-2xl font-medium flex items-center gap-4">
                        <span className="text-xs font-bold w-6 h-6 bg-black text-white rounded-full flex items-center justify-center font-sans">2</span>
                        Secure Payment
                    </h2>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-400">
                        <Lock size={12} /> SSL Encrypted
                    </span>
                </div>

                <div className="bg-white p-1 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
                    {/* Payment Method Selector */}
                    <div className="flex p-1 bg-neutral-100 rounded-xl">
                        <button 
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            <CreditCard size={16} /> Card
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('apple_pay')}
                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${paymentMethod === 'apple_pay' ? 'bg-white shadow-sm text-black' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Apple Pay
                        </button>
                    </div>

                    {/* Stripe Element Container */}
                    <div className="px-6 pb-6">
                        <div className="border border-neutral-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            <div className="px-4 py-3 border-b border-neutral-100">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Card Number</label>
                                <div className="flex items-center gap-3">
                                    <CreditCard size={18} className="text-neutral-300" />
                                    <input 
                                        name="number"
                                        value={cardDetails.number}
                                        onChange={handleCardChange}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full text-sm outline-none font-mono text-neutral-800 placeholder-neutral-300 bg-transparent"
                                        maxLength={19}
                                    />
                                    {cardDetails.number.length >= 15 && <Check size={16} className="text-green-500 animate-in fade-in" />}
                                </div>
                            </div>
                            <div className="flex divide-x divide-neutral-100">
                                <div className="flex-1 px-4 py-3">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Expiry</label>
                                    <input 
                                        name="expiry"
                                        value={cardDetails.expiry}
                                        onChange={handleCardChange}
                                        placeholder="MM / YY"
                                        className="w-full text-sm outline-none font-mono text-neutral-800 placeholder-neutral-300 bg-transparent"
                                        maxLength={5}
                                    />
                                </div>
                                <div className="w-24 px-4 py-3">
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">CVC</label>
                                    <div className="flex items-center gap-2">
                                        <Lock size={12} className="text-neutral-300" />
                                        <input 
                                            name="cvc"
                                            value={cardDetails.cvc}
                                            onChange={handleCardChange}
                                            placeholder="123"
                                            className="w-full text-sm outline-none font-mono text-neutral-800 placeholder-neutral-300 bg-transparent"
                                            maxLength={4}
                                            type="password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full mt-6 py-5 text-white text-[12px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all rounded-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    Pay {CURRENCY}{total.toFixed(2)}
                                </>
                            )}
                        </button>
                        
                        <div className="mt-4 flex justify-center gap-4 text-neutral-300">
                             {/* Mock Payment Icons */}
                             <div className="h-6 w-10 bg-neutral-100 rounded"></div>
                             <div className="h-6 w-10 bg-neutral-100 rounded"></div>
                             <div className="h-6 w-10 bg-neutral-100 rounded"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:col-span-5">
            <aside className="bg-neutral-50 border border-neutral-100 p-8 rounded-2xl sticky top-32">
                <h3 className="font-serif text-2xl font-medium mb-8">Order Summary</h3>
                
                <div className="space-y-6 mb-8 overflow-y-auto max-h-[40vh] pr-2 scrollbar-hide">
                    {cart.map((item, idx) => (
                        <div key={`${item.productId}-${idx}`} className="flex gap-4 group">
                            <div className="w-16 h-20 bg-white border border-neutral-100 p-2 rounded-md flex-shrink-0 shadow-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1 py-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-sm font-semibold text-neutral-900 leading-tight line-clamp-2">{item.name}</h4>
                                    <span className="text-sm font-medium text-neutral-900">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">Qty: {item.quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-neutral-200">
                    <div className="flex justify-between text-sm text-neutral-600">
                        <span>Subtotal</span>
                        <span className="font-medium">{CURRENCY}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-600">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600 font-bold' : 'font-medium'}>{shipping === 0 ? 'Free' : `${CURRENCY}${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-neutral-900 pt-4 border-t border-neutral-200 mt-4">
                        <span>Total</span>
                        <span style={{ color: config.primaryColor }}>{CURRENCY}{total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-8 bg-white border border-neutral-100 p-4 rounded-lg flex gap-3 items-start">
                    <ShieldCheck size={20} className="text-green-600 shrink-0" />
                    <p className="text-[11px] leading-relaxed text-neutral-500">
                        <span className="font-bold text-neutral-900">Buyer Protection.</span> Your purchase is secure. You must present valid ID upon delivery matching the name on this order.
                    </p>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
