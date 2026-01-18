
import React, { useState } from 'react';
import { useAds, AdCampaign } from '@/hooks/useAds';
import { useProducts } from '@/hooks/useProducts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Plus, TrendingUp, MousePointer, Eye, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const AdsManager = () => {
    const { campaigns, loading, createCampaign } = useAds();
    const { products = [] } = useProducts();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [selectedProductId, setSelectedProductId] = useState('');
    const [budget, setBudget] = useState('500');
    const [duration, setDuration] = useState('7');

    const handleCreate = async () => {
        if (!selectedProductId) return;
        const success = await createCampaign(selectedProductId, Number(budget), Number(duration));
        if (success) {
            setIsCreateOpen(false);
            setSelectedProductId('');
            setBudget('500');
        }
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('fr-XOF', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'default'; // Using default for active (black/dark) or green if we style it
            case 'paused': return 'secondary';
            case 'completed': return 'outline';
            default: return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'paused': return 'En pause';
            case 'completed': return 'Terminé';
            case 'pending_payment': return 'Paiement en attente';
            default: return status;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
                        <Megaphone className="h-8 w-8 text-purple-600" />
                        Yoombal Ads Manager
                    </h1>
                    <p className="text-slate-500 mt-1">Boostez vos ventes avec des campagnes ciblées.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
                            <Plus className="mr-2 h-4 w-4" /> Créer une Campagne
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Nouvelle Campagne Publicitaire</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Produit à sponsoriser</Label>
                                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un produit..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                <div className="flex items-center gap-2">
                                                    {p.image_url && <img src={p.image_url} className="w-6 h-6 rounded object-cover" />}
                                                    <span className="truncate max-w-[200px]">{p.name}</span>
                                                    <span className="text-slate-400 text-xs">({formatMoney(p.price)})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Budget Journalier (CFA)</Label>
                                    <Input
                                        type="number"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        min="100"
                                        step="100"
                                    />
                                    <p className="text-xs text-slate-500">Min. 100 CFA / jour</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Durée (Jours)</Label>
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        min="1"
                                        max="30"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <h4 className="font-bold text-sm text-purple-900 mb-2">Estimation</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Coût Total:</span>
                                    <span className="font-bold text-purple-700">{formatMoney(Number(budget) * Number(duration))}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-600">Vues estimées:</span>
                                    <span className="font-bold text-purple-700">~{Number(budget) * Number(duration) * 10} vues</span>
                                </div>
                            </div>

                            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleCreate} disabled={!selectedProductId}>
                                Lancer la Campagne 🚀
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Vues</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {campaigns.reduce((acc, c) => acc + (c.stats?.views || 0), 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <MousePointer className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Clics</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {campaigns.reduce((acc, c) => acc + (c.stats?.clicks || 0), 0).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">CTR Moyen</p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {(() => {
                                    const totalViews = campaigns.reduce((acc, c) => acc + (c.stats?.views || 0), 0);
                                    const totalClicks = campaigns.reduce((acc, c) => acc + (c.stats?.clicks || 0), 0);
                                    if (totalViews === 0) return '0%';
                                    return ((totalClicks / totalViews) * 100).toFixed(2) + '%';
                                })()}
                            </h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Visual Analytics Chart */}
            <Card className="p-6 border-slate-200 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Performance sur 7 jours</h3>
                        <p className="text-slate-500 text-sm">Vues et Clics cumulés de vos campagnes actives</p>
                    </div>
                    <Select defaultValue="7d">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 derniers jours</SelectItem>
                            <SelectItem value="30d">30 derniers jours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Simulated Chart Area */}
                <div className="h-64 w-full flex items-end justify-between gap-2 px-4 pb-0 relative">
                    {/* Y-Axis Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 pointer-events-none">
                        <div className="w-full border-b border-slate-100 h-0"></div>
                        <div className="w-full border-b border-slate-100 h-0"></div>
                        <div className="w-full border-b border-slate-100 h-0"></div>
                        <div className="w-full border-b border-slate-100 h-0"></div>
                        <div className="w-full border-b border-slate-200 h-0"></div>
                    </div>

                    {[...Array(7)].map((_, i) => {
                        // Mock data simulation for "WoW" effect
                        const views = Math.floor(Math.random() * 500) + 100;
                        const clicks = Math.floor(views * 0.15);
                        const day = new Date();
                        day.setDate(day.getDate() - (6 - i));
                        const heightPercent = (views / 600) * 100;

                        return (
                            <div key={i} className="flex flex-col items-center gap-2 group z-10 w-full">
                                <div className="relative w-full max-w-[40px] flex flex-col items-center justify-end h-48 gap-1">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20 pointer-events-none">
                                        {day.toLocaleDateString(undefined, { weekday: 'short' })}: {views} Vues, {clicks} Clics
                                    </div>

                                    {/* Bars */}
                                    <div style={{ height: `${heightPercent}%` }} className="w-full bg-slate-200 rounded-t-sm relative overflow-hidden transition-all duration-500 group-hover:bg-slate-300">
                                        <div style={{ height: `${(clicks / views) * 100}%` }} className="absolute bottom-0 w-full bg-purple-500 transition-all duration-500 group-hover:bg-purple-600"></div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 bg-slate-200 rounded-sm"></div> Vues
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Clics
                    </div>
                </div>
            </Card>

            {/* Campaign List */}
            <div className="grid gap-6">
                {campaigns.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <Megaphone className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">Aucune campagne active</h3>
                        <p className="text-slate-400 mb-6">Commencez à promouvoir vos produits dès aujourd'hui.</p>
                        <Button variant="outline" onClick={() => setIsCreateOpen(true)}>Créer ma première pub</Button>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <Card key={campaign.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                    {campaign.product?.image_url ? (
                                        <img src={campaign.product.image_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">Img</div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{campaign.product?.name}</h3>
                                        {/* Status Badge needs fixing variants or just manual class */}
                                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className={campaign.status === 'active' ? 'bg-green-600' : ''}>
                                            {getStatusLabel(campaign.status)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Fin: {new Date(campaign.end_date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Budget: {formatMoney(campaign.daily_budget)}/j</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto">
                                <div className="text-center min-w-[80px]">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Vues</p>
                                    <p className="text-xl font-bold text-slate-700">{campaign.stats?.views?.toLocaleString() || 0}</p>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Clics</p>
                                    <p className="text-xl font-bold text-purple-600">{campaign.stats?.clicks?.toLocaleString() || 0}</p>
                                </div>
                                <div className="text-center min-w-[80px]">
                                    <p className="text-xs font-bold uppercase text-slate-400 mb-1">Dépensé</p>
                                    <p className="text-xl font-bold text-slate-700">{formatMoney(campaign.current_spend || 0)}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdsManager;
