import React from 'react';
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts';
import ProductCard from '@/components/ProductCard';
import { Sparkles, Loader2 } from 'lucide-react';
import { useUserAiFeature } from '@/hooks/useUserAiFeature';

interface AIRecommendationsProps {
  currentProductId: string;
  categoryId: string;
}

export function AIRecommendations({ currentProductId, categoryId }: AIRecommendationsProps) {
  const { products, isLoading, getMerchantName } = useMarketplaceProducts();
  const { isEnabled: isRecommendationEnabled, isLoading: isCheckingAI } =
    useUserAiFeature('ai_smart_search');

  if (isLoading || isCheckingAI) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isRecommendationEnabled) return null;

  // Filter products from the same category, excluding the current one
  const recommendations = products
    .filter((p) => p.category_id === categoryId && p.id !== currentProductId)
    .slice(0, 4);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-16 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-amber-100 p-2 rounded-lg">
          <Sparkles className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recommandations de l'IA</h2>
          <p className="text-sm text-gray-500">Produits sélectionnés intelligemment pour vous.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image_url || '/placeholder.svg'}
            merchant={getMerchantName(product)}
            bnplAvailable={product.price >= 50000}
          />
        ))}
      </div>
    </div>
  );
}
