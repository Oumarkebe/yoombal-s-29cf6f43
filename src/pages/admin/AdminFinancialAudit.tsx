import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertCircle,
    CheckCircle2,
    History,
    RefreshCw,
    Smartphone,
    Wallet,
    CreditCard,
    ArrowRightLeft,
    TrendingUp,
    TrendingDown,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminFinancialAudit() {
    const [isSyncing, setIsSyncing] = useState(false);

    const { data: auditData, isLoading, refetch } = useQuery({
        queryKey: ['financial-audit'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payment_reconciliation')
                .select(`
                    *,
                    orders (
                        id,
                        order_number,
                        status,
                        profiles (
                            first_name,
                            last_name
                        )
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    const runSync = async () => {
        setIsSyncing(true);
        try {
            // Simulated sync: in a real app, this would call an Edge Function
            // that fetches transactions from Wave/Orange Money APIs.
            await new Promise(r => setTimeout(r, 2000));
            toast.success("Synchronisation avec Wave & Orange Money terminée !");
            refetch();
        } catch (e) {
            toast.error("Échec de la synchronisation");
        } finally {
            setIsSyncing(false);
        }
    };

    const mismatchCount = auditData?.filter(a => a.status === 'mismatch').length || 0;
    const totalDiscrepancy = auditData?.reduce((acc, a) => acc + ((a.received_amount || 0) - a.order_amount), 0) || 0;

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit d'Intégrité Financière</h1>
                    <p className="text-muted-foreground">Vérification de la concordance entre les ordres Yoombal et les paiements réels.</p>
                </div>
                <Button onClick={runSync} disabled={isSyncing} className="gap-2">
                    {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Synchroniser les Flux
                </Button>
            </div>

            {/* KPI Section */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Réconciliation Totale</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{auditData?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-600">Écarts Détectés</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{mismatchCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Bilan Financier (Ecarts)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${totalDiscrepancy < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {totalDiscrepancy.toLocaleString()} FCFA
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600">Flux OM/Wave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {auditData?.filter(a => a.provider !== 'cash').length || 0} Tx
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5" />
                        Journal de Réconciliation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3 text-left">Commande</th>
                                    <th className="px-4 py-3 text-left">Canal</th>
                                    <th className="px-4 py-3 text-right">Montant Commande</th>
                                    <th className="px-4 py-3 text-right">Montant Reçu</th>
                                    <th className="px-4 py-3 text-center">Statut</th>
                                    <th className="px-4 py-3 text-left">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {auditData?.map((audit) => (
                                    <tr key={audit.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 font-medium">
                                            #{audit.orders?.order_number?.slice(0, 8) || 'CMD-INV'}
                                            <div className="text-[10px] text-slate-400">
                                                {audit.orders?.profiles ? `${audit.orders.profiles.first_name} ${audit.orders.profiles.last_name}` : 'Acheteur Inconnu'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 capitalize flex items-center gap-2">
                                            {audit.provider === 'wave' && <Smartphone className="w-3 h-3 text-blue-500" />}
                                            {audit.provider === 'orange_money' && <Smartphone className="w-3 h-3 text-orange-500" />}
                                            {audit.provider === 'cash' && <Wallet className="w-3 h-3 text-green-500" />}
                                            {audit.provider.replace('_', ' ')}
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold">
                                            {audit.order_amount.toLocaleString()} FCFA
                                        </td>
                                        <td className="px-4 py-4 text-right text-blue-600">
                                            {audit.received_amount?.toLocaleString() || '---'} FCFA
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <Badge variant={
                                                audit.status === 'matched' ? 'default' :
                                                    audit.status === 'mismatch' ? 'destructive' : 'outline'
                                            }>
                                                {audit.status === 'matched' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                {audit.status === 'mismatch' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                {audit.status === 'matched' ? 'OK' :
                                                    audit.status === 'mismatch' ? 'ÉCART' : 'EN ATTENTE'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-slate-500 text-xs">
                                            {audit.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {(!auditData || auditData.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                                            Aucune donnée d'audit disponible. Cliquez sur "Synchroniser" pour commencer.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
