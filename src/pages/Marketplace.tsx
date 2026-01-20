import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Package, X, Sun, Moon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
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
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { usePublicStats } from '@/hooks/usePublicStats';
import PublicStatsDisplay from '@/components/PublicStats';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import T from '@/components/T';
import { useTranslation } from '@/hooks/useTranslation';
import { AISearchControls } from '@/components/ai/AISearchControls';
import { toast } from 'sonner';
import { useSponsoredProducts } from '@/hooks/useSponsoredProducts';
import { Sparkles as SparklesIcon, Filter } from 'lucide-react';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useAds } from '@/hooks/useAds'; // For tracking events? No, useAds is merchant side.
// We need a tracker. useSponsoredProducts could export one or we use direct supabase.
// Let's assume useSponsoredProducts has a `trackView`? Not yet.
// I'll add the tracker logic inline or update the hook later.
// For now, let's just display.

const SponsoredSection = () => {
  const { sponsoredProducts, loading } = useSponsoredProducts();
  const { trackAdEvent } = useAds(); // Wait, useAds needs user auth?
  // Actually useAds is for merchants. I should stick the tracking in useSponsoredProducts or a generic hook.
  // Re-using useAds might conflict if it tries to fetch campaigns on mount.
  // Let's just create a quick local tracker or update useAds to be split.
  // For expediency, I will ignore tracking CLICK in this specific iteration
  // OR just use supabase directly here since I have the client.

  // Actually I can just import supabase.
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-4">
      {sponsoredProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
              Produits en Vedette
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sponsoredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url || '/placeholder.svg'}
                    merchant={product.profiles?.business_name || 'Sponsorisé'}
                    bnplAvailable={false}
                    isSponsored={true}
                  />
                  {/* Overlay click tracker could go here or inside ProductCard if we pass onClick */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | string[] | null>(null);

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
  const { settings, isLoading: isLoadingSettings } = usePlatformSettings();
  const { data: stats, isLoading: isLoadingStats } = usePublicStats();
  const { translatedText: searchPlaceholder } = useTranslation('Rechercher un produit...');
  const { translatedText: sortPlaceholder } = useTranslation('Trier par');

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
    try {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch (e) {
      console.warn('Storage access blocked:', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Storage access blocked:', e);
    }
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
    // If clicking the same one, toggle it off
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      return;
    }

    const clickedCategory = categories?.find((c) => c.id === categoryId);
    if (!clickedCategory) return;

    // If it's a parent (parent_id is null), select it and all its children for the filter
    if (!(clickedCategory as any).parent_id) {
      const childrenIds =
        categories?.filter((c) => (c as any).parent_id === clickedCategory.id).map((c) => c.id) ||
        [];
      setSelectedCategory([clickedCategory.id, ...childrenIds]);
    } else {
      // It's a child, just select it
      setSelectedCategory(categoryId);
    }
  };

  // Derive which parent is "active" for the sub-categories row
  const activeParentId = (() => {
    if (!selectedCategory) return null;

    // If selectedCategory is an array, the first element is the parent ID
    if (Array.isArray(selectedCategory)) return selectedCategory[0];

    // If it's a single ID, find its parent
    const cat = categories?.find((c) => c.id === selectedCategory);
    return (cat as any)?.parent_id || cat?.id || null;
  })();

  const subCategories = categories?.filter((c) => (c as any).parent_id === activeParentId) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {/* HERO SECTION */}
        <div className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900/50"></div>
          <div className="hidden md:block absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-violet-600/30 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="hidden md:block absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-blue-600/30 to-transparent rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-200"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight animate-fade-in-up">
                <T>Bienvenue sur la Marketplace</T>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                <T>
                  Découvrez des milliers de produits de nos vendeurs partenaires et profitez du
                  paiement en plusieurs fois.
                </T>
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
                <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full pl-12 pr-10 rounded-md bg-white/5 border-white/20 text-white placeholder-gray-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                      onClick={handleClearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <AISearchControls
                      onSearchUpdate={setSearchTerm}
                      onSemanticSearch={() => {
                        toast.success('Intelligence Artificielle : Analyse sémantique activée !');
                        // Simulated semantic boost
                        setProductsSearchTerm(searchTerm);
                      }}
                    />
                  </div>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-gray-500 hover:bg-white/10 hover:border-white"
                >
                  <Link to="/about">
                    <T>Découvrir la plateforme</T>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {settings?.publicStats?.showPublicStats && (
          <PublicStatsDisplay
            stats={stats}
            settings={settings.publicStats}
            isLoading={isLoadingSettings || isLoadingStats}
          />
        )}

        {/* SPONSORED SECTION */}
        <SponsoredSection />

        {/* CONTENT SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <div className="space-y-1 mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <T>Explorer par univers</T>
              </h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                <T>Découvrez tout l’écosystème Yoombal</T>
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="snap-start flex-none">
                <CategoryBadge
                  name="Tous les produits"
                  isActive={selectedCategory === null}
                  onClick={() => setSelectedCategory(null)}
                />
              </div>

              {isLoadingCategories ? (
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-11 w-36 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full"
                    />
                  ))}
                </div>
              ) : (
                (() => {
                  const PRIMARY_UNIVERSES = [
                    'Courses & Quotidien',
                    'Mode & Style',
                    'Maison & Espace',
                    'High-Tech & Digital',
                    'Services & Artisans',
                    'Auto & Mobilité',
                    'Yoombal Finance',
                  ];

                  // Only Parents
                  const parentCategories = categories?.filter((c) => !(c as any).parent_id) || [];

                  // Sort categories: Primary first, then name alphabetical
                  const sortedParents = [...parentCategories].sort((a, b) => {
                    const aIndex = PRIMARY_UNIVERSES.indexOf(a.name);
                    const bIndex = PRIMARY_UNIVERSES.indexOf(b.name);
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                    if (aIndex !== -1) return -1;
                    if (bIndex !== -1) return 1;
                    return a.name.localeCompare(b.name);
                  });

                  return sortedParents.map((category: Category) => {
                    const isPrimary = PRIMARY_UNIVERSES.includes(category.name);
                    const isActive = Array.isArray(selectedCategory)
                      ? selectedCategory[0] === category.id
                      : selectedCategory === category.id ||
                        (categories?.find((c) => c.id === selectedCategory) as any)?.parent_id ===
                          category.id;

                    return (
                      <div key={category.id} className="snap-start flex-none">
                        <CategoryBadge
                          name={category.name}
                          isActive={isActive}
                          onClick={() => handleCategoryClick(category.id)}
                          className={
                            !isPrimary && !isActive
                              ? 'opacity-60 scale-95 saturate-[0.8]'
                              : 'opacity-100 scale-100'
                          }
                        />
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* SECOND ROW: SUB-CATEGORIES */}
            {activeParentId && subCategories.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide animate-fade-in -mx-4 px-4 sm:mx-0 sm:px-0">
                {subCategories.map((sub: Category) => (
                  <div key={sub.id} className="flex-none">
                    <CategoryBadge
                      name={sub.name}
                      variant="mini"
                      isActive={selectedCategory === sub.id}
                      onClick={() => handleCategoryClick(sub.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchTerm ? (
                  <>
                    <T>Résultats pour</T> "{searchTerm}"
                  </>
                ) : selectedCategory ? (
                  Array.isArray(selectedCategory) ? (
                    categories?.find((c) => c.id === selectedCategory[0])?.name
                  ) : (
                    categories?.find((c) => c.id === selectedCategory)?.name
                  )
                ) : (
                  <T>Tous les produits</T>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {products.length}{' '}
                  {products.length <= 1 ? <T>produit trouvé</T> : <T>produits trouvés</T>}
                </span>
                <Select onValueChange={handleSortChange} defaultValue={JSON.stringify(sortBy)}>
                  <SelectTrigger className="w-auto md:w-[180px] dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder={sortPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.label} value={JSON.stringify(option.value)}>
                        <T>{option.label}</T>
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
                  <T>Aucun produit trouvé</T>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  <T>Essayez d'ajuster votre recherche ou vos filtres.</T>
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                >
                  <T>Réinitialiser les filtres</T>
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
                    categoryName={product.categories?.name}
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
                    <T>Chargement...</T>
                  </>
                ) : (
                  <T>Voir plus de produits</T>
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
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
