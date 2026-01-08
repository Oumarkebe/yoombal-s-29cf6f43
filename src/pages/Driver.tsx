
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverDashboard from "@/components/DriverDashboard";

const DriverPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <DriverDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default DriverPage;
