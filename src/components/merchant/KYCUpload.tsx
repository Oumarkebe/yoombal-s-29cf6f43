import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KYCUploadProps {
    onSuccess?: () => void;
    currentStatus?: string | null;
    rejectionReason?: string | null;
}

export function KYCUpload({ onSuccess, currentStatus, rejectionReason }: KYCUploadProps) {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState<string>('cni');
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        try {
            // 1. Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const filePath = `kyc-documents/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('kyc-documents')
                .upload(filePath, file, {
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('kyc-documents')
                .getPublicUrl(filePath);

            // 2. Update profile
            const { error: updateError } = await (supabase as any)
                .from('profiles')
                .update({
                    kyc_document_url: publicUrl,
                    kyc_type: docType,
                    kyc_status: 'pending',
                    kyc_rejection_reason: null
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            toast.success("Document envoyé pour vérification !");
            setFile(null);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error("Erreur lors de l'envoi : " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (currentStatus === 'verified') {
        return (
            <Card className="border-green-100 bg-green-50/30">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                    <div>
                        <h3 className="text-lg font-bold text-green-900">Identité Vérifiée</h3>
                        <p className="text-sm text-green-700">Votre profil est validé. Vous pouvez utiliser toutes les fonctionnalités de paiement.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={currentStatus === 'rejected' ? 'border-red-200' : ''}>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Vérification d'Identité
                </CardTitle>
                {currentStatus === 'pending' && (
                    <Badge variant="outline" className="w-fit bg-amber-50 text-amber-700 border-amber-200">
                        Vérification en cours...
                    </Badge>
                )}
                {currentStatus === 'rejected' && (
                    <div className="bg-red-50 border border-red-100 p-3 rounded-md mt-2">
                        <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-1">
                            <AlertCircle className="h-4 w-4" />
                            Document Refusé
                        </div>
                        <p className="text-xs text-red-600">{rejectionReason || "Le document ne correspond pas aux critères."}</p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Type de document</Label>
                    <Select value={docType} onValueChange={setDocType} disabled={currentStatus === 'pending'}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choisir un type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cni">Carte d'Identité Nationale (Sénégal)</SelectItem>
                            <SelectItem value="passport">Passeport</SelectItem>
                            <SelectItem value="card_pro">Carte Professionnelle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="kyc-file">Photo du document (Recto/Verso ou Page Photo)</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="kyc-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            disabled={currentStatus === 'pending'}
                            className="cursor-pointer"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">Format JPG, PNG. Taille max 5Mo.</p>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading || currentStatus === 'pending'}
                    className="w-full gap-2 bg-blue-600"
                >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {currentStatus === 'pending' ? 'En attente d\'examen' : 'Envoyer pour vérification'}
                </Button>
            </CardContent>
        </Card>
    );
}
