
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Instagram, Mail, MessageCircle, Star, Users, Zap, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// MOCK INFLUENCERS
const MOCK_INFLUENCERS = [
    { id: 1, name: "Sokhna Style", handle: "@sokhna_mode", followers: "45K", niche: "Mode Afro", match: 98, fee: "50,000 FCFA" },
    { id: 2, name: "Tech 221", handle: "@tech_senegal", followers: "125K", niche: "High Tech", match: 72, fee: "150,000 FCFA" },
    { id: 3, name: "Cuisine Facile", handle: "@yummy_dakar", followers: "80K", niche: "Alimentaire", match: 15, fee: "75,000 FCFA" },
];

export default function MarketingStudio() {
    const [productName, setProductName] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (!productName) return;
        setIsGenerating(true);
        setTimeout(() => {
            setGeneratedContent(`🔥 Découvrez le nouveau ${productName} ! \n\n✨ Qualité exceptionnelle et design unique pour vous démarquer. \n🚀 Disponible dès maintenant à prix promo !\n\n#Dakar #Promo #Mode #${productName.replace(' ', '')} #Yoombal`);
            setIsGenerating(false);
            toast.success("Contenu généré par l'IA !");
        }, 1500);
    };

    const handleSendCampaign = () => {
        toast.success("Campagne SMS (2,400 destinataires) programmée !");
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                            Studio Marketing IA
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Générez du contenu viral et collaborez avec les meilleurs influenceurs.
                        </p>
                    </div>
                </div>

                <Tabs defaultValue="generator" className="space-y-6">
                    <TabsList className="grid w-full md:w-[600px] grid-cols-3">
                        <TabsTrigger value="generator">Générateur de Contenu</TabsTrigger>
                        <TabsTrigger value="influencers">Influenceurs Locaux</TabsTrigger>
                        <TabsTrigger value="campaigns">Campagnes Auto</TabsTrigger>
                    </TabsList>

                    {/* GENERATOR TAB */}
                    <TabsContent value="generator">
                        <PremiumFeatureGate featureKey="generation_contenu">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Création Assistée</CardTitle>
                                        <CardDescription>Décrivez votre produit, l'IA s'occupe du reste.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nom du Produit / Service</Label>
                                            <Input
                                                placeholder="ex: Robe Bazin Riche..."
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type de Contenu</Label>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="bg-pink-50 text-pink-700 border-pink-200"><Instagram className="w-4 h-4 mr-2" /> Post Instagram</Button>
                                                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-200"><Search className="w-4 h-4 mr-2" /> Description SEO</Button>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full bg-purple-600 hover:bg-purple-700"
                                            disabled={isGenerating || !productName}
                                            onClick={handleGenerate}
                                        >
                                            {isGenerating ? <Zap className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                            {isGenerating ? "Magie en cours..." : "Générer avec l'IA"}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-900 text-white border-none">
                                    <CardHeader>
                                        <CardTitle className="text-slate-300 flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4" /> Résultat
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {generatedContent ? (
                                            <div className="bg-white/10 p-4 rounded-lg min-h-[200px] whitespace-pre-wrap font-medium">
                                                {generatedContent}
                                            </div>
                                        ) : (
                                            <div className="h-[200px] flex items-center justify-center text-slate-500 italic border border-dashed border-slate-700 rounded-lg">
                                                Le résultat s'affichera ici...
                                            </div>
                                        )}
                                        {generatedContent && (
                                            <div className="mt-4 flex gap-2">
                                                <Button size="sm" variant="secondary" className="w-full">Copier</Button>
                                                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">Publier</Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* INFLUENCERS TAB */}
                    <TabsContent value="influencers">
                        <PremiumFeatureGate featureKey="influence_locale">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Influenceurs pour vous</CardTitle>
                                    <CardDescription>Algorithme de matching basé sur votre niche (Mode Masculine).</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4">
                                        {MOCK_INFLUENCERS.map(inf => (
                                            <div key={inf.id} className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 border-2 border-purple-100">
                                                        <AvatarFallback>{inf.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{inf.name} <span className="text-gray-400 font-normal text-sm">{inf.handle}</span></h4>
                                                        <div className="flex items-center gap-2 text-sm mt-1">
                                                            <Badge variant="secondary" className="bg-purple-50 text-purple-700">{inf.niche}</Badge>
                                                            <span className="text-gray-500">• {inf.followers} abonnés</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-green-600 font-bold mb-1">
                                                        <Zap className="w-4 h-4 fill-green-600" /> {inf.match}% Match
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">Tarif: {inf.fee}</p>
                                                    <Button size="sm" variant="outline">Contacter</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* CAMPAIGNS TAB */}
                    <TabsContent value="campaigns">
                        <PremiumFeatureGate featureKey="campagnes_auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Campagnes SMS & WhatsApp</CardTitle>
                                    <CardDescription>Envoyez des promos ciblées à vos segments clients.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                                    <div className="bg-green-100 p-4 rounded-full">
                                        <Mail className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold">Lancer une Promo Flash</h3>
                                    <p className="max-w-md text-gray-500">
                                        L'IA a détecté que le segment "Clients Fidèles (Dakar)" réagit bien aux promos du Vendredi.
                                    </p>
                                    <Button className="bg-green-600 hover:bg-green-700 w-full max-w-xs" onClick={handleSendCampaign}>
                                        Envoyer SMS à 2,400 contacts (12,000 FCFA)
                                    </Button>
                                </CardContent>
                            </Card>
                        </PremiumFeatureGate>
                    </TabsContent>

                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
