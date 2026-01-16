import React, { useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, CreditCard, Download, ExternalLink, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formatDownloadUrl = (url: string) => {
    if (!url) return '';
    // Remove extra quotes if present
    let cleaned = url.replace(/^"|"$/g, '').trim();
    // If it's a local Windows path, ensure it doesn't become a relative URL
    if (cleaned.match(/^[a-zA-Z]:[\\\/]/)) {
        return `file:///${cleaned.replace(/\\/g, '/')}`;
    }
    return cleaned;
};

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = React.useState<any>(null);
    const [digitalItems, setDigitalItems] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        fetchOrderDetails();

        // Annonce pour accessibilité
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Votre commande a été confirmée avec succès');
            utterance.lang = 'fr-FR';
            window.speechSynthesis.speak(utterance);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (*)
                    )
                `)
                .eq('id', orderId)
                .single();

            if (error) throw error;
            setOrder(data);

            // Filter digital items
            const digital = data.order_items
                ?.filter((item: any) => item.products?.is_digital)
                ?.map((item: any) => ({
                    name: item.products.name,
                    downloadUrl: item.products.download_url
                })) || [];

            setDigitalItems(digital);
        } catch (error: any) {
            console.error("Error fetching order:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les détails de la commande.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center py-12">
                <Card className="max-w-2xl w-full mx-4 p-8 bg-white/90 border-0 shadow-xl">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-100 p-6">
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Commande confirmée !
                        </h1>

                        <p className="text-lg text-gray-600 mb-2">
                            Merci pour votre achat
                        </p>

                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
                            <p className="text-2xl font-mono font-bold text-blue-600">#{orderId?.slice(0, 8)}</p>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <>
                                {digitalItems.length > 0 && ['paid', 'delivered', 'completed', 'shipped'].includes(order.status?.toLowerCase()) && (() => {
                                    const orderDate = new Date(order.created_at);
                                    const now = new Date();
                                    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
                                    const diffHours = diffTime / (1000 * 60 * 60);
                                    const isExpired = diffHours > 48;

                                    if (isExpired) {
                                        return (
                                            <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-center gap-2 text-sm text-amber-700">
                                                <Clock className="h-5 w-5" />
                                                Lien de téléchargement expiré (48h écoulées)
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <h3 className="text-lg font-bold text-emerald-900 flex items-center justify-center gap-2 mb-4">
                                                <Download className="h-5 w-5" />
                                                Vos produits numériques sont prêts !
                                            </h3>
                                            <div className="space-y-3">
                                                {digitalItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                                        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                                            <a href={formatDownloadUrl(item.downloadUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                                Télécharger <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="grid md:grid-cols-3 gap-4 mb-8">
                                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                        <Package className="h-8 w-8 text-blue-600 mb-2" />
                                        <p className="font-semibold text-sm">Préparation</p>
                                        <p className="text-xs text-gray-600">
                                            {digitalItems.length === order?.order_items?.length ? 'Complétée' : 'En cours'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                        <Truck className="h-8 w-8 text-gray-400 mb-2" />
                                        <p className="font-semibold text-sm">Livraison</p>
                                        <p className="text-xs text-gray-600">
                                            {digitalItems.length > 0 ? 'Instantanée' : 'À venir'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                        <CreditCard className="h-8 w-8 text-green-500 mb-2" />
                                        <p className="font-semibold text-sm">Paiement</p>
                                        <p className="text-xs text-green-600">Confirmé</p>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-3">
                            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-violet-600">
                                <Link to="/profile?tab=orders">
                                    Voir mes commandes
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link to="/marketplace">
                                    Continuer mes achats
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                            <p className="text-sm text-amber-900">
                                📧 Un email de confirmation a été envoyé à votre adresse
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default OrderConfirmation;
