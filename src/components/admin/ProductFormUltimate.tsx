import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Product, ProductFormData, ProductUnit } from '@/types/product';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { DynamicSpecsForm } from './products/DynamicSpecsForm';
import { MediaUploader } from './products/MediaUploader';
import { SEOAndIAForm } from './products/SEOAndIAForm';
import { AdvancedSettingsForm } from './products/AdvancedSettingsForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormUltimateProps {
    initialData?: Partial<Product>;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isLoading?: boolean;
    onClose?: () => void;
}

const UNITS: { value: ProductUnit, label: string }[] = [
    { value: 'pièce', label: 'Pièce / Unité' },
    { value: 'kg', label: 'Kilogramme (kg)' },
    { value: 'g', label: 'Gramme (g)' },
    { value: 'L', label: 'Litre (L)' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'm', label: 'Mètre (m)' },
    { value: 'm²', label: 'Mètre carré (m²)' },
    { value: 'lot', label: 'Lot / Paquet' },
];

export function ProductFormUltimate({ initialData, onSubmit, isLoading, onClose }: ProductFormUltimateProps) {
    const { data: categories } = useCategories();

    const [formData, setFormData] = useState<ProductFormData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        category_id: initialData?.category_id || '',
        sku: initialData?.sku || '',
        barcode: initialData?.barcode || '',
        price: initialData?.price || 0,
        cost_price: initialData?.cost_price || 0,
        compare_at_price: initialData?.compare_at_price || 0,
        stock: initialData?.stock || 0,
        min_stock: initialData?.min_stock || 0,
        unit: initialData?.unit || 'pièce',
        currency: initialData?.currency || 'XOF',
        tags: initialData?.tags || [],
        gallery: initialData?.gallery || [],
        specs: initialData?.specs || {},
        ai_description: initialData?.ai_description || false,
        is_digital: initialData?.is_digital || false,
        min_order_quantity: initialData?.min_order_quantity || 1,
        published_at: initialData?.published_at || new Date().toISOString(),
        slug: initialData?.slug || '',
        weight: initialData?.weight || 0,
        dimensions: initialData?.dimensions || { length: 0, width: 0, height: 0 },
        download_url: initialData?.download_url || '',
        wholesale_price: initialData?.wholesale_price || null,
        video_url: initialData?.video_url || null,
    });

    const [activeTab, setActiveTab] = useState('general');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [newTag, setNewTag] = useState('');

    const generateAIDescription = async () => {
        if (!formData.name) {
            toast.error("Veuillez d'abord saisir un nom de produit.");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const prompt = `Rédige une description commerciale attractive et détaillée (environ 150 mots) pour ce produit : ${formData.name}. 
            ${formData.tags.length > 0 ? `Inclus les mots-clés suivants : ${formData.tags.join(', ')}.` : ''}
            Le ton doit être professionnel et inciter à l'achat. Réponds uniquement avec le texte de la description en français.`;

            const { data, error } = await supabase.functions.invoke('content-generation', {
                body: { prompt }
            });

            if (error) throw error;

            const generatedText = data.generated_text || data;

            if (generatedText) {
                setFormData(prev => ({
                    ...prev,
                    description: generatedText
                }));
                const providerName = data.provider || "IA";
                toast.success(`Description générée avec succès par ${providerName.toUpperCase()} !`);
            }
        } catch (error: any) {
            console.error('Erreur génération IA:', error);
            toast.error(`Erreur: ${error.message || "Échec de la génération"}`);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Génération SKU automatique
    const generateSKU = () => {
        return `PROD-${Date.now().toString(36).toUpperCase()}`;
    };

    // Calcul marge automatique
    const calculateMargin = () => {
        if (!formData.cost_price || !formData.price) return 0;
        return ((formData.price - formData.cost_price) / formData.price) * 100; // Marge sur prix de vente
    };

    // Gestion tags dynamiques
    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <div className="flex-1 overflow-y-auto px-1"> {/* Padding minimal pour éviter scrollbar coupée */}

                <form onSubmit={handleSubmit} className="space-y-6 pb-24"> {/* Padding bottom pour la barre fixe */}

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur py-2 border-b">
                            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent gap-2">
                                <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    Général
                                </TabsTrigger>
                                <TabsTrigger value="pricing" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    Prix & Stock
                                </TabsTrigger>
                                <TabsTrigger value="specs" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    Attributs
                                </TabsTrigger>
                                <TabsTrigger value="media" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    Média
                                </TabsTrigger>
                                <TabsTrigger value="seo" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    SEO & IA
                                </TabsTrigger>
                                <TabsTrigger value="advanced" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    Avancé
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* ONGLET 1: Général */}
                        <TabsContent value="general" className="mt-0 pt-4">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Informations principales</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom du produit *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Nom complet du produit"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="sku">SKU (Réf. stock) *</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="sku"
                                                    value={formData.sku || ''}
                                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                    placeholder="REF-001"
                                                />
                                                <Button type="button" variant="outline" size="icon" onClick={() => setFormData({ ...formData, sku: generateSKU() })} title="Générer SKU">
                                                    <Sparkles className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Catégorie</Label>
                                        <Select
                                            value={formData.category_id || ''}
                                            onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="description">Description</Label>
                                            {/* Placeholder AI button, real feature in next steps */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={generateAIDescription}
                                                disabled={isGeneratingAI || !formData.name}
                                                className="h-7 text-xs font-normal gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                                            >
                                                {isGeneratingAI ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                                                {isGeneratingAI ? 'Génération...' : 'Rédiger avec l\'IA'}
                                            </Button>
                                        </div>
                                        <Textarea
                                            id="description"
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={5}
                                            placeholder="Description détaillée du produit..."
                                            className="resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tags / Mots-clés</Label>
                                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-50 rounded-md min-h-[40px]">
                                            {formData.tags.length === 0 && <span className="text-sm text-gray-400 italic">Aucun tag</span>}
                                            {formData.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        className="ml-2 hover:bg-slate-200 rounded-full p-0.5"
                                                        onClick={() => removeTag(index)}
                                                    >
                                                        <span className="sr-only">Supprimer</span>
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                placeholder="Ajouter un tag..."
                                                className="max-w-xs"
                                            />
                                            <Button type="button" variant="secondary" onClick={addTag} disabled={!newTag.trim()}>
                                                AJOUTER
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ONGLET 2: Prix & Stock */}
                        <TabsContent value="pricing" className="mt-0 pt-4">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Tarification et Inventaire</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Unite */}
                                        <div className="space-y-2">
                                            <Label htmlFor="unit">Unité de vente</Label>
                                            <Select
                                                value={formData.unit}
                                                onValueChange={(val) => setFormData({ ...formData, unit: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {UNITS.map(u => (
                                                        <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Prix Vente */}
                                        <div className="space-y-2">
                                            <Label htmlFor="price" className="text-primary font-semibold">Prix de vente (XOF) *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="1"
                                                    min="0"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                    className="pl-4 font-bold text-lg"
                                                    required
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">CFA</span>
                                            </div>
                                        </div>

                                        {/* Prix Promo */}
                                        <div className="space-y-2">
                                            <Label htmlFor="compare_at_price">Prix barré (Optionnel)</Label>
                                            <Input
                                                id="compare_at_price"
                                                type="number"
                                                min="0"
                                                value={formData.compare_at_price || ''}
                                                onChange={(e) => setFormData({ ...formData, compare_at_price: parseFloat(e.target.value) || 0 })}
                                                placeholder="Ex: 5000"
                                            />
                                            {formData.compare_at_price && formData.compare_at_price > formData.price ? (
                                                <p className="text-xs text-green-600 font-medium">-{Math.round((1 - formData.price / formData.compare_at_price) * 100)}% de réduction</p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t">
                                        {/* Prix Achat (Marge) */}
                                        <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <Label htmlFor="cost_price" className="text-xs text-gray-500 uppercase font-bold tracking-wider">Analyse de Marge</Label>
                                            <div className="space-y-2">
                                                <Label htmlFor="cost_price">Prix de revient (Achat)</Label>
                                                <Input
                                                    id="cost_price"
                                                    type="number"
                                                    min="0"
                                                    value={formData.cost_price || ''}
                                                    onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                                                    placeholder="0"
                                                    className="bg-white"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-1">
                                                <span>Marge brute:</span>
                                                <span className={`font-bold ${calculateMargin() >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {calculateMargin().toFixed(1)}% ({formData.price - formData.cost_price} CFA)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stock */}
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock actuel</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                min="0"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>

                                        {/* Alerte */}
                                        <div className="space-y-2">
                                            <Label htmlFor="min_stock">Seuil d'alerte critique</Label>
                                            <Input
                                                id="min_stock"
                                                type="number"
                                                min="0"
                                                value={formData.min_stock}
                                                onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                                            />
                                            {formData.stock <= formData.min_stock && (
                                                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                                                    <ArrowUpRight className="h-3 w-3" /> Niveau de stock critique
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ONGLET 3: Attributs dynamiques */}
                        <TabsContent value="specs" className="mt-0 pt-4">
                            <DynamicSpecsForm
                                specs={formData.specs}
                                onChange={(specs) => setFormData({ ...formData, specs })}
                                categoryId={formData.category_id || undefined}
                            />
                        </TabsContent>

                        {/* ONGLET 4: Média */}
                        <TabsContent value="media" className="mt-0 pt-4">
                            <MediaUploader
                                images={formData.gallery}
                                onImagesChange={(gallery) => setFormData({ ...formData, gallery })}
                                videoUrl={formData.video_url}
                                onVideoChange={(video_url) => setFormData({ ...formData, video_url: video_url || null })}
                            />
                        </TabsContent>

                        {/* ONGLET 5: SEO & IA */}
                        <TabsContent value="seo" className="mt-0 pt-4">
                            <SEOAndIAForm
                                formData={formData}
                                onChange={setFormData}
                            />
                        </TabsContent>

                        {/* ONGLET 6: Avancé (B2B & Digital) */}
                        <TabsContent value="advanced" className="mt-0 pt-4">
                            <AdvancedSettingsForm
                                formData={formData}
                                onChange={setFormData}
                            />
                        </TabsContent>

                    </Tabs>

                    {/* Action Bar Fixed Bottom */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={!!formData.published_at}
                                onCheckedChange={(c) => setFormData({ ...formData, published_at: c ? new Date().toISOString() : null })}
                            />
                            <Label className="cursor-pointer">
                                {formData.published_at ? <span className="text-green-600 font-medium">En ligne</span> : <span className="text-gray-500">Brouillon (Hors ligne)</span>}
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            {onClose && (
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Annuler
                                </Button>
                            )}
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {initialData ? 'Mettre à jour' : 'Créer le produit'}
                            </Button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
