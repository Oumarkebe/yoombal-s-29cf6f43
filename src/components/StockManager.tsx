
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';

const StockManager: React.FC = () => {
  const { user } = useAuth();
  const { products, updateProduct } = useProducts();
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});

  const merchantProducts = products.filter(p => p.merchant_id === user?.id);

  const handleStockUpdate = (productId: string, newStock: number) => {
    setStockUpdates(prev => ({ ...prev, [productId]: newStock }));
  };

  const saveStockUpdate = async (productId: string) => {
    const newStock = stockUpdates[productId];
    if (newStock !== undefined) {
      // Correction: updateProduct attend (productId, updateData)
      await updateProduct(productId, {
        stock: newStock
      });
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'destructive' };
    if (stock < 10) return { label: 'Faible', color: 'default' };
    return { label: 'Disponible', color: 'secondary' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Gestion des Stocks</h2>
      </div>
      
      <div className="grid gap-4">
        {merchantProducts.map((product) => {
          const currentStock = stockUpdates[product.id] ?? product.stock;
          const stockStatus = getStockStatus(currentStock);
          
          return (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant={stockStatus.color as any}>
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock actuel:</span>
                    <span className="text-lg font-bold">{product.stock}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, Math.max(0, currentStock - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={currentStock}
                      onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product.id, currentStock + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {stockUpdates[product.id] !== undefined && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveStockUpdate(product.id)}
                        className="flex-1"
                      >
                        Sauvegarder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setStockUpdates(prev => {
                            const updated = { ...prev };
                            delete updated[product.id];
                            return updated;
                          });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  )}
                  
                  {currentStock < 10 && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        Stock faible - Pensez à vous réapprovisionner
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StockManager;
