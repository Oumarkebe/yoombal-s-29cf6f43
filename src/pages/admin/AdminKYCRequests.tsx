
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Loader2, CheckCircle, XCircle, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
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
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    business_name: string | null;
}

const fetchKYCRequests = async (): Promise<KYCProfile[]> => {
    // Since KYC fields don't exist in profiles table, return empty or mock data
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, business_name')
        .limit(10);

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
                        <CardTitle>Utilisateurs enregistrés</CardTitle>
                        <CardDescription>
                            Note: Les champs KYC (kyc_status, etc.) doivent être ajoutés à la table profiles via migration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Téléphone</TableHead>
                                        <TableHead>Entreprise</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profiles?.map((profile) => (
                                        <TableRow key={profile.id}>
                                            <TableCell>
                                                <div className="font-medium">{profile.first_name} {profile.last_name}</div>
                                            </TableCell>
                                            <TableCell>{profile.phone || '-'}</TableCell>
                                            <TableCell>{profile.business_name || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="secondary">En attente migration</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {profiles?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                                Aucun utilisateur trouvé.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
