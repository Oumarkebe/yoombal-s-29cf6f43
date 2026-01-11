import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import Merchants from './pages/Merchants';
import Marketplace from './pages/Marketplace';
import Pricing from './pages/Pricing'; // Pricing Page
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import BNPL from './pages/BNPL';
import MerchantStore from './pages/MerchantStore';
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
import NotFound from './pages/NotFound';
import { AIAssistant } from './components/ai/AIAssistant';
import { Toaster } from "@/components/ui/sonner";
import { AdminRoute } from './components/admin/AdminRoute';
import AIErrorBoundary from './components/ai/AIErrorBoundary';

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
              <Route path="/merchants" element={<Merchants />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/bnpl" element={<BNPL />} />
              <Route path="/merchant-store/:merchantId" element={<MerchantStore />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes Protected */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/statistics" element={<AdminStatistics />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/deliveries" element={<AdminDeliveries />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/ai-center" element={<AdminAiCenter />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              <Route path="/merchant" element={<MerchantDashboard />} />
              <Route path="/delivery" element={<DeliveryDashboard />} />
              <Route path="/economic-model" element={<EconomicModel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIErrorBoundary fallbackName="Assistant IA">
              <AIAssistant />
            </AIErrorBoundary>
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
