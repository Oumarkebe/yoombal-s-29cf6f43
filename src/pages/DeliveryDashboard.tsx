
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import DriverDashboard from '@/components/DriverDashboard';

const DeliveryDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <DriverDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
