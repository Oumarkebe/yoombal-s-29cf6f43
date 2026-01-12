
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Truck,
    MapPin,
    Clock,
    Wallet,
    Smartphone,
    ArrowRight,
    Shield,
    Navigation,
    Banknote
} from 'lucide-react';

const BecomeDelivery = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-teal-900 z-0 text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616401776146-236cee1dd026?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-sm">
                                <Truck className="h-4 w-4" />
                                <span>Devenez votre propre patron</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight font-display leading-tight">
                                Roulez, Livrez, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Gagnez de l'argent.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-lg">
                                Rejoignez la flotte Yoombal. Une liberté totale, des paiements rapides et une application intuitive pour maximiser vos gains.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="h-14 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 rounded-full transition-all hover:scale-105">
                                    <Link to="/register?role=delivery">
                                        Devenir Livreur <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            {/* Abstract App Mockup or Illustration Placeholder */}
                            <div className="relative z-10 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl">
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                                        <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center">
                                            <Banknote className="text-white h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Gains ce jour</div>
                                            <div className="text-2xl font-bold text-white">25 000 FCFA</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                                        <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                                            <Navigation className="text-white h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400">Course en cours</div>
                                            <div className="text-xl font-bold text-white">Point E ➔ Almadies</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Pourquoi choisir Yoombal ?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Wallet className="h-10 w-10 text-emerald-600" />,
                                title: "Gains Attractifs",
                                desc: "Des tarifs équitables et 100% des pourboires pour vous. Soyez payé chaque semaine."
                            },
                            {
                                icon: <Clock className="h-10 w-10 text-blue-600" />,
                                title: "Flexibilité Totale",
                                desc: "C'est vous qui décidez quand vous travaillez. Connectez-vous et commencez à livrer."
                            },
                            {
                                icon: <Smartphone className="h-10 w-10 text-purple-600" />,
                                title: "App Intelligente",
                                desc: "Notre technologie optimise vos trajets pour que vous passiez moins de temps à attendre."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="text-center group">
                                <div className="mx-auto mb-6 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-emerald-50 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Comment ça marche ?</h2>
                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>

                        {[
                            { step: 1, title: "Inscrivez-vous", desc: "Créez votre compte en quelques minutes en ligne." },
                            { step: 2, title: "Validez", desc: "Nous vérifions vos documents pour la sécurité de tous." },
                            { step: 3, title: "Téléchargez", desc: "Installez l'application Livreur Yoombal." },
                            { step: 4, title: "Roulez", desc: "Acceptez votre première course et gagnez !" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm text-center relative">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
                                    {item.step}
                                </div>
                                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-emerald-900 text-white rounded-t-[3rem] mt-[-2rem] relative z-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-8">Prêt à prendre la route ?</h2>
                    <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">
                        Rejoignez la communauté des livreurs Yoombal et commencez à générer des revenus dès aujourd'hui.
                    </p>
                    <Button asChild size="lg" className="h-16 px-10 text-xl bg-white text-emerald-900 hover:bg-emerald-50 rounded-full shadow-2xl">
                        <Link to="/register?role=delivery">
                            S'inscrire maintenant
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default BecomeDelivery;
