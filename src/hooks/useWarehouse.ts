
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { Warehouse as WarehouseType, WarehouseInventory } from '@/types/database-extended';

export type Warehouse = WarehouseType;
export type InventoryItem = WarehouseInventory & {
    product?: {
        name: string;
        image_url?: string;
        sku?: string;
    };
};

export const useWarehouse = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchWarehouses = async () => {
        try {
            const { data, error } = await (supabase as any)
                .from('warehouses')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;
            setWarehouses(data || []);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            toast({ title: "Erreur", description: "Impossible de charger les entrepôts", variant: "destructive" });
        }
    };

    const fetchInventory = async (warehouseId: string) => {
        try {
            setLoading(true);
            const { data, error } = await (supabase as any)
                .from('warehouse_inventory')
                .select(`
                *,
                product:products(name, image_url)
            `)
                .eq('warehouse_id', warehouseId);

            if (error) throw error;

            // Transform to match interface
            const formattedData = (data || []).map((item) => ({
                ...item,
                product: item.product
            }));

            setInventory(formattedData);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            toast({ title: "Erreur", description: "Impossible de charger l'inventaire", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const addMovement = async (
        type: 'IN' | 'OUT' | 'TRANSFER',
        quantity: number,
        productId: string,
        warehouseId: string,
        targetWarehouseId?: string,
        notes?: string,
        performedBy?: string
    ) => {
        try {
            // Log movement - Trigger will handle everything else (warehouse inventory & product stock update)
            const { error: moveError } = await (supabase as any).from('warehouse_movements').insert([
                {
                    type,
                    quantity,
                    item_id: productId,
                    from_warehouse_id: type === 'OUT' || type === 'TRANSFER' ? warehouseId : null,
                    to_warehouse_id:
                        type === 'IN' || type === 'TRANSFER' ? targetWarehouseId || warehouseId : null,
                    performed_by: performedBy,
                    notes,
                },
            ]);
            if (moveError) throw moveError;

            toast({ title: 'Succès', description: 'Mouvement enregistré et stock mis à jour' });
            fetchInventory(warehouseId);
        } catch (error: any) {
            console.error('Movement error:', error);
            toast({
                title: 'Erreur',
                description: error.message || 'Erreur lors du mouvement',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    return { warehouses, inventory, loading, fetchInventory, addMovement };
};
