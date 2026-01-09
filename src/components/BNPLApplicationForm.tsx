import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useBNPLApplications } from '@/hooks/useBNPLApplications';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard, Calendar, Calculator, UserPlus, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BNPLApplicationFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    merchant_id: string;
  };
  onSuccess?: () => void;
}

const BNPLApplicationForm: React.FC<BNPLApplicationFormProps> = ({
  product,
  onSuccess
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantIdNumber, setApplicantIdNumber] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createApplication } = useBNPLApplications();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Si l'utilisateur n'est pas authentifié, afficher un message d'invitation à s'inscrire
  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement échelonné BNPL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <UserPlus className="h-16 w-16 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Créez un compte pour accéder au BNPL
          </h3>
          <p className="text-gray-600 mb-6">
            Le paiement échelonné est réservé aux membres inscrits.
            Créez votre compte gratuitement pour profiter de cette fonctionnalité !
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link to="/register">
                Créer un compte gratuitement
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">
                J'ai déjà un compte
              </Link>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Vous pouvez continuer vos achats sans compte,
            mais le BNPL nécessite une inscription.
          </p>
        </CardContent>
      </Card>
    );
  }

  const calculatePayment = (duration: number) => {
    const principal = product.price;
    const feeRate = 0.05; // 5% de frais
    const totalFees = principal * feeRate;
    const totalAmount = principal + totalFees;
    const monthlyPayment = totalAmount / duration;
    const firstPayment = monthlyPayment * 0.2; // 20% d'acompte

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalFees: Math.round(totalFees),
      firstPayment: Math.round(firstPayment),
      totalAmount: Math.round(totalAmount)
    };
  };

  const durations = [
    { value: '3', label: '3 mois' },
    { value: '6', label: '6 mois' },
    { value: '12', label: '12 mois' }
  ];

  const selectedCalc = selectedDuration ? calculatePayment(parseInt(selectedDuration)) : null;

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('bnpl-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL depending on bucket settings
    // Since our bucket is private, we will just store the path
    // The dashboard will generate signed URLs for viewing
    return filePath;
  };

  const handleSubmit = async () => {
    if (!selectedDuration) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une durée de paiement",
        variant: "destructive"
      });
      return;
    }
    if (!applicantPhone || !applicantIdNumber) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs d'identité",
        variant: "destructive"
      });
      return;
    }
    if (!idCardFile || !photoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger votre CNI et une photo",
        variant: "destructive"
      });
      return;
    }
    if (!contractAccepted) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les termes du contrat",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload files
      let idCardPath = '';
      let photoPath = '';

      try {
        idCardPath = await uploadFile(idCardFile, `id_cards/${user?.id}`);
        photoPath = await uploadFile(photoFile, `photos/${user?.id}`);
      } catch (uploadError: any) {
        console.error("Upload error:", uploadError);
        throw new Error("Erreur lors de l'envoi des fichiers (Vérifiez votre connexion)");
      }

      // 2. Create application
      const calc = calculatePayment(parseInt(selectedDuration));

      const result = await createApplication({
        product_id: product.id,
        merchant_id: product.merchant_id,
        requested_amount: product.price,
        plan_duration: parseInt(selectedDuration),
        monthly_payment: calc.monthlyPayment,
        fees_amount: calc.totalFees,
        first_payment_amount: calc.firstPayment,
        applicant_phone: applicantPhone,
        applicant_id_number: applicantIdNumber,
        id_card_url: idCardPath,
        photo_url: photoPath,
        contract_signed_at: new Date().toISOString()
      });

      if (result.success) {
        toast({
          title: "Demande envoyée !",
          description: "Votre dossier complet a été transmis au marchand pour analyse.",
        });
        onSuccess?.();
      } else {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Demande de paiement BNPL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900">{product.name}</h4>
          <p className="text-2xl font-bold text-blue-700">
            {product.price.toLocaleString()} CFA
          </p>
        </div>

        {/* Plan Selection */}
        <div className="space-y-2">
          <Label>Durée du plan</Label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir la durée" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculation Preview */}
        {selectedCalc && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Apport initial (20%) :</span>
              <span className="font-bold text-green-600">{selectedCalc.firstPayment.toLocaleString()} CFA</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de dossier :</span>
              <span>{selectedCalc.totalFees.toLocaleString()} CFA</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Mensualité :</span>
              <span className="font-bold">{selectedCalc.monthlyPayment.toLocaleString()} CFA /mois</span>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Information d'identité
          </h4>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                placeholder="+221 77 000 00 00"
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cni">Numéro CNI / Passeport</Label>
              <Input
                id="cni"
                placeholder="1 757 1990 00000"
                value={applicantIdNumber}
                onChange={(e) => setApplicantIdNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo d'identité</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <Upload className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Copie CNI (Recto/Verso)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Contract Section */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4" /> Contrat BNPL
          </h4>
          <div className="h-24 overflow-y-auto text-xs text-amber-900 bg-white p-2 rounded mb-3 border border-amber-100">
            <p className="mb-2"><strong>ENGAGEMENT DE PAIEMENT</strong></p>
            <p>Je soussigné(e), m'engage irrévocablement à rembourser la totalité du montant dû selon l'échéancier établi.</p>
            <p className="mt-2"><strong>PÉNALITÉS</strong></p>
            <p>Tout retard de paiement de plus de 5 jours entrainera une pénalité de 5% du montant de l'échéance. En cas de non-paiement prolongé, le dossier sera transmis au contentieux.</p>
            <p className="mt-2"><strong>CONFIDENTIALITE</strong></p>
            <p>Vos données personnelles sont traitées conformément à la loi sur la protection des données.</p>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={contractAccepted}
              onCheckedChange={(checked) => setContractAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Je reconnais avoir lu et approuvé les termes du contrat BNPL et je certifie l'exactitude des informations fournies.
            </Label>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi du dossier...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Soumettre ma demande
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BNPLApplicationForm;
