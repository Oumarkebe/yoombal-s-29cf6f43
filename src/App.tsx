import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Tarifs from './pages/Tarifs';
import Merchants from './pages/Merchants';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AdminStatistics from './pages/AdminStatistics';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminRoles from './pages/AdminRoles';
import AdminDeliveries from './pages/AdminDeliveries';
import AdminSettings from './pages/AdminSettings';
import AdminAiCenter from './pages/AdminAiCenter';
import AdminDashboard from './pages/AdminDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import EconomicModel from '@/pages/EconomicModel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/merchants" element={<Merchants />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/statistics" element={<AdminStatistics />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/deliveries" element={<AdminDeliveries />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/ai-center" element={<AdminAiCenter />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/merchant" element={<MerchantDashboard />} />
              <Route path="/delivery" element={<DeliveryDashboard />} />
              <Route path="/economic-model" element={<EconomicModel />} />
            </Routes>
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
