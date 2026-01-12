
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Loader2, CheckCircle, XCircle, FileText, Image as ImageIcon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface KYCProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    kyc_status: 'none' | 'pending' | 'verified' | 'rejected' | null;
    kyc_contract_signed_at: string | null;
    kyc_id_card_url: string | null;
    kyc_selfie_url: string | null;
    credit_limit: number | null;
}

const fetchKYCRequests = async (): Promise<KYCProfile[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('kyc_status', ['pending', 'verified', 'rejected'])
        .order('kyc_contract_signed_at', { ascending: false });

    if (error) throw error;
    return (data as unknown as any[]).map(item => ({
        ...item,
        kyc_status: item.kyc_status as KYCProfile['kyc_status']
    })) as KYCProfile[];
};

export default function AdminKYCRequests() {
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: profiles, isLoading } = useQuery({
        queryKey: ['kyc-requests'],
        queryFn: fetchKYCRequests,
    });

    const approveMutation = useMutation({
        mutationFn: async ({ id, limit }: { id: string, limit: number }) => {
            const { error } = await supabase
                .from('profiles')
                .update({
                    kyc_status: 'verified',
                    credit_limit: limit
                } as any)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyc-requests'] });
            toast.success('Dossier KYC approuvé !');
        },
        onError: (err) => {
            toast.error("Erreur lors de l'approbation");
            console.error(err);
        }
    });

    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('profiles')
                .update({ kyc_status: 'rejected' } as any)
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyc-requests'] });
            toast.error('Dossier KYC rejeté.');
        }
    });

    const getSignedUrl = async (path: string | null) => {
        if (!path) return null;
        const { data } = await supabase.storage.from('kyc-documents').createSignedUrl(path, 3600);
        return data?.signedUrl;
    };

    const handleViewImage = async (path: string | null) => {
        if (!path) return;
        const url = await getSignedUrl(path);
        if (url) setSelectedImage(url);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-blue-600" />
                            Gestion des KYC (BNPL)
                        </h1>
                        <p className="text-slate-500">Validez les identités pour autoriser le paiement en plusieurs fois.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Demandes en attente et historique</CardTitle>
                        <CardDescription>Liste des utilisateurs ayant soumis leurs documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Date Soumission</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Documents</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profiles?.map((profile: KYCProfile) => (
                                        <TableRow key={profile.id}>
                                            <TableCell>
                                                <div className="font-medium">{profile.first_name} {profile.last_name}</div>
                                                <div className="text-sm text-slate-500">{profile.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                {profile.kyc_contract_signed_at ? new Date(profile.kyc_contract_signed_at).toLocaleDateString() : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    profile.kyc_status === 'verified' ? 'default' :
                                                        profile.kyc_status === 'rejected' ? 'destructive' : 'secondary'
                                                }>
                                                    {profile.kyc_status?.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewImage(profile.kyc_id_card_url)}>
                                                        <FileText className="h-4 w-4 mr-1" /> CNI
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleViewImage(profile.kyc_selfie_url)}>
                                                        <ImageIcon className="h-4 w-4 mr-1" /> Selfie
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {profile.kyc_status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                                    <CheckCircle className="h-4 w-4 mr-1" /> Valider
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Approuver le dossier</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="py-4">
                                                                    <Label>Plafond de crédit autorisé (FCFA)</Label>
                                                                    <Input type="number" defaultValue={50000} id="limit-input" />
                                                                </div>
                                                                <Button onClick={() => {
                                                                    const limit = Number((document.getElementById('limit-input') as HTMLInputElement).value);
                                                                    approveMutation.mutate({ id: profile.id, limit });
                                                                }}>Confirmer l'approbation</Button>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(profile.id)}>
                                                            <XCircle className="h-4 w-4 mr-1" /> Rejeter
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {profiles?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                                Aucune demande KYC trouvée.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-3xl">
                    {selectedImage && <img src={selectedImage} alt="Document Proof" className="w-full h-auto rounded" />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
