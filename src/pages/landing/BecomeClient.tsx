
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ShoppingBag,
    CreditCard,
    Truck,
    Heart,
    Search,
    ArrowRight,
    Gift,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import RolePricingSection from '@/components/premium/RolePricingSection';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const BecomeClient = () => {
    const { user } = useAuth();
    const { profile } = useProfile(user?.id);

    const getCtaLink = () => {
        if (!user) return "/register?role=client";
        return "/profile";
    };

    const ctaLink = getCtaLink();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-white z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-pink-50 opacity-70"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-600 text-sm font-medium mb-8">
                            <ShoppingBag className="h-4 w-4" />
                            <span>Le meilleur du shopping local</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight font-display leading-tight">
                            Tout ce que vous aimez, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                                livré chez vous.
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Découvrez des milliers de produits locaux uniques. Achetez maintenant, payez plus tard avec BNPL, et profitez d'une livraison express.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 rounded-full transition-all hover:scale-105">
                                <Link to={ctaLink}>
                                    Commencer le shopping <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-full">
                                <Link to="/marketplace">Explorer les produits</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Product Cards (Decorative) */}
            <div className="container mx-auto px-6 relative h-64 -mt-20 hidden md:block overflow-hidden">
                <div className="absolute left-0 top-0 w-64 p-4 bg-white rounded-2xl shadow-lg transform -rotate-6 animate-pulse">
                    <div className="h-32 bg-slate-100 rounded-xl mb-4"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-orange-100 rounded"></div>
                </div>
                <div className="absolute right-0 top-12 w-64 p-4 bg-white rounded-2xl shadow-lg transform rotate-3 animate-pulse delay-300">
                    <div className="h-32 bg-slate-100 rounded-xl mb-4"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-pink-100 rounded"></div>
                </div>
            </div>

            {/* Features Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Search className="h-8 w-8 text-orange-500" />,
                                title: "Recherche Puissante",
                                desc: "Trouvez exactement ce que vous cherchez avec nos filtres intelligents et recommandations."
                            },
                            {
                                icon: <CreditCard className="h-8 w-8 text-pink-500" />,
                                title: "Paiement BNPL",
                                desc: "Achetez maintenant et payez en plusieurs fois sans frais cachés. Simple et efficace."
                            },
                            {
                                icon: <Truck className="h-8 w-8 text-blue-500" />,
                                title: "Livraison Express",
                                desc: "Suivez votre commande en temps réel de la boutique jusqu'à votre porte."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
                                title: "Garantie Qualité",
                                desc: "Tous nos marchands sont vérifiés. Satisfait ou remboursé sous 14 jours."
                            },
                            {
                                icon: <Gift className="h-8 w-8 text-purple-500" />,
                                title: "Récompenses",
                                desc: "Gagnez des points fidélité à chaque achat et débloquez des réductions exclusives."
                            },
                            {
                                icon: <Heart className="h-8 w-8 text-red-500" />,
                                title: "Support 100% Local",
                                desc: "Une équipe basée à Dakar prête à vous aider 7j/7 pour toutes vos questions."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                                <div className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section (Unified) */}
            <div id="pricing" className="bg-slate-50">
                <RolePricingSection
                    role="client"
                    title="Une expérience Shopping Premium"
                    subtitle="Profitez d'avantages exclusifs pour vos achats quotidiens. Livraison express et protection garantie."
                />
            </div>

            {/* CTA Banner */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Envie de chiner les meilleures offres ?</h2>
                        <Button asChild size="lg" className="h-16 px-12 text-lg bg-white text-slate-900 hover:bg-slate-100 rounded-full font-bold relative z-10">
                            <Link to={ctaLink}>
                                Créer un compte gratuit
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BecomeClient;
