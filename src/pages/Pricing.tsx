
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Crown, Shield, Rocket, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

const Pricing = () => {
    const { user } = useAuth();
    const { settings, isLoading: settingsLoading } = usePlatformSettings();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: string) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour vous abonner");
            return;
        }

        setLoading(plan);
        try {
            const { data, error } = await supabase.functions.invoke('process-subscription', {
                body: { plan, paymentMethod: 'mock_orange_money' }
            });

            if (error) throw error;

            if (data && data.error) {
                console.error("Custom Subscription Error:", data.error, data.details);
                throw new Error(data.error + (data.details ? ` (${data.details})` : ''));
            }

            toast.success("Abonnement activé avec succès ! 🎉");
        } catch (error: any) {
            console.error("Subscription error:", error);
            toast.error("Échec: " + (error.message || error.toString()));
        } finally {
            setLoading(null);
        }
    };

    const roles = settings?.pricingPlans || [
        {
            title: "Client",
            price: "Gratuit",
            icon: <Star className="h-8 w-8 text-blue-600" />,
            description: "Pour les acheteurs particuliers",
            features: [
                "Accès à la marketplace",
                "Paiement échelonné BNPL",
                "Livraison standard gratuite",
                "Support client de base",
                "Programme de fidélité",
                "Assurance livraison basique"
            ],
            cta: "Commencer gratuitement",
            highlight: false,
            ctaLink: "/register?role=client"
        },
        {
            title: "Marchand",
            price: "2,5%",
            description: "Pour les vendeurs professionnels",
            features: [
                "Boutique en ligne personnalisée",
                "Gestion des commandes",
                "Intégration BNPL pour vos produits",
                "Tableau de bord analytics",
                "Support prioritaire",
                "Outils marketing avancés",
                "API d'intégration"
            ],
            cta: "Devenir marchand",
            highlight: true,
            ctaLink: "/register?role=merchant"
        },
        {
            title: "Livreur",
            price: "15%",
            description: "Pour les partenaires de livraison",
            features: [
                "Application mobile dédiée",
                "Planification des tournées",
                "Paiements automatiques",
                "Assurance livraison incluse",
                "Formation et support",
                "Bonus de performance",
                "Flexibilité d'horaires"
            ],
            cta: "Devenir livreur",
            highlight: false,
            ctaLink: "/register?role=delivery"
        }
    ];

    const additionalServices = [
        {
            name: "Assurance Premium",
            price: "1000 CFA/mois",
            description: "Protection complète pour vos achats et livraisons"
        },
        {
            name: "Support Prioritaire",
            price: "500 CFA/mois",
            description: "Assistance dédiée 24/7 avec temps de réponse garanti"
        },
        {
            name: "Analytics Avancées",
            price: "2000 CFA/mois",
            description: "Rapports détaillés et insights business pour marchands"
        }
    ];

    if (settingsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-amber-50 to-indigo-50">
            <Navbar />

            <main className="flex-1 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
                            Tarifs <span className="text-amber-600">Transparents</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Rejoignez l'écosystème Yoombal. Choisissez votre rôle ou boostez votre productivité avec nos outils IA.
                        </p>
                    </div>

                    {/* Roles Section */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800">Choisissez votre profil</h2>
                            <p className="text-gray-600 mt-2">Des solutions adaptées à chaque acteur de la chaîne</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {roles.map((plan: any, index: number) => (
                                <Card key={index} className={`relative shadow-lg hover:shadow-xl transition-all duration-300 ${plan.highlight ? 'ring-2 ring-amber-500 scale-105 z-10 bg-white' : 'bg-white/80'}`}>
                                    {plan.highlight && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                                                Populaire
                                            </span>
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-4">
                                        <div className="flex justify-center mb-4">
                                            {plan.icon || <Zap className="h-8 w-8 text-amber-600" />}
                                        </div>
                                        <CardTitle className="text-2xl font-bold">{plan.title || plan.name}</CardTitle>
                                        <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                                            {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature: string, featureIndex: number) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            asChild
                                            className={`w-full ${plan.highlight ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                                        >
                                            <Link to={plan.ctaLink || plan.link || '/register'}>{plan.cta}</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Premium AI Section */}
                    <div className="mb-24 bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Nouveau : Yoombal AI Business</span>
                                </div>
                                <h2 className="text-4xl font-bold mb-6">Boostez votre activité avec l'Intelligence Artificielle</h2>
                                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                    Accédez à la suite d'outils la plus avancée du marché pour automatiser vos tâches, optimiser vos prix et garantir la qualité de vos produits.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {[
                                        { icon: <Zap className="text-amber-500" />, title: "Assistant IA Illimité", desc: "Aide à la rédaction et marketing 24/7" },
                                        { icon: <Rocket className="text-amber-500" />, title: "Pricing Dynamique", desc: "Analyse de concurrence et prix optimal" },
                                        { icon: <Shield className="text-amber-500" />, title: "Vision QC", desc: "Contrôle qualité automatique des photos" }
                                    ].map((f, i) => (
                                        <li key={i} className="flex gap-4">
                                            <div className="mt-1">{f.icon}</div>
                                            <div>
                                                <h4 className="font-semibold text-white">{f.title}</h4>
                                                <p className="text-slate-400 text-sm">{f.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Card className="bg-white text-slate-900 border-none shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Pack Premium IA</CardTitle>
                                    <CardDescription>La puissance ultime pour les pros</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-5xl font-bold">4 900 F</span>
                                        <span className="text-slate-500 text-lg"> / mois</span>
                                    </div>
                                    <p className="text-amber-600 text-sm font-medium mt-2 italic">Offre de lancement : -20% sur l'annuel</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Inclus dans le pack :</p>
                                        <ul className="grid grid-cols-1 gap-2">
                                            <li className="flex items-center text-sm"><Check className="h-4 w-4 text-green-500 mr-2" /> Analyse d'images par vision</li>
                                            <li className="flex items-center text-sm"><Check className="h-4 w-4 text-green-500 mr-2" /> Optimisation des prix par IA</li>
                                            <li className="flex items-center text-sm"><Check className="h-4 w-4 text-green-500 mr-2" /> Badge Vendeur Certifié</li>
                                            <li className="flex items-center text-sm"><Check className="h-4 w-4 text-green-500 mr-2" /> Priorité dans les résultats</li>
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                                        onClick={() => handleSubscribe('premium_bundle')}
                                        disabled={!!loading}
                                    >
                                        {loading === 'premium_bundle' ? (
                                            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Activation...</>
                                        ) : (
                                            "Activer Premium IA"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    {/* Additional Services */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Services à la carte</h2>
                            <p className="text-lg text-gray-600">Complétez votre offre selon vos besoins ponctuels</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {additionalServices.map((service, index) => (
                                <Card key={index} className="shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-white">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{service.name}</CardTitle>
                                        <div className="text-2xl font-bold text-amber-600">{service.price}</div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Questions fréquentes</h2>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { q: "Y a-t-il des frais cachés ?", a: "Non, tous nos tarifs sont transparents. Les clients ne paient rien, les marchands paient uniquement une commission sur les ventes." },
                                { q: "Comment fonctionne la commission ?", a: "La commission est prélevée uniquement sur les ventes réussies, incluant les frais de service et l'accès à la plateforme." },
                                { q: "Puis-je changer de plan ?", a: "Oui, vous pouvez faire évoluer votre profil ou souscrire à des options IA à tout moment depuis votre tableau de bord." },
                                { q: "Le pack IA est-il sans engagement ?", a: "Tout à fait, vous pouvez résilier votre abonnement Premium IA à tout moment en un clic." }
                            ].map((item, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-gray-900 mb-2 flex gap-2">
                                        <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                                        {item.q}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center mt-24">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Prêt à transformer votre commerce ?</h2>
                        <p className="text-xl text-gray-600 mb-10">Rejoignez la communauté Yoombal et profitez du futur du e-commerce.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="px-10 py-7 bg-amber-600 hover:bg-amber-700 text-lg">
                                <Link to="/register">S'inscrire maintenant</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="px-10 py-7 text-lg">
                                <Link to="/contact">Parler à un expert</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Pricing;
