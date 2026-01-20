import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Package, X, Sun, Moon } from 'lucide-react';
import ProductCard from './ProductCard';
import { useMarketplaceProducts, SortByOption } from '@/hooks/useMarketplaceProducts';
import { useCategories, Category } from '@/hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    products,
    isLoading,
    getMerchantName,
    setSearchTerm: setProductsSearchTerm,
    setSelectedCategory: setProductsSelectedCategory,
    sortBy,
    setSortBy,
    isFetchingMore,
    hasMore,
    loadMoreProducts,
  } = useMarketplaceProducts();

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const sortOptions: { label: string; value: SortByOption }[] = [
    { label: 'Plus récents', value: { field: 'created_at', ascending: false } },
    { label: 'Prix: Croissant', value: { field: 'price', ascending: true } },
    { label: 'Prix: Décroissant', value: { field: 'price', ascending: false } },
  ];

  const handleSortChange = (value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      setSortBy(parsedValue);
    } catch (e) {
      console.error('Failed to parse sort option', e);
    }
  };

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setProductsSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, setProductsSearchTerm]);

  useEffect(() => {
    setProductsSelectedCategory(selectedCategory || '');
  }, [selectedCategory, setProductsSelectedCategory]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900/50"></div>
        <div className="hidden md:block absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-violet-600/30 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="hidden md:block absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-blue-600/30 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-200"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in-up">
              Bienvenue sur la Marketplace
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Découvrez des milliers de produits de nos vendeurs partenaires et profitez du paiement
              en plusieurs fois.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <form
                className="flex w-full sm:w-auto max-w-md gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Déjà géré par le useEffect debounced sur searchTerm
                  // Mais on update tout de même pour UX
                  setProductsSearchTerm(searchTerm);
                }}
                role="search"
                aria-label="Barre de recherche produits"
              >
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full pl-12 pr-10 rounded-md bg-white/5 border-white/20 text-white placeholder-gray-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                      type="button"
                      onClick={handleClearSearch}
                      aria-label="Effacer la recherche"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-5 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow transition disabled:opacity-80"
                  type="submit"
                  aria-label="Lancer la recherche"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </Button>
              </form>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto whitespace-nowrap rounded-xl border-2 border-violet-500 text-violet-100 bg-gradient-to-r from-violet-800/80 to-blue-900/60 hover:from-violet-900 hover:to-blue-900 shadow-lg transition hover:-translate-y-1 hover:scale-105"
                style={{
                  fontSize: '1.15rem',
                  padding: '0.9rem 2.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                <Link to="/platform" className="flex items-center gap-2">
                  Découvrir la plateforme
                  <span className="ml-1 animate-fade-in-left">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {isLoadingCategories ? (
            <p className="text-gray-500 dark:text-gray-400">Chargement des catégories...</p>
          ) : (
            categories?.map((category: Category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                onClick={() => handleCategoryClick(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))
          )}
        </div>

        <div>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchTerm
                ? `Résultats pour "${searchTerm}"`
                : selectedCategory
                  ? categories?.find((c) => c.id === selectedCategory)?.name
                  : 'Tous les produits'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {products.length} produit{products.length !== 1 ? 's' : ''} trouvé
                {products.length !== 1 ? 's' : ''}
              </span>
              <Select onValueChange={handleSortChange} defaultValue={JSON.stringify(sortBy)}>
                <SelectTrigger className="w-auto md:w-[180px] dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.label} value={JSON.stringify(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Changer le thème"
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
              <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Essayez d'ajuster votre recherche ou vos filtres.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
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
          )}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg"
              onClick={loadMoreProducts}
              disabled={isFetchingMore}
            >
              {isFetchingMore ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                'Voir plus de produits'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* FLOATING ILLUSTRATION SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center animate-fade-in-up animation-delay-600">
        <img
          src="/img/bnpl-illustration.png"
          alt="Illustration Yoombal"
          className="inline-block max-w-full h-auto md:max-w-3xl"
        />
      </div>
    </div>
  );
};

export default Marketplace;
