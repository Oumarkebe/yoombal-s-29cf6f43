import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMerchantBNPLApplications } from '@/hooks/useMerchantBNPLApplications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import {
  Loader2,
  Check,
  X,
  User,
  Package,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Trash2,
} from 'lucide-react';

// Sub-component for individual application card to manage local expand state
const BNPLApplicationCard = ({
  application,
  onViewDocument,
  onApprove,
  onReject,
  onDelete,
}: {
  application: any;
  onViewDocument: (path: string, title: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      approved: { label: 'Approuvé', variant: 'default' as const },
      rejected: { label: 'Rejeté', variant: 'destructive' as const },
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  return (
    <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
      <CardHeader className="py-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between mr-4">
              <CardTitle className="text-lg">{application.products?.name}</CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(application.application_status)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {application.profiles?.first_name} {application.profiles?.last_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(application.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wide">Montant</span>
              <p className="font-semibold text-gray-900">
                {application.requested_amount.toLocaleString()} CFA
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wide">Durée</span>
              <p className="font-semibold text-gray-900">{application.plan_duration} mois</p>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wide">Mensualité</span>
              <p className="font-semibold text-gray-900">
                {application.monthly_payment.toLocaleString()} CFA
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wide">1er Paiement</span>
              <p className="font-semibold text-gray-900">
                {application.first_payment_amount.toLocaleString()} CFA
              </p>
            </div>
          </div>

          {/* Identity & Documents Section */}
          <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm">
            <h4 className="font-medium flex items-center gap-2 text-gray-900 border-b pb-2 mb-3">
              <User className="h-4 w-4" /> Information Identité & Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <span className="text-gray-500 block">Téléphone</span>
                <span className="font-medium">
                  {application.applicant_phone || 'Non renseigné'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">N° CNI / Passeport</span>
                <span className="font-medium">
                  {application.applicant_id_number || 'Non renseigné'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {application.id_card_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocument(application.id_card_url!, "Carte d'identité")}
                >
                  <FileText className="h-4 w-4 mr-2" /> Voir CNI
                </Button>
              )}
              {application.photo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocument(application.photo_url!, "Photo d'identité")}
                >
                  <User className="h-4 w-4 mr-2" /> Voir Photo
                </Button>
              )}
            </div>

            {application.contract_signed_at && (
              <div className="text-xs text-green-700 flex items-center gap-1 mt-3 font-medium bg-green-50 p-2 rounded w-fit border border-green-100">
                <Check className="h-3 w-3" />
                Contrat signé le {new Date(application.contract_signed_at).toLocaleString('fr-FR')}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t items-center">
            {application.application_status === 'pending' ? (
              <>
                <Button
                  onClick={() => onApprove(application.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={() => onReject(application.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
              </>
            ) : (
              <div className="flex-1 text-sm text-gray-500 italic">
                Décision : {application.merchant_decision} le{' '}
                {new Date(application.merchant_decision_date).toLocaleDateString()}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-600 ml-2"
              onClick={() => onDelete(application.id)}
              title="Supprimer la demande"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const MerchantBNPLManager: React.FC = () => {
  const { applications, isLoading, updateApplicationStatus, deleteApplication } =
    useMerchantBNPLApplications();
  const { toast } = useToast();

  const [documentToView, setDocumentToView] = useState<{ url: string; title: string } | null>(null);
  const [applicationToApprove, setApplicationToApprove] = useState<string | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  const handleDecision = async (applicationId: string, decision: 'approved' | 'rejected') => {
    if (decision === 'approved') {
      setApplicationToApprove(applicationId);
      return;
    }
    await processDecision(applicationId, 'rejected');
  };

  const processDecision = async (applicationId: string, decision: 'approved' | 'rejected') => {
    const result = await updateApplicationStatus(applicationId, decision);

    if (result.success) {
      toast({
        title: decision === 'approved' ? 'Dossier approuvé' : 'Demande rejetée',
        description: decision === 'approved' ? 'Le plan BNPL est activé.' : 'Demande rejetée.',
        className: decision === 'approved' ? 'bg-green-50 border-green-200' : '',
      });
    } else {
      toast({
        title: 'Erreur',
        description: result.error || 'Erreur de traitement',
        variant: 'destructive',
      });
    }
    setApplicationToApprove(null);
  };

  const handleViewDocument = async (path: string, title: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('bnpl-documents')
        .createSignedUrl(path, 3600);

      if (error) throw error;
      if (data?.signedUrl) setDocumentToView({ url: data.signedUrl, title });
    } catch (error) {
      console.error('Error signed URL:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'ouvrir le document",
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (applicationId: string) => {
    const result = await deleteApplication(applicationId);
    if (result.success) {
      toast({ title: 'Supprimé', description: 'La demande a été supprimée.' });
    } else {
      toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' });
    }
    setApplicationToDelete(null);
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Échec du téléchargement', variant: 'destructive' });
    }
  };

  const exportToExcel = () => {
    if (applications.length === 0) {
      toast({ title: 'Aucune donnée', description: "Il n'y a aucune demande à exporter." });
      return;
    }

    // 1. Prepare data for Excel
    const data = applications.map((app) => ({
      'ID Demande': app.id,
      'Date de création': new Date(app.created_at).toLocaleDateString('fr-FR'),
      Produit: app.products?.name || 'Inconnu',
      'Prix Produit (CFA)': app.products?.price || 0,
      'Montant Demandé (CFA)': app.requested_amount,
      'Durée (mois)': app.plan_duration,
      'Mensualité (CFA)': app.monthly_payment,
      'Prénom Client': app.profiles?.first_name || '',
      'Nom Client': app.profiles?.last_name || '',
      Téléphone: app.applicant_phone || '',
      'N° CNI': app.applicant_id_number || '',
      'Statut actuel':
        app.application_status === 'approved'
          ? 'Approuvé'
          : app.application_status === 'rejected'
            ? 'Rejeté'
            : 'En attente',
      'Décision Marchand':
        app.merchant_decision === 'approved'
          ? 'Accordé'
          : app.merchant_decision === 'rejected'
            ? 'Refusé'
            : '-',
      'Date Décision': app.merchant_decision_date
        ? new Date(app.merchant_decision_date).toLocaleDateString('fr-FR')
        : '-',
    }));

    // 2. Create Workbook and Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    // 3. Configure column widths (optional but better for "well formatted")
    const wscols = [
      { wch: 30 }, // ID
      { wch: 15 }, // Date
      { wch: 30 }, // Produit
      { wch: 15 }, // Prix
      { wch: 15 }, // Montant
      { wch: 10 }, // Durée
      { wch: 15 }, // Mensualité
      { wch: 20 }, // Prénom
      { wch: 20 }, // Nom
      { wch: 15 }, // Phone
      { wch: 20 }, // CNI
      { wch: 15 }, // Statut
      { wch: 15 }, // Décision
      { wch: 15 }, // Date Décision
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Demandes BNPL');

    // 4. Generate and download file
    XLSX.writeFile(workbook, `BNPL_Demandes_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Demandes BNPL</h2>
          <Badge>{applications.length}</Badge>
        </div>
        <Button
          onClick={exportToExcel}
          variant="outline"
          className="flex gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        >
          <Download className="h-4 w-4" />
          Exporter Excel (.xlsx)
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Aucune demande</h3>
            <p className="text-gray-500">Les demandes apparaîtront ici.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <BNPLApplicationCard
              key={application.id}
              application={application}
              onViewDocument={handleViewDocument}
              onApprove={() => handleDecision(application.id, 'approved')}
              onReject={() => handleDecision(application.id, 'rejected')}
              onDelete={() => setApplicationToDelete(application.id)}
            />
          ))}
        </div>
      )}

      {/* Document Viewer */}
      <Dialog open={!!documentToView} onOpenChange={(open) => !open && setDocumentToView(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{documentToView?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  documentToView &&
                  downloadDocument(documentToView.url, `${documentToView.title}.png`)
                }
              >
                <Download className="h-4 w-4 mr-2" /> Télécharger
              </Button>
            </DialogTitle>
            <DialogDescription>Aperçu du document : {documentToView?.title}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center bg-gray-100 rounded-lg p-4">
            {documentToView ? (
              <img
                src={documentToView.url}
                alt={documentToView.title}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-sm"
              />
            ) : (
              <Loader2 className="h-8 w-8 animate-spin" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={!!applicationToApprove}
        onOpenChange={(open) => !open && setApplicationToApprove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'approbation</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-sm text-gray-500">
                Êtes-vous sûr ?
                <div className="mt-2 space-y-1 pl-2">
                  <p>• Le plan sera activé.</p>
                  <p>• Le client sera notifié.</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                applicationToApprove && processDecision(applicationToApprove, 'approved')
              }
              className="bg-green-600 hover:bg-green-700"
            >
              Approuver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!applicationToDelete}
        onOpenChange={(open) => !open && setApplicationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à cette demande seront
              effacées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => applicationToDelete && handleDelete(applicationToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MerchantBNPLManager;
