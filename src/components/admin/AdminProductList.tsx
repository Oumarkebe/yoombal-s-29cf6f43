import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Package,
  Search,
  Building,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit,
  Eye,
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProductFormUltimate } from './ProductFormUltimate';
import { ProductFormData } from '@/types/product';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/hooks/useProducts';

// On définit un type plus précis pour nos produits, incluant les détails du vendeur.
type ProductWithDetails = Tables<'products'> & {
  categories: { name: string | null } | null;
  profiles: { business_name: string | null } | null;
};

const PAGE_SIZE = 10;

const fetchAllProducts = async (page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('products')
    .select(
      `
      *,
      categories (name),
      profiles!merchant_id (business_name)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }
  return { products: data, count: count ?? 0 };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-100 text-red-800">Rupture</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function AdminProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['allProducts', currentPage, PAGE_SIZE],
    queryFn: () => fetchAllProducts(currentPage, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductWithDetails | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const products = data?.products;
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProductWithDetails | 'business_name' | 'category_name';
    direction: 'ascending' | 'descending';
  }>({ key: 'created_at', direction: 'descending' });
  const [productToDelete, setProductToDelete] = useState<ProductWithDetails | null>(null);

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Nettoyage des champs UI-only
      const { new_tags, gallery_files, ...dbData } = data as any;

      const productToSave = {
        ...dbData,
        merchant_id: user.id,
      };

      const { error } = await supabase.from('products').insert(productToSave);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Produit créé avec succès.' });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      setIsCreating(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      // Nettoyage des champs UI-only
      const { new_tags, gallery_files, ...dbData } = data as any;
      const { error } = await supabase.from('products').update(dbData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: 'Succès', description: 'Produit mis à jour.' });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      setEditingProduct(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
  });

  const handleCreateProduct = async (productData: ProductFormData) => {
    return createProductMutation.mutateAsync(productData);
  };

  const handleUpdateProduct = async (productData: ProductFormData) => {
    if (!editingProduct) return;
    return updateProductMutation.mutateAsync({ id: editingProduct.id, data: productData });
  };

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: `Le produit "${productToDelete?.name}" a été supprimé.`,
      });
      // This invalidates all queries starting with 'allProducts', so it correctly handles pagination.
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      setProductToDelete(null);
      // If on last page and it becomes empty after delete, go to previous page
      if (products?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: `La suppression du produit a échoué: ${error.message}`,
        variant: 'destructive',
      });
      setProductToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id);
  };

  // On applique notre type plus précis aux données reçues.
  const typedProducts = products as unknown as ProductWithDetails[] | undefined;

  const filteredProducts = typedProducts?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.profiles?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = useMemo(() => {
    let sortableItems = [...(filteredProducts || [])];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any, bValue: any;

        if (sortConfig.key === 'business_name') {
          aValue = a.profiles?.business_name?.toLowerCase() || '';
          bValue = b.profiles?.business_name?.toLowerCase() || '';
        } else if (sortConfig.key === 'category_name') {
          aValue = a.categories?.name?.toLowerCase() || '';
          bValue = b.categories?.name?.toLowerCase() || '';
        } else if (sortConfig.key === 'name' || sortConfig.key === 'status') {
          aValue = (a[sortConfig.key as keyof ProductWithDetails] || '').toString().toLowerCase();
          bValue = (b[sortConfig.key as keyof ProductWithDetails] || '').toString().toLowerCase();
        } else {
          aValue = a[sortConfig.key as keyof ProductWithDetails];
          bValue = b[sortConfig.key as keyof ProductWithDetails];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredProducts, sortConfig]);

  const requestSort = (key: keyof ProductWithDetails | 'business_name' | 'category_name') => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({
    children,
    columnKey,
  }: {
    children: React.ReactNode;
    columnKey: keyof ProductWithDetails | 'business_name' | 'category_name';
  }) => (
    <TableHead
      onClick={() => requestSort(columnKey)}
      className="cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        {children}
        {sortConfig?.key === columnKey &&
          (sortConfig.direction === 'ascending' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">Erreur lors du chargement des produits.</div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom de produit ou nom du vendeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[80px]">Image</TableHead>
                <SortableHeader columnKey="name">Nom du produit</SortableHeader>
                <SortableHeader columnKey="business_name">Vendeur</SortableHeader>
                <SortableHeader columnKey="category_name">Catégorie</SortableHeader>
                <SortableHeader columnKey="price">Prix</SortableHeader>
                <SortableHeader columnKey="stock">Stock</SortableHeader>
                <SortableHeader columnKey="status">Statut</SortableHeader>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts?.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md bg-gray-100"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-gray-400" />
                      {product.profiles?.business_name || 'Inconnu'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-gray-400" />
                      {product.categories?.name || 'Sans catégorie'}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingProduct(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setProductToDelete(product)}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-600">
            {totalCount > 0
              ? `Affiche ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, totalCount)} sur ${totalCount} produits`
              : 'Aucun produit trouvé.'}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1 || isFetching}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages || isFetching}
            >
              Suivant
            </Button>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>
      </Card>

      {sortedProducts?.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4" />
          <p>Aucun produit ne correspond à votre recherche.</p>
        </div>
      )}

      {/* View Product Details Dialog */}
      <Dialog open={!!viewingProduct} onOpenChange={(isOpen) => !isOpen && setViewingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingProduct?.name}</DialogTitle>
            <DialogDescription>Détails complets du produit</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="grid gap-2 text-sm py-4">
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">ID Produit</p>
                <p className="font-mono text-xs">{viewingProduct.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">Vendeur</p>
                <p>{viewingProduct.profiles?.business_name || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">Catégorie</p>
                <p>{viewingProduct.categories?.name || 'Sans catégorie'}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">Prix</p>
                <p className="font-semibold">{formatCurrency(viewingProduct.price)}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">Stock</p>
                <p>{viewingProduct.stock} unités</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <p className="text-gray-500">Statut</p>
                <div>{getStatusBadge(viewingProduct.status)}</div>
              </div>
              <div className="grid grid-cols-1 gap-x-4 mt-2">
                <p className="text-gray-500">Description</p>
                <p className="mt-1">{viewingProduct.description || 'Aucune description'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Product Sheet */}
      <Sheet
        open={isCreating || !!editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setEditingProduct(null);
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto p-0" side="right">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>{isCreating ? 'Nouveau Produit' : 'Modifier le produit'}</SheetTitle>
              <SheetDescription>
                {isCreating
                  ? 'Remplissez les informations pour créer un nouveau produit.'
                  : 'Modifiez les informations du produit existant.'}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ProductFormUltimate
                initialData={editingProduct ? (editingProduct as unknown as Product) : undefined}
                onSubmit={isCreating ? handleCreateProduct : handleUpdateProduct}
                isLoading={
                  isCreating ? createProductMutation.isPending : updateProductMutation.isPending
                }
                onClose={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir continuer ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera
              définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteProductMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {deleteProductMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
