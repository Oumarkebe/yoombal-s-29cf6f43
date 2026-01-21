import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Bell, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StockIndicatorProps {
    stock: number;
    productId: string;
    minStock?: number;
}

export function StockIndicator({ stock, productId, minStock = 5 }: StockIndicatorProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleNotifyMe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            // Get current user if available
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await (supabase as any)
                .from('stock_alerts')
                .insert({
                    product_id: productId,
                    email: email,
                    user_id: user?.id, // Optional
                });

            if (error) throw error;

            toast({
                title: "Alerte créée",
                description: "Vous serez notifié dès le retour en stock.",
            });
            setEmail('');
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: "Impossible de créer l'alerte. Veuillez réessayer.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (stock > minStock) {
        return (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">En stock ({stock} disponibles)</span>
            </div>
        );
    }

    if (stock > 0) {
        return (
            <div className="flex items-center gap-2 text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Stock faible : Plus que {stock} !</span>
            </div>
        );
    }

    // Out of stock
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Rupture de stock</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600 mb-3 font-medium">
                    M'alerter quand ce produit est disponible :
                </p>
                <form onSubmit={handleNotifyMe} className="flex gap-2">
                    <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white"
                    />
                    <Button type="submit" size="sm" disabled={loading}>
                        {loading ? '...' : <Bell className="w-4 h-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
