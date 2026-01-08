import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, User, Building, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

type OrderWithDetails = Tables<'orders'> & {
  client: { first_name: string | null; last_name: string | null; } | null;
  merchant: { business_name: string | null; } | null;
};

const PAGE_SIZE = 10;

const fetchAllOrders = async (page: number, pageSize: number, searchTerm: string) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('orders')
    .select(`
      *,
      client:profiles!client_id(first_name, last_name),
      merchant:profiles!merchant_id(business_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (searchTerm) {
    // Temporarily simplified search to prevent query errors.
    // We are now only searching by order ID.
    query = query.ilike('id', `%${searchTerm}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    throw new Error(error.message);
  }
  return { orders: data, count: count ?? 0 };
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
};

const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'processing': return <Badge className="bg-blue-100 text-blue-800">En traitement</Badge>;
      case 'shipped': return <Badge className="bg-purple-100 text-purple-800">Expédiée</Badge>;
      case 'delivered': return <Badge className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'cancelled': return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default: return <Badge>{status}</Badge>;
    }
};

export function AdminOrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['allOrders', currentPage, PAGE_SIZE, debouncedSearchTerm],
    queryFn: () => fetchAllOrders(currentPage, PAGE_SIZE, debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const orders = data?.orders as unknown as OrderWithDetails[] | undefined;
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  
  if (isLoading && !data) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">Erreur lors du chargement des commandes. {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par ID de commande..."
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
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Vendeur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.map(order => (
                <TableRow key={order.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{order.client?.first_name} {order.client?.last_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-gray-400" />
                      {order.merchant?.business_name || 'Inconnu'}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Détails</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-600">
            {totalCount > 0
              ? `Affiche ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, totalCount)} sur ${totalCount} commandes`
              : 'Aucune commande trouvée.'
            }
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1 || isFetching}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages || isFetching}
            >
              Suivant
            </Button>
          </div>
        </div>
      </Card>

      {orders?.length === 0 && !isFetching && (
        <Card className="p-12 text-center">
          <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune commande trouvée
          </h3>
           <p className="text-gray-600">
            Aucune commande ne correspond à vos critères de recherche.
          </p>
        </Card>
      )}
    </div>
  );
}
