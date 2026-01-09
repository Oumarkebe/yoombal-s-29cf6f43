
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Package, User, MapPin } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

interface OrderDetailsDialogProps {
    orderId: string;
    onClose: () => void;
}

const fetchOrderDetails = async (orderId: string) => {
    // Fetch order with items and delivery address
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                product:products (name, image_url)
            ),
            client:profiles!client_id (first_name, last_name, email, phone_number),
            merchant:profiles!merchant_id (business_name, email, phone_number)
        `)
        .eq('id', orderId)
        .single();

    if (error) throw error;
    return data;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount);
};

export function OrderDetailsDialog({ orderId, onClose }: OrderDetailsDialogProps) {
    const queryClient = useQueryClient();
    const { data: order, isLoading } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: () => fetchOrderDetails(orderId),
    });

    const [status, setStatus] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    // Initialize status when order loads
    React.useEffect(() => {
        if (order) {
            setStatus(order.status);
        }
    }, [order]);

    const handleUpdateStatus = async () => {
        if (!status || status === order?.status) return;
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: status })
                .eq('id', orderId);

            if (error) throw error;

            // Log action
            await supabase.from('admin_logs').insert({
                actor_id: (await supabase.auth.getUser()).data.user?.id,
                action: 'UPDATE_ORDER_STATUS',
                target_id: orderId,
                details: { old_status: order?.status, new_status: status }
            });

            toast.success("Statut de la commande mis à jour");
            queryClient.invalidateQueries({ queryKey: ['allOrders'] });
            queryClient.invalidateQueries({ queryKey: ['orderDetails', orderId] });
        } catch (err: any) {
            toast.error(`Erreur: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent>
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!order) return null;

    const deliveryAddress = typeof order.delivery_address === 'string'
        ? JSON.parse(order.delivery_address)
        : order.delivery_address;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Commande #{order.id.slice(0, 8)}</span>
                        <Badge variant="outline" className="text-base">{order.status}</Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')} à {new Date(order.created_at).toLocaleTimeString('fr-FR')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Colonne Gauche : Détails & Items */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Articles
                            </h3>
                            <div className="space-y-3">
                                {order.order_items.map((item: any) => (
                                    <div key={item.id} className="flex gap-3 items-center border p-2 rounded-lg bg-gray-50">
                                        <img
                                            src={item.product?.image_url || '/placeholder.svg'}
                                            className="w-12 h-12 object-cover rounded bg-white"
                                            alt={item.product?.name}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{item.product?.name}</div>
                                            <div className="text-xs text-gray-500">qté: {item.quantity} x {formatCurrency(item.unit_price)}</div>
                                        </div>
                                        <div className="font-semibold text-sm">
                                            {formatCurrency(item.quantity * item.unit_price)}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center border-t pt-2 mt-2 font-bold">
                                    <span>Total</span>
                                    <span className="text-amber-600 text-lg">{formatCurrency(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne Droite : Acteurs & Actions */}
                    <div className="space-y-6">
                        {/* Client Info */}
                        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-blue-800">
                                <User className="w-4 h-4" /> Client
                            </h3>
                            <p className="font-medium">{order.client?.first_name} {order.client?.last_name}</p>
                            <p className="text-sm text-gray-600">{order.client?.email}</p>
                            <p className="text-sm text-gray-600">{order.client?.phone_number}</p>
                        </div>

                        {/* Merchant Info */}
                        <div className="bg-amber-50 p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold flex items-center gap-2 text-amber-800">
                                <User className="w-4 h-4" /> Vendeur
                            </h3>
                            <p className="font-medium">{order.merchant?.business_name}</p>
                            <p className="text-sm text-gray-600">{order.merchant?.email}</p>
                        </div>

                        {/* Address */}
                        <div className="border p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Livraison
                            </h3>
                            {deliveryAddress ? (
                                <div className="text-sm text-gray-600">
                                    <p>{deliveryAddress.address}</p>
                                    <p>{deliveryAddress.city}</p>
                                    <p>{deliveryAddress.neighborhood}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Aucune adresse spécifiée</p>
                            )}
                        </div>

                        {/* Actions Supervision */}
                        <div className="border-t pt-4">
                            <Label className="mb-2 block font-semibold">Mise à jour du statut (Supervision)</Label>
                            <div className="flex gap-2">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Changer le statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="processing">En traitement</SelectItem>
                                        <SelectItem value="shipped">Expédiée</SelectItem>
                                        <SelectItem value="delivered">Livrée</SelectItem>
                                        <SelectItem value="cancelled">Annulée</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={status === order.status || isUpdating}
                                    className={status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                ⚠️ Modifier le statut enverra une notification au client. Utilisez avec précaution.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
