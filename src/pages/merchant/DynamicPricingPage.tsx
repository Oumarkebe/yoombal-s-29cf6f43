
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { TrendingUp, AlertCircle, Info, Zap, DollarSign, BarChart3, HelpCircle } from 'lucide-react';
import { PricingStrategySelect } from '@/components/admin/PricingStrategySelect';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Mock Data for Simulation
const MOCK_PRODUCTS = [
    { id: '1', name: 'iPhone 15 Pro Max', currentPrice: 850000, demand: 'High' },
    { id: '2', name: 'Samsung Galaxy S24 Ultra', currentPrice: 820000, demand: 'Medium' },
    { id: '3', name: 'PlayStation 5 Slim', currentPrice: 350000, demand: 'Very High' },
];

const MOCK_CHART_DATA = [
    { day: 'Lun', current: 850000, optimized: 855000 },
    { day: 'Mar', current: 850000, optimized: 860000 },
    { day: 'Mer', current: 850000, optimized: 875000 },
    { day: 'Jeu', current: 850000, optimized: 890000 },
    { day: 'Ven', current: 850000, optimized: 885000 },
    { day: 'Sam', current: 850000, optimized: 910000 },
    { day: 'Dim', current: 850000, optimized: 920000 },
];

export default function DynamicPricingPage() {
    const [selectedProduct, setSelectedProduct] = useState<string>(MOCK_PRODUCTS[0].id);
    const [strategy, setStrategy] = useState<string>('concurrentiel');
    const [demandSensitivity, setDemandSensitivity] = useState([50]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    const product = MOCK_PRODUCTS.find(p => p.id === selectedProduct) || MOCK_PRODUCTS[0];

    const handleSimulate = () => {
        setIsSimulating(true);

        // Fake calculation delay
        setTimeout(() => {
            let multiplier = 1;
            if (strategy === 'agressif') multiplier = 0.95; // Lower price to sell more
            if (strategy === 'conservateur') multiplier = 1.05; // Higher margins

            const optimizedPrice = Math.round(product.currentPrice * multiplier * (1 + (demandSensitivity[0] - 50) / 500));
            const revenueImpact = strategy === 'agressif' ? 15 : 8; // Arbitrary %

            setSimulationResult({
                optimizedPrice,
                revenueImpact,
                demandLevel: product.demand
            });
            setIsSimulating(false);
            toast.success("Simulation terminée !");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <PremiumFeatureGate featureKey="ai_pricing">
                <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Zap className="w-8 h-8 text-amber-600 fill-amber-100" />
                                Optimisation Tarifaire IA
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Laissez l'intelligence artificielle ajuster vos prix pour maximiser vos revenus.
                            </p>
                        </div>
                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 px-4 py-1.5 flex gap-2">
                            <SparklesIcon className="w-4 h-4" />
                            Module Premium Actif
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Configuration Panel */}
                        <Card className="lg:col-span-1 h-fit shadow-sm border-slate-200">
                            <CardHeader className="bg-slate-100/50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <SettingsIcon className="w-5 h-5 text-gray-500" /> Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">

                                <div className="space-y-2">
                                    <Label>Produit Cible</Label>
                                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_PRODUCTS.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <PricingStrategySelect
                                    id="strategy-select"
                                    value={strategy}
                                    onChange={setStrategy}
                                />

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label>Sensibilité à la demande</Label>
                                        <span className="text-xs text-muted-foreground">{demandSensitivity[0]}%</span>
                                    </div>
                                    <Slider
                                        value={demandSensitivity}
                                        onValueChange={setDemandSensitivity}
                                        max={100}
                                        step={1}
                                        className="py-2"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Plus la sensibilité est haute, plus l'IA réagira vite aux pics de demande.
                                    </p>
                                </div>

                                <Button
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                    size="lg"
                                    onClick={handleSimulate}
                                    disabled={isSimulating}
                                >
                                    {isSimulating ? "Calcul en cours..." : "Lancer la simulation"}
                                </Button>

                            </CardContent>
                        </Card>

                        {/* Results & Viz Panel */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Simulation Result Cards */}
                            {simulationResult ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-green-700 mb-1">Prix Optimisé</p>
                                                    <h3 className="text-3xl font-bold text-green-800">
                                                        {simulationResult.optimizedPrice.toLocaleString()} FCFA
                                                    </h3>
                                                </div>
                                                <div className="bg-green-200 p-2 rounded-lg">
                                                    <TrendingUp className="w-6 h-6 text-green-700" />
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-sm text-green-700">
                                                <Badge className="bg-green-200 hover:bg-green-300 text-green-800 border-0">
                                                    +{simulationResult.revenueImpact}% Revenus
                                                </Badge>
                                                <span>vs {product.currentPrice.toLocaleString()} FCFA actuel</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Analyse Demande</p>
                                                    <h3 className="text-2xl font-bold text-gray-800">
                                                        {simulationResult.demandLevel}
                                                    </h3>
                                                </div>
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="mt-4 text-sm text-gray-500">
                                                Basé sur les tendances de recherche locales et l'historique de ventes.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <Card className="bg-slate-100 border-dashed border-2 flex items-center justify-center min-h-[160px]">
                                    <p className="text-gray-400 font-medium">Lancez une simulation pour voir les résultats</p>
                                </Card>
                            )}

                            {/* Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">Projection sur 7 jours</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={MOCK_CHART_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) => `${value / 1000}k`}
                                            />
                                            <Tooltip
                                                formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Prix']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="optimized"
                                                stroke="#d97706"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: "#d97706" }}
                                                name="Prix Optimisé"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="current"
                                                stroke="#94a3b8"
                                                strokeWidth={2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                name="Prix Actuel"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* HELP SECTION (Requested by User) */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex gap-4">
                                <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                                    <HelpCircle className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-indigo-900 mb-2">Comment fonctionne la Tarification Dynamique ?</h4>
                                    <ul className="space-y-2 text-sm text-indigo-800/80">
                                        <li className="flex gap-2 items-start">
                                            <span className="font-bold text-indigo-500">1.</span>
                                            L'IA analyse vos stocks, la concurrence et la demande en temps réel.
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <span className="font-bold text-indigo-500">2.</span>
                                            Choisissez une stratégie : <strong>Agressif</strong> pour le volume, <strong>Concurrentiel</strong> pour suivre le marché, ou <strong>Conservateur</strong> pour la marge.
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <span className="font-bold text-indigo-500">3.</span>
                                            Validez les nouveaux prix pour qu'ils s'appliquent automatiquement sur votre boutique.
                                        </li>
                                    </ul>
                                    <div className="mt-4">
                                        <Button variant="link" className="p-0 h-auto text-indigo-700 font-semibold text-xs">
                                            Voir le guide vidéo complet →
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </PremiumFeatureGate>

            <Footer />
        </div>
    );
}

// Simple icons for local use
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 5h4" /><path d="M3 9h4" /></svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
