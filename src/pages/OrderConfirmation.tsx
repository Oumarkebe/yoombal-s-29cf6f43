import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';

const OrderConfirmation = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId') || 'N/A';

    useEffect(() => {
        // Annonce pour accessibilité
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Votre commande a été confirmée avec succès');
            utterance.lang = 'fr-FR';
            window.speechSynthesis.speak(utterance);
        }
    }, []);

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
                            <p className="text-2xl font-mono font-bold text-blue-600">#{orderId}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                <Package className="h-8 w-8 text-blue-600 mb-2" />
                                <p className="font-semibold text-sm">Préparation</p>
                                <p className="text-xs text-gray-600">En cours</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                <Truck className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="font-semibold text-sm">Livraison</p>
                                <p className="text-xs text-gray-600">À venir</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                <CreditCard className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="font-semibold text-sm">Paiement</p>
                                <p className="text-xs text-gray-600">En attente</p>
                            </div>
                        </div>

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
