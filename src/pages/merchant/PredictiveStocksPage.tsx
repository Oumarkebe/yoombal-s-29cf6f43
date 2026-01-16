
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, TrendingUp, TrendingDown, Package, Coins, Moon, ArrowRight, HelpCircle, Leaf, Snowflake, Sun } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Mock Data for "Smart" Features
const MOCK_SEASONALITY = {
    event: "Tabaski",
    daysLeft: 24,
    impact: "High",
    suggestedItems: ["Oignons", "Huile de Cuisson", "Pommes de terre", "Épices"]
};

const MOCK_STOCK_ITEMS = [
    { id: 1, name: "Oignons Import (Sac 25kg)", stock: 12, salesTrend: [10, 15, 20, 25, 40, 55, 60], status: "critical", prediction: "Rupture dans 3j" },
    { id: 2, name: "Smartphone Y80", stock: 145, salesTrend: [5, 4, 3, 2, 2, 1, 0], status: "dormant", prediction: "Stock mort" },
    { id: 3, name: "Riz Parfumé Royal", stock: 200, salesTrend: [50, 52, 48, 55, 60, 65, 80], status: "healthy", prediction: "Demande en hausse" },
    { id: 4, name: "Ventilateur Stand", stock: 5, salesTrend: [2, 5, 8, 12, 15, 18, 20], status: "opportunity", prediction: "Pic de chaleur" },
];

export default function PredictiveStocksPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical': return <Badge variant="destructive" className="flex gap-1"><AlertCircle className="w-3 h-3" /> Critique</Badge>;
            case 'dormant': return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none flex gap-1"><Coins className="w-3 h-3" /> Dormant</Badge>;
            case 'opportunity': return <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex gap-1"><TrendingUp className="w-3 h-3" /> Opportunité</Badge>;
            default: return <Badge variant="outline" className="text-gray-500">Sain</Badge>;
        }
    };

    const getSmartAction = (item: any) => {
        switch (item.status) {
            case 'critical':
                return <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs w-full">Commander +100</Button>;
            case 'dormant':
                return <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 h-7 text-xs w-full">Promo -20%</Button>;
            case 'opportunity':
                return <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs w-full">Recommender Stock</Button>;
            default:
                return <span className="text-xs text-gray-400 text-center block">Aucune action requise</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <PremiumFeatureGate featureKey="predictions">
                <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

                    {/* Header Area */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="w-8 h-8 text-indigo-600" />
                                Intelligence des Stocks
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Anticipez la demande et optimisez votre trésorerie grâce à l'IA.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border">
                            <div className="bg-green-100 text-green-700 font-bold p-3 rounded-full text-lg">85/100</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">Santé du Stock</div>
                                <div className="text-xs text-green-600">Bonne gestion globale</div>
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                        {/* Seasonality Card */}
                        <Card className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-lg overflow-hidden relative">
                            <div className="absolute right-0 top-0 p-4 opacity-10">
                                <Moon className="w-24 h-24" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-light opacity-90">Contexte Saisonnier</CardTitle>
                                    <Badge className="bg-indigo-500 hover:bg-indigo-600 border-none">J-{MOCK_SEASONALITY.daysLeft}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <Moon className="w-8 h-8 text-amber-300" />
                                    <div>
                                        <h3 className="text-2xl font-bold">{MOCK_SEASONALITY.event} approche !</h3>
                                        <p className="text-xs text-indigo-200">Pic de consommation prévu.</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                    <p className="text-xs text-indigo-100 mb-2 uppercase font-semibold">Produits à surveiller :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_SEASONALITY.suggestedItems.map(i => (
                                            <Badge key={i} variant="secondary" className="bg-white text-indigo-900 hover:bg-indigo-50 text-[10px]">{i}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rupture Risk Card */}
                        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-5 h-5" />
                                    Risque de Rupture
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 mb-1">3 Produits</div>
                                <p className="text-sm text-gray-500 mb-4">Vont s'épuiser dans moins de 72h.</p>
                                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                                    Voir les produits critiques
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Dead Stock Card */}
                        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
                                    <Coins className="w-5 h-5" />
                                    Capital Dormant
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 mb-1">1.2M FCFA</div>
                                <p className="text-sm text-gray-500 mb-4">Immobilisés dans des stocks morts.</p>
                                <Button variant="outline" size="sm" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50">
                                    Planifier une liquidation
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Analysis Table */}
                        <div className="lg:col-span-3">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Analyse Prédictive par Produit</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produit</TableHead>
                                                <TableHead>Stock Actuel</TableHead>
                                                <TableHead className="w-[150px]">Tendance Ventes</TableHead>
                                                <TableHead>Prédiction IA</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Smart Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {MOCK_STOCK_ITEMS.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.stock} unités</TableCell>
                                                    <TableCell>
                                                        <div className="h-10 w-24">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <AreaChart data={item.salesTrend.map((val, i) => ({ v: val }))}>
                                                                    <Area
                                                                        type="monotone"
                                                                        dataKey="v"
                                                                        stroke={item.status === 'critical' ? '#ef4444' : item.status === 'opportunity' ? '#16a34a' : '#94a3b8'}
                                                                        fill={item.status === 'critical' ? '#fca5a5' : item.status === 'opportunity' ? '#bbf7d0' : '#e2e8f0'}
                                                                        strokeWidth={2}
                                                                    />
                                                                </AreaChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium text-gray-600">{item.prediction}</TableCell>
                                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                    <TableCell>{getSmartAction(item)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Smart Tips / Help Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                                    <h4 className="font-bold text-indigo-900">Guide Intelligent</h4>
                                </div>
                                <p className="text-sm text-indigo-800/80 mb-4">
                                    Notre IA analyse vos mouvements de stock pour détecter les anomalies et opportunités.
                                </p>

                                <div className="space-y-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <h5 className="text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                            <Snowflake className="w-3 h-3 text-blue-500" /> Capital Dormant
                                        </h5>
                                        <p className="text-xs text-gray-500">
                                            Produits non vendus depuis +60 jours. Ils vous coûtent de l'argent en stockage. Liquidez-les !
                                        </p>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                        <h5 className="text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                            <Sun className="w-3 h-3 text-amber-500" /> Saisonnalité
                                        </h5>
                                        <p className="text-xs text-gray-500">
                                            L'IA croise vos ventes avec le calendrier local (fêtes religieuses, climat) pour anticiper les besoins.
                                        </p>
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
