import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BNPLCalculator from '@/components/BNPLCalculator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, ArrowLeft, MapPin, UserPlus } from 'lucide-react';
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts';
import ProductReviews from "@/components/ProductReviews";
import BNPLApplicationForm from "@/components/BNPLApplicationForm";

const ProductDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBNPLForm, setShowBNPLForm] = useState(false);

  // Récupération des produits du marketplace
  const { products, isLoading } = useMarketplaceProducts();
  // Recherche du produit courant par id
  const product = products.find((p) => p.id === id);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Erreur lors du chargement du produit.</div>;
  }

  // Adaptation des champs pour compatibilité avec l'ancien mock
  const productData = {
    ...product,
    images: product.image_url ? [product.image_url] : ['/placeholder.svg'],
    originalPrice: product.price, // À remplacer si tu as le champ en base
    rating: 4.5, // À remplacer par la vraie donnée si dispo
    reviewCount: 0, // À remplacer par la vraie donnée si dispo
    merchant: product.profiles?.business_name || product.profiles?.first_name || 'Marchand Yoombal',
    merchantRating: 4.8, // À remplacer par la vraie donnée si dispo
    location: 'Dakar', // À remplacer par la vraie donnée si dispo
    inStock: product.stock > 0,
    stockCount: product.stock,
    category: product.categories?.name || 'Catégorie',
    specs: {}, // À remplacer par la vraie donnée si dispo
    features: ['Livraison gratuite', 'Garantie 2 ans', 'Échange 30 jours', 'Paiement BNPL disponible'],
    bnpl_enabled: product.bnpl_enabled || false,
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(productData.id);
    }
    
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} x ${productData.name}`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Accueil</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
            <span>/</span>
            <span className="text-gray-900">{productData.category}</span>
            <span>/</span>
            <span className="text-gray-900">{productData.name}</span>
          </div>

          <Button variant="outline" className="mb-6" asChild>
            <Link to="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au marketplace
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images du produit */}
            <div className="space-y-4">
              <Card className="p-4">
                <img
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </Card>
              <div className="grid grid-cols-4 gap-2">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`Vue ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations du produit */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(productData.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {productData.rating} ({productData.reviewCount} avis)
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(productData.price)}
                  </span>
                  {productData.originalPrice > productData.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatCurrency(productData.originalPrice)}
                    </span>
                  )}
                  <Badge className="bg-red-100 text-red-800">
                    -{Math.round((1 - productData.price / productData.originalPrice) * 100)}%
                  </Badge>
                </div>

                <p className="text-gray-600 mb-6">{productData.description}</p>
              </div>

              {/* Marchand */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900">{productData.merchant}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        {renderStars(productData.merchantRating)}
                      </div>
                      <span className="text-blue-700">({productData.merchantRating})</span>
                      <span className="text-blue-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {productData.location}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir boutique
                  </Button>
                </div>
              </Card>

              {/* Stock et quantité */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {productData.inStock ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700">En stock ({productData.stockCount} disponibles)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700">Rupture de stock</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      className="px-3 py-2 hover:bg-gray-100"
                      onClick={() => setQuantity(Math.min(productData.stockCount, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600"
                    onClick={handleAddToCart}
                    disabled={!productData.inStock}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>

              {/* Fonctionnalités */}
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {productData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {index === 0 && <Truck className="h-4 w-4 text-green-600" />}
                      {index === 1 && <Shield className="h-4 w-4 text-blue-600" />}
                      {index === 2 && <ArrowLeft className="h-4 w-4 text-orange-600" />}
                      {index === 3 && <Star className="h-4 w-4 text-purple-600" />}
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Onglets détails */}
          <div className="mt-12">
            <Tabs defaultValue="specs" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
                <TabsTrigger value="bnpl">Paiement BNPL</TabsTrigger>
                <TabsTrigger value="reviews">Avis clients</TabsTrigger>
                <TabsTrigger value="bnpl-request">
                  {isAuthenticated ? 'Demander BNPL' : 'BNPL (Inscription requise)'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Caractéristiques techniques</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(productData.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="bnpl">
                <BNPLCalculator />
              </TabsContent>

              <TabsContent value="reviews">
                <ProductReviews productId={productData.id} />
              </TabsContent>

              <TabsContent value="bnpl-request">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Demande de paiement échelonné</h3>
                  {productData.bnpl_enabled ? (
                    <BNPLApplicationForm
                      product={{
                        id: productData.id,
                        name: productData.name,
                        price: productData.price,
                        merchant_id: productData.merchant_id
                      }}
                      onSuccess={() => {
                        setShowBNPLForm(false);
                      }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        Ce produit n'est pas éligible au paiement échelonné.
                      </p>
                      <p className="text-sm text-gray-500">
                        Le marchand n'a pas activé cette option pour ce produit.
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
