import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PaymentMethods from '@/components/PaymentMethods';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <PaymentMethods />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
