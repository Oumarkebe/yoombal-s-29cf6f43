
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ShieldCheck, Smartphone, TrendingUp, AlertTriangle, CheckCircle, Wallet, Crown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';

// MOCK DATA: TONTINES
const MOCK_TONTINE_MEMBERS = [
    { id: 1, name: "Fatou Diop", status: "payé", turn: "Janvier (Reçu)" },
    { id: 2, name: "Moussa Sow", status: "payé", turn: "Février" },
    { id: 3, name: "Awa Ndiaye", status: "payé", turn: "Mars" },
    { id: 4, name: "Vous (Boutique)", status: "en_attente", turn: "Avril" },
    { id: 5, name: "Cheikh Fall", status: "retard", turn: "Mai" },
];

// MOCK DATA: MOMO
const MOCK_TRANSACTIONS = [
    { id: "TX992", method: "Orange Money", type: "in", amount: 50000, status: "safe", customer: "Client #8821" },
    { id: "TX993", method: "Wave", type: "in", amount: 12500, status: "safe", customer: "Client #1234" },
    { id: "TX994", method: "Carte", type: "out", amount: 200000, status: "suspicious", customer: "IP Inconnue (Lagos)" },
    { id: "TX995", method: "Orange Money", type: "in", amount: 5000, status: "safe", customer: "Client #5522" },
];

export default function AfricaFinancePage() {
    const [activeTab, setActiveTab] = useState('tontines');
    const [contributionPaid, setContributionPaid] = useState(false);

    const handlePayContribution = () => {
        setContributionPaid(true);
        toast.success("Cotisation Tontine payée via Wave !");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Wallet className="w-8 h-8 text-emerald-600" />
                            Finance & Tontines
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Gérez vos finances, votre solvabilité et vos groupes communautaires avec l'IA.
                        </p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full md:w-[600px] grid-cols-3">
                        <TabsTrigger value="tontines">Tontines Digitales</TabsTrigger>
                        <TabsTrigger value="momo">Mobile Money IA</TabsTrigger>
                        <TabsTrigger value="scoring">Credit Scoring</TabsTrigger>
                    </TabsList>

                    {/* TONTINES TAB */}
                    <TabsContent value="tontines" className="space-y-6">
                        <PremiumFeatureGate featureKey="paiement_tontine">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Groupe "Commerçants Sandaga"</span>
                                            <Badge className="bg-emerald-600">Actif</Badge>
                                        </CardTitle>
                                        <CardDescription>Cycle mensuel • 50,000 FCFA / part</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 mb-6 flex flex-col items-center justify-center text-center">
                                            <p className="text-sm font-medium text-emerald-800 uppercase tracking-widest mb-2">Cagnotte du Mois</p>
                                            <h2 className="text-4xl font-bold text-emerald-900 mb-2">250,000 FCFA</h2>
                                            <p className="text-emerald-700">Bénéficiaire : <strong>Moussa Sow</strong> (Février)</p>
                                        </div>

                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Membre</TableHead>
                                                    <TableHead>Statut Cotisation</TableHead>
                                                    <TableHead>Tour de Réception</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MOCK_TONTINE_MEMBERS.map(m => (
                                                    <TableRow key={m.id}>
                                                        <TableCell className="font-medium flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {m.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {m.name.includes("Vous") && !contributionPaid ? (
                                                                <Button size="sm" onClick={handlePayContribution} className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs">
                                                                    Payer ma part
                                                                </Button>
                                                            ) : (
                                                                <Badge variant={m.status === 'retard' ? 'destructive' : 'outline'} className={m.status === 'payé' || contributionPaid ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : ''}>
                                                                    {m.name.includes("Vous") && contributionPaid ? 'Payé' : m.status}
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{m.turn}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Prochain Paiement</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="border rounded-lg p-4 bg-slate-50">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-500">Date limite</span>
                                                <span className="text-sm font-medium">5 Février</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Montant</span>
                                                <span className="text-sm font-bold">50,000 FCFA</span>
                                            </div>
                                        </div>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handlePayContribution} disabled={contributionPaid}>
                                            {contributionPaid ? "Cotisation à jour" : "Payer par Mobile Money"}
                                        </Button>
                                        <p className="text-xs text-center text-gray-400">
                                            Sécurisé par Yoombal Trust™
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* MOBILE MONEY TAB */}
                    <TabsContent value="momo" className="space-y-6">
                        <PremiumFeatureGate featureKey="mobile_money_ia">
                            <div className="grid grid-cols-1 gap-6">
                                <Card className="border-l-4 border-l-blue-600">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Smartphone className="w-5 h-5 text-blue-600" />
                                            Surveillance Mobile Money IA
                                        </CardTitle>
                                        <CardDescription>
                                            Analyse en temps réel de toutes les transactions entrantes (Wave, OM, Free).
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Méthode</TableHead>
                                                    <TableHead>Montant</TableHead>
                                                    <TableHead>Client</TableHead>
                                                    <TableHead>Analyse IA</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {MOCK_TRANSACTIONS.map(tx => (
                                                    <TableRow key={tx.id}>
                                                        <TableCell>
                                                            {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4 text-green-500" /> : <ArrowUpRight className="w-4 h-4 text-gray-500" />}
                                                        </TableCell>
                                                        <TableCell className="font-medium">{tx.method}</TableCell>
                                                        <TableCell>{tx.amount.toLocaleString()} FCFA</TableCell>
                                                        <TableCell>{tx.customer}</TableCell>
                                                        <TableCell>
                                                            {tx.status === 'safe' ? (
                                                                <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 flex w-fit gap-1 items-center">
                                                                    <CheckCircle className="w-3 h-3" /> Fiable
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="destructive" className="flex w-fit gap-1 items-center animate-pulse">
                                                                    <AlertTriangle className="w-3 h-3" /> Suspect (Fraude ?)
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* CREDIT SCORING TAB */}
                    <TabsContent value="scoring" className="space-y-6">
                        <PremiumFeatureGate featureKey="credit_scoring">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
                                    <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                                        {/* Fake Gauge */}
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-bold">780</span>
                                            <span className="text-sm text-green-400">EXCELLENT</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl mb-2">Votre Score de Solvabilité</CardTitle>
                                    <p className="text-slate-400 mb-6 max-w-sm">
                                        Basé sur vos transactions Mobile Money, votre historique Tontine et vos ventes Yoombal.
                                    </p>
                                    <Button className="bg-green-600 hover:bg-green-700 w-full max-w-xs">
                                        Demander un prêt (BNPL)
                                    </Button>
                                </Card>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-amber-500" />
                                        Avantages Débloqués
                                    </h3>

                                    <Card>
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                                            <div>
                                                <h4 className="font-bold">Paiement en 4x sans frais</h4>
                                                <p className="text-sm text-gray-500">Activé pour vos achats fournisseurs jusqu'à 1M FCFA.</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="bg-green-100 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                                            <div>
                                                <h4 className="font-bold">Avance de Trésorerie Instantanée</h4>
                                                <p className="text-sm text-gray-500">Éligible jusqu'à 500,000 FCFA.</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="opacity-60 border-dashed">
                                        <CardContent className="p-4 flex gap-4 items-start">
                                            <div className="bg-gray-100 p-2 rounded-full"><AlertTriangle className="w-5 h-5 text-gray-400" /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-500">Prêt Expansion Boutique</h4>
                                                <p className="text-sm text-gray-400">Nécessite un score &gt; 800. Continuez vos efforts !</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
