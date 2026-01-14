
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

const MerchantStore = () => {
    const { merchantId } = useParams<{ merchantId: string }>();
    const { products, isLoading, setSearchTerm } = useMarketplaceProducts();

    // Filter products by merchant
    const merchantProducts = products.filter(p => p.merchant_id === merchantId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
                        <span className="text-gray-500">Chargement de la boutique...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Get merchant info from first product
    const merchantInfo = merchantProducts[0]?.profiles;
    // Handle the case where profiles might be an array or object depending on join
    const profileData = Array.isArray(merchantInfo) ? merchantInfo[0] : merchantInfo;

    const businessName = profileData?.business_name ||
        `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim() ||
        'Marchand Yoombal';

    // Mock data for location if not available
    const location = profileData?.zone || 'Dakar, Sénégal';

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <div className="container mx-auto px-4">

                {/* Header with merchant info */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4">
                            <Link to="/marketplace" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Retour au marketplace
                            </Link>

                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {businessName.charAt(0)}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                                            <span>4.8 (125 avis)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button className="mt-4 md:mt-0" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contacter le marchand
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products grid */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Produits disponibles ({merchantProducts.length})</h2>
                        </div>
                        <div className="text-sm text-gray-500 hidden md:block">
                            Découvrez tous les produits de cette boutique
                        </div>
                    </div>

                    {merchantProducts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                            <div className="text-4xl mb-4">🛍️</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Aucun produit disponible
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Ce marchand n'a pas encore ajouté de produits à sa boutique.
                            </p>
                            <Link to="/marketplace">
                                <Button variant="outline">Retour au marketplace</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {merchantProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.image_url || '/placeholder.svg'}
                                    merchant={businessName}
                                    bnplAvailable={product.price >= 50000}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MerchantStore;
