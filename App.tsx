
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProductManager from './components/dashboard/ProductManager';
import OrderManager from './components/dashboard/OrderManager';
import CustomerManager from './components/dashboard/CustomerManager';
import StoreCustomizer from './components/dashboard/StoreCustomizer';
import Analytics from './components/dashboard/Analytics';
import Settings from './components/dashboard/Settings';
import StorefrontLayout from './components/storefront/StorefrontLayout';
import StoreHome from './components/storefront/StoreHome';
import ProductDetails from './components/storefront/ProductDetails';
import Checkout from './components/storefront/Checkout';
import OrderConfirmation from './components/storefront/OrderConfirmation';
import Auth from './components/storefront/Auth';
import Account from './components/storefront/Account';
import TrackOrder from './components/storefront/TrackOrder';
import AgeGate from './components/storefront/AgeGate';
import LandingPage from './components/LandingPage';

const AppContent: React.FC = () => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('spiritflow_age_verified');
    if (isVerified) {
        setVerified(true);
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Entry Point */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<OrderManager />} />
          <Route path="design" element={<StoreCustomizer />} />
          <Route path="customers" element={<CustomerManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Storefront Routes */}
        <Route path="/store" element={
            !verified ? <AgeGate onVerify={() => setVerified(true)} /> : <StorefrontLayout />
        }>
            <Route index element={<StoreHome />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="auth" element={<Auth />} />
            <Route path="account" element={<Account />} />
            <Route path="track-order" element={<TrackOrder />} />
        </Route>

        {/* Catch-all to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
