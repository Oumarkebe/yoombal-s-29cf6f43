
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Check, X, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface KYCProfile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    business_name: string | null;
    kyc_status: string | null; // Match database type
    kyc_document_url: string | null;
    kyc_type: string | null;
    kyc_verified_at: string | null;
    kyc_rejection_reason: string | null;
}

const fetchKYCRequests = async () => {
    // Since KYC fields don't exist in profiles table, return empty or mock data
    // Or select existing fields to show list of users
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, business_name, kyc_status, kyc_document_url, kyc_type, kyc_verified_at, kyc_rejection_reason')
        .not('kyc_status', 'is', null)
        .neq('kyc_status', 'none')
        .order('kyc_status', { ascending: false });

    if (error) throw error;
    return (data || []) as KYCProfile[];
};

export default function AdminKYCRequests() {
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: profiles, isLoading } = useQuery({
        queryKey: ['kyc-requests'],
        queryFn: fetchKYCRequests,
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                        Gestion des KYC (BNPL)
                    </h1>
                    <p className="text-gray-500">Validez les identités pour autoriser le paiement en plusieurs fois.</p>
                </div>
            </div>

            <Card className="p-6">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Utilisateur</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Document</th>
                                        <th className="px-4 py-3">Statut</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles?.map((profile) => (
                                        <KYCRow key={profile.id} profile={profile} />
                                    ))}
                                    {profiles?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                                Aucune demande KYC en attente.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

function KYCRow({ profile }: { profile: KYCProfile }) {
    const queryClient = useQueryClient();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionInput, setShowRejectionInput] = useState(false);

    const handleVerify = async (status: 'verified' | 'rejected') => {
        const { error } = await supabase
            .from('profiles')
            .update({
                kyc_status: status,
                kyc_verified_at: status === 'verified' ? new Date().toISOString() : null,
                kyc_rejection_reason: status === 'rejected' ? rejectionReason : null
            })
            .eq('id', profile.id);

        if (error) {
            toast.error("Erreur lors de la mise à jour");
        } else {
            toast.success(status === 'verified' ? "Utilisateur vérifié !" : "Demande rejetée");
            queryClient.invalidateQueries({ queryKey: ['kyc-requests'] });
        }
    };

    const runAiAnalysis = async () => {
        if (!profile.kyc_document_url) {
            toast.error("Aucun document à analyser");
            return;
        }

        setIsAnalyzing(true);
        try {
            const { data, error } = await supabase.functions.invoke('document-analysis', {
                body: { imageUrl: profile.kyc_document_url, documentType: profile.kyc_type }
            });

            if (error) throw error;
            setAiResult(data);

            if (data.is_valid && data.confidence_score > 0.8) {
                toast.success("Analyse terminée : Document jugé CONFORME");
            } else if (!data.is_valid) {
                toast.warning(`Analyse : Document suspect - ${data.reason}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Échec de l'analyse IA");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{profile.first_name} {profile.last_name}</div>
                <div className="text-xs text-slate-500">{profile.phone || '-'}</div>
            </td>
            <td className="px-4 py-3 uppercase text-xs font-bold text-slate-600">
                {profile.kyc_type || 'Inconnu'}
            </td>
            <td className="px-4 py-3">
                {profile.kyc_document_url ? (
                    <a
                        href={profile.kyc_document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                    >
                        <CreditCard className="w-3 h-3" /> Voir le doc
                    </a>
                ) : (
                    <span className="text-slate-400 text-xs italic">Aucun document</span>
                )}
            </td>
            <td className="px-4 py-3">
                <Badge variant={
                    profile.kyc_status === 'verified' ? 'default' :
                        profile.kyc_status === 'rejected' ? 'destructive' : 'outline'
                }>
                    {profile.kyc_status === 'pending' ? 'En attente' :
                        profile.kyc_status === 'verified' ? 'Vérifié' : 'Rejeté'}
                </Badge>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                    {profile.kyc_status === 'pending' && !showRejectionInput && (
                        <>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={runAiAnalysis}
                                disabled={isAnalyzing}
                                className="h-8 gap-1"
                            >
                                {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                Analyse IA
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleVerify('verified')}
                                className="h-8 bg-green-600 hover:bg-green-700"
                            >
                                <Check className="w-3 h-3 mr-1" /> Valider
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setShowRejectionInput(true)}
                                className="h-8"
                            >
                                <X className="w-3 h-3 mr-1" /> Rejeter
                            </Button>
                        </>
                    )}
                    {showRejectionInput && (
                        <div className="flex flex-col gap-2 w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Motif du rejet..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="text-xs p-1 border rounded"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={() => setShowRejectionInput(false)}>Annuler</Button>
                                <Button size="sm" variant="destructive" className="h-6 text-[10px]" onClick={() => handleVerify('rejected')} disabled={!rejectionReason}>Confirmer Rejet</Button>
                            </div>
                        </div>
                    )}
                </div>
                {aiResult && (
                    <div className="mt-2 text-[10px] text-left p-2 bg-slate-50 rounded border border-dashed border-slate-200 animate-in fade-in slide-in-from-top-1">
                        <div className="font-bold flex justify-between">
                            <span>RESULTAT IA :</span>
                            <span className={aiResult.is_valid ? 'text-green-600' : 'text-red-600'}>
                                Confiance: {(aiResult.confidence_score * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div>Nom: {aiResult.first_name} {aiResult.last_name}</div>
                        <div>ID: {aiResult.id_number}</div>
                        {!aiResult.is_valid && <div className="text-red-500 font-bold">MOTIF: {aiResult.reason}</div>}
                    </div>
                )}
            </td>
        </tr>
    );
}
