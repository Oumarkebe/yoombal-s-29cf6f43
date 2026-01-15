
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Store,
    TrendingUp,
    Zap,
    ShieldCheck,
    Globe,
    Smartphone,
    ArrowRight,
    CheckCircle2,
    BarChart3,
    Bot,
    Star,
    Users,
    CreditCard,
    Truck,
    Navigation,
    Loader2
} from 'lucide-react';
import RolePricingSection from '@/components/premium/RolePricingSection';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const BecomeMerchant = () => {
    const { user } = useAuth();
    const { profile } = useProfile(user?.id);

    const getCtaLink = () => {
        if (!user) return "/register?role=merchant";
        if (profile?.role === 'merchant') return "/merchant?tab=store";
        return "/register?role=merchant"; // Redirect to register with role to potentially change role or show error
    };

    const ctaLink = getCtaLink();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0 text-white">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-8 backdrop-blur-sm">
                        <Store className="h-4 w-4" />
                        <span>Solution complète pour les vendeurs</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight font-display">
                        Vendez plus intelligemment <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            avec Yoombal
                        </span>
                    </h1>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Rejoignez la plateforme e-commerce nouvelle génération.
                        Profitez de nos outils d'IA, de notre logistique intégrée et d'une visibilité nationale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 rounded-full transition-all hover:scale-105">
                            <Link to={ctaLink}>
                                Ouvrir ma boutique <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-slate-600 bg-transparent text-white hover:bg-white/10 rounded-full">
                            <Link to="/pricing">Voir les tarifs</Link>
                        </Button>
                    </div>
                </div>

                {/* Floating Elements Background */}
                <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white relative -mt-20 rounded-t-[3rem] z-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Tout ce dont vous avez besoin</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Une suite d'outils puissants conçue pour propulser votre business vers de nouveaux sommets.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Bot className="h-8 w-8 text-indigo-600" />,
                                title: "Intelligence Artificielle",
                                desc: "Générez des fiches produits vendeuses et optimisez vos prix automatiquement grâce à notre IA."
                            },
                            {
                                icon: <Globe className="h-8 w-8 text-blue-600" />,
                                title: "Visibilité Maximale",
                                desc: "Touchez des milliers de clients partout au Sénégal grâce à notre plateforme optimisée SEO."
                            },
                            {
                                icon: <Smartphone className="h-8 w-8 text-green-600" />,
                                title: "Gestion Mobile",
                                desc: "Gérez vos commandes, votre stock et vos clients directement depuis votre smartphone."
                            },
                            {
                                icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
                                title: "Analyses Détaillées",
                                desc: "Comprenez votre activité avec des tableaux de bord précis sur vos ventes et clients."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8 text-teal-600" />,
                                title: "Paiements Sécurisés",
                                desc: "Acceptez Orange Money, Wave et Cartes Bancaires en toute sécurité."
                            },
                            {
                                icon: <TrendingUp className="h-8 w-8 text-amber-600" />,
                                title: "Croissance Rapide",
                                desc: "Des outils marketing intégrés pour booster vos ventes dès le premier jour."
                            }
                        ].map((feature, i) => (
                            <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-50/50 hover:bg-white group">
                                <CardContent className="p-8">
                                    <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-4 gap-12 text-center">
                        {[
                            { number: "+50%", label: "De croissance moyenne" },
                            { number: "24/7", label: "Support dédié" },
                            { number: "0F", label: "Frais d'ouverture" },
                            { number: "< 24h", label: "Pour commencer à vendre" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                                <div className="text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials (from Merchants.tsx) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
                            Ce que disent nos marchands
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Découvrez les témoignages de nos partenaires qui réussissent avec Yoombal.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Aminata Diallo",
                                business: "Mode & Accessoires",
                                rating: 5,
                                comment: "Grâce à Yoombal, j'ai pu doubler mes ventes en 6 mois. Le système BNPL attire beaucoup plus de clients."
                            },
                            {
                                name: "Moussa Ba",
                                business: "Électronique",
                                rating: 5,
                                comment: "La plateforme est facile à utiliser et le support client est excellent. Je recommande vivement."
                            },
                            {
                                name: "Fatou Seck",
                                business: "Artisanat local",
                                rating: 5,
                                comment: "Yoombal m'a permis de vendre mes produits dans tout le Sénégal. C'est révolutionnaire !"
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="shadow-lg border-none bg-slate-50/50">
                                <CardContent className="pt-8">
                                    <div className="flex items-center space-x-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-amber-500 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 italic mb-6">"{testimonial.comment}"</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                            {testimonial.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                            <p className="text-sm text-slate-500">{testimonial.business}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section (Unified) */}
            <div id="pricing" className="bg-slate-50">
                <RolePricingSection
                    role="merchant"
                    title="Des tarifs simples et transparents"
                    subtitle="Choisissez le plan qui correspond à votre ambition. Commencez gratuitement et évoluez avec nous."
                />
            </div>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">
                        Prêt à lancer votre empire ?
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                        Rejoignez les centaines de marchands qui font confiance à Yoombal.
                        Ouvrez votre boutique en moins de 2 minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
                        <Button asChild size="lg" className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xl rounded-xl border-none">
                            <Link to={ctaLink}>
                                Créer ma boutique
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-8 text-sm text-slate-500">
                        Pas de frais d'inscription • Support 7j/7 • Paiements sécurisés
                    </p>
                </div>
            </section>
        </div>
    );
};

export default BecomeMerchant;
