
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Check, X, CreditCard } from 'lucide-react';

interface KYCProfile {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    business_name: string;
    // Add other fields as needed
}

const fetchKYCRequests = async () => {
    // Since KYC fields don't exist in profiles table, return empty or mock data
    // Or select existing fields to show list of users
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
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm">
                        <strong>Utilisateurs enregistrés</strong>
                        <p className="mt-1">
                            Note: Les champs KYC (kyc_status, etc.) doivent être ajoutés à la table profiles via migration pour une gestion complète.
                        </p>
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="text-center py-8">Chargement...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">Utilisateur</th>
                                            <th className="px-4 py-3">Téléphone</th>
                                            <th className="px-4 py-3">Entreprise</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profiles?.map((profile) => (
                                            <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">
                                                    {profile.first_name} {profile.last_name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{profile.phone || '-'}</td>
                                                <td className="px-4 py-3 text-gray-500">{profile.business_name || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className="text-gray-400 italic">En attente migration</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {profiles?.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                    Aucun utilisateur trouvé.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
