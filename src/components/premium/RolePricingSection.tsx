
import React from 'react';
import PricingCard from './PricingCard';
import { Button } from '@/components/ui/button';
import { Store, Truck, Users, Sparkles, Shield, Rocket, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface RolePricingSectionProps {
    role: 'merchant' | 'delivery' | 'client';
    title?: string;
    subtitle?: string;
    compact?: boolean;
}

const RolePricingSection = ({ role, title, subtitle, compact = false }: RolePricingSectionProps) => {
    const { user } = useAuth();
    const { profile } = useProfile(user?.id);

    const getSmartCtaLink = (targetRole: string, defaultLink: string) => {
        if (!user) return defaultLink;
        if (profile?.role === targetRole) {
            if (targetRole === 'merchant') return "/merchant?tab=store";
            if (targetRole === 'delivery') return "/delivery";
            return "/profile";
        }
        return defaultLink;
    };

    const getPricingData = () => {
        switch (role) {
            case 'merchant':
                return [
                    {
                        title: "Yoombal Starter",
                        price: "2,5%",
                        period: "/ vente",
                        description: "Idéal pour lancer votre boutique sans frais fixes.",
                        icon: <Store className="h-10 w-10 text-blue-600" />,
                        features: [
                            "Boutique en ligne complète",
                            "Gestion des commandes & stocks",
                            "Paiement Orange Money/Wave",
                            "Support par email",
                            "Visibilité Marketplace standard"
                        ],
                        cta: "Ouvrir ma boutique gratuite",
                        ctaLink: getSmartCtaLink('merchant', "/register?role=merchant"),
                        highlight: false
                    },
                    {
                        title: "Yoombal Pro + IA",
                        price: "15 000 F",
                        period: "/ mois",
                        description: "La puissance de l'IA pour dominer votre marché.",
                        badge: "RECOMMANDÉ",
                        icon: <Sparkles className="h-10 w-10 text-amber-500" />,
                        features: [
                            "Tout du plan Starter",
                            "Assistant IA Illimité (Marketing)",
                            "Optimisation des prix par IA",
                            "Génération de contenu SEO",
                            "Priorité dans les recherches",
                            "Support prioritaire 24/7"
                        ],
                        cta: "Passer en Pro",
                        ctaLink: getSmartCtaLink('merchant', "/register?role=merchant"),
                        highlight: true
                    }
                ];
            case 'delivery':
                return [
                    {
                        title: "Livreur Indépendant",
                        price: "15%",
                        period: "/ course",
                        description: "Travaillez quand vous voulez, gagnez ce que vous méritez.",
                        icon: <Truck className="h-10 w-10 text-emerald-600" />,
                        features: [
                            "Accès aux missions illimité",
                            "Application mobile livreur",
                            "Paiements hebdomadaires",
                            "Support de base",
                            "Assurance trajet standard"
                        ],
                        cta: "Devenir livreur",
                        ctaLink: getSmartCtaLink('delivery', "/register?role=delivery"),
                        highlight: false
                    },
                    {
                        title: "Pack Livreur Pro",
                        price: "5 000 F",
                        period: "/ mois",
                        description: "Optimisez vos gains et votre confort de travail.",
                        badge: "BEST-SELLER",
                        icon: <Rocket className="h-10 w-10 text-purple-600" />,
                        features: [
                            "Tout du plan Indépendant",
                            "Optimisation de tournées par IA",
                            "Priorité sur les grosses courses",
                            "Assurance santé & accident",
                            "Bonus de performance boostés",
                            "Support VIP dédié"
                        ],
                        cta: "Activer Pack Pro",
                        ctaLink: getSmartCtaLink('delivery', "/register?role=delivery"),
                        highlight: true
                    }
                ];
            case 'client':
            default:
                return [
                    {
                        title: "Compte Standard",
                        price: "0 F",
                        period: "à vie",
                        description: "Le meilleur du shopping local, gratuitement.",
                        icon: <Users className="h-10 w-10 text-orange-500" />,
                        features: [
                            "Accès à toute la marketplace",
                            "Paiement en 3x (BNPL)",
                            "Suivi de commande direct",
                            "Programme de fidélité standard",
                            "Support par chat"
                        ],
                        cta: "Créer mon compte",
                        ctaLink: getSmartCtaLink('client', "/register?role=client"),
                        highlight: false
                    },
                    {
                        title: "Yoombal Premium",
                        price: "2 900 F",
                        period: "/ mois",
                        description: "Une expérience d'achat privilégiée et sécurisée.",
                        icon: <Shield className="h-10 w-10 text-indigo-600" />,
                        features: [
                            "Tout du compte Standard",
                            "Livraisons Express gratuites (x5)",
                            "Support prioritaire 24/7",
                            "Assurance Protection Achat",
                            "Accès en avant-première aux soldes",
                            "Cashback fidélité x2"
                        ],
                        cta: "Passer Premium",
                        ctaLink: getSmartCtaLink('client', "/register?role=client"),
                        highlight: true
                    }
                ];
        }
    };

    const plans = getPricingData();

    return (
        <section className={`${compact ? 'py-12' : 'py-24'} bg-transparent`}>
            <div className="container mx-auto px-6">
                {(title || subtitle) && (
                    <div className="text-center mb-16">
                        {title && <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-display">{title}</h2>}
                        {subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
                    </div>
                )}

                <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto ${compact ? 'scale-95' : ''}`}>
                    {plans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>

                {!compact && role === 'merchant' && (
                    <div className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Besoin d'une solution sur-mesure ?</h3>
                                <p className="text-slate-400">Pour les grandes enseignes et réseaux de distribution.</p>
                            </div>
                            <Button asChild variant="outline" className="border-slate-700 text-white hover:bg-white/10 h-12 px-8 rounded-xl font-bold text-base">
                                <a href="/contact">Découvrir l'offre Enterprise</a>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RolePricingSection;
