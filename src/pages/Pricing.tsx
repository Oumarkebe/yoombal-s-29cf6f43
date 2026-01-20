import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Truck, Users, Sparkles, Loader2 } from 'lucide-react';
import RolePricingSection from '@/components/premium/RolePricingSection';

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
              Une solution pour <span className="text-amber-600">chaque besoin</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choisissez votre profil et profitez des meilleurs outils du marché sénégalais.
            </p>
          </div>

          <Tabs defaultValue="merchant" className="space-y-12">
            <div className="flex justify-center">
              <TabsList className="bg-slate-100 p-1 rounded-2xl h-auto border border-slate-200">
                <TabsTrigger
                  value="client"
                  className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Acheteur</span>
                </TabsTrigger>
                <TabsTrigger
                  value="merchant"
                  className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                >
                  <Store className="h-4 w-4 text-blue-600" />
                  <span>Vendeur</span>
                </TabsTrigger>
                <TabsTrigger
                  value="delivery"
                  className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
                >
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span>Livreur</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="client"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <RolePricingSection role="client" />
            </TabsContent>

            <TabsContent
              value="merchant"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <RolePricingSection role="merchant" />
            </TabsContent>

            <TabsContent
              value="delivery"
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <RolePricingSection role="delivery" />
            </TabsContent>
          </Tabs>

          {/* FAQ (Simplified) */}
          <div className="mt-24 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Questions fréquentes
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-left">
              {[
                {
                  q: 'Y a-t-il des frais cachés ?',
                  a: "Non, tous nos tarifs sont transparents. Les commissions ne s'appliquent qu'en cas de vente ou de mission réussie.",
                },
                {
                  q: 'Comment fonctionne la commission ?',
                  a: "La commission est prélevée automatiquement lors de la transaction finale, incluant les frais de service et l'accès aux outils de gestion.",
                },
                {
                  q: 'Puis-je changer de plan ?',
                  a: 'Oui, vous pouvez activer ou désactiver vos options IA et Premium à tout moment depuis votre profil.',
                },
                {
                  q: 'Le support est-il local ?',
                  a: 'Absolument. Nos équipes sont basées à Dakar et disponibles pour vous aider 7j/7.',
                },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-bold text-slate-900 mb-2 flex gap-2">
                    <div className="w-1 h-6 bg-amber-500 rounded-full shrink-0"></div>
                    {item.q}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
