
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, UserPlus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProductRating } from "@/hooks/useProductRating";
import { Link } from 'react-router-dom';
import { CategoryBadge } from './CategoryBadge';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  merchant: string;
  bnplAvailable?: boolean;
  isSponsored?: boolean;
  categoryName?: string;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  merchant,
  bnplAvailable = false,
  isSponsored = false,
  categoryName
}: ProductCardProps) => {
  const { addItem, triggerAnimation } = useCart();
  const { isAuthenticated } = useAuth();
  const { average, count } = useProductRating(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    addItem(id);
    triggerAnimation({ x: e.clientX, y: e.clientY }, image);
  };

  const formattedPrice = new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(price);

  return (
    <Card className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col">
      <Link to={`/product/${id}`} className="block">
        <div className="relative overflow-hidden">
          {isSponsored && (
            <div className="absolute top-2 right-2 z-10 bg-amber-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-amber-400">
              SPONSORISÉ
            </div>
          )}
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-0 right-0 p-2">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full bg-white/70 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          {bnplAvailable && (
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold tracking-wide">
                BNPL
              </div>
              {!isAuthenticated && (
                <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Inscription
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2 text-sm">
          <Star
            className={`h-4 w-4 ${average && average > 0
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
              }`}
          />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {average !== null ? average.toFixed(1) : "N/A"}
          </span>
          <span className="text-gray-500 dark:text-gray-400">({count} avis)</span>
        </div>

        {categoryName && (
          <div className="mb-2">
            <CategoryBadge name={categoryName} showIcon={false} className="text-[10px] py-0 px-2 h-5 opacity-80" />
          </div>
        )}

        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2 flex-grow hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{merchant}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formattedPrice}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice.toLocaleString()} CFA
            </span>
          )}
        </div>

        <Button
          className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart(e);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
