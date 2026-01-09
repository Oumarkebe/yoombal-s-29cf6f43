import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts';

const MerchantStore = () => {
    const { merchantId } = useParams<{ merchantId: string }>();
    const { products, isLoading } = useMarketplaceProducts({
        filters: { merchant_id: merchantId }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Chargement de la boutique...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Get merchant info from first product
    const merchantInfo = products[0]?.profiles;
    const businessName = merchantInfo?.business_name ||
        `${merchantInfo?.first_name || ''} ${merchantInfo?.last_name || ''}`.trim() ||
        'Marchand Yoombal';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1">
                {/* Header with merchant info */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to="/marketplace" className="inline-flex items-center text-white hover:text-blue-100 mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour au marketplace
                        </Link>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{businessName}</h1>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span>4.8 (125 avis)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>Dakar, Sénégal</span>
                                    </div>
                                </div>
                                {merchantInfo?.email && (
                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                        <Mail className="h-4 w-4" />
                                        <span>{merchantInfo.email}</span>
                                    </div>
                                )}
                            </div>
                            <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                                Contacter le marchand
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Produits disponibles ({products.length})
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Découvrez tous les produits de cette boutique
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="text-6xl mb-4">🛍️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Aucun produit disponible
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Ce marchand n'a pas encore ajouté de produits à sa boutique.
                            </p>
                            <Button asChild>
                                <Link to="/marketplace">Retour au marketplace</Link>
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image_url || "/placeholder.svg"}
                                    merchant={businessName}
                                    bnplAvailable={product.bnpl_enabled || product.price >= 50000}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MerchantStore;
