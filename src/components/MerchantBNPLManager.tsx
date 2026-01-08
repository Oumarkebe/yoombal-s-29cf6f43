
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMerchantBNPLApplications } from '@/hooks/useMerchantBNPLApplications';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X, User, Package, Calendar, CreditCard } from 'lucide-react';

const MerchantBNPLManager: React.FC = () => {
  const { applications, isLoading, updateApplicationStatus } = useMerchantBNPLApplications();
  const { toast } = useToast();

  const handleDecision = async (applicationId: string, decision: 'approved' | 'rejected') => {
    const result = await updateApplicationStatus(applicationId, decision);
    
    if (result.success) {
      toast({
        title: decision === 'approved' ? "Demande approuvée" : "Demande rejetée",
        description: decision === 'approved' 
          ? "Le plan BNPL a été activé pour le client" 
          : "La demande a été rejetée",
      });
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors du traitement",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "En attente", variant: "secondary" as const },
      approved: { label: "Approuvé", variant: "default" as const },
      rejected: { label: "Rejeté", variant: "destructive" as const }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Chargement des demandes BNPL...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Demandes BNPL</h2>
        <Badge>{applications.length}</Badge>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Aucune demande BNPL</h3>
            <p className="text-gray-500">
              Les demandes de paiement échelonné pour vos produits apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {application.products?.name}
                    </CardTitle>
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
                  {getStatusBadge(application.application_status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Montant demandé</span>
                    <p className="font-medium">{application.requested_amount.toLocaleString()} CFA</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Durée</span>
                    <p className="font-medium">{application.plan_duration} mois</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Paiement mensuel</span>
                    <p className="font-medium">{application.monthly_payment.toLocaleString()} CFA</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Premier paiement</span>
                    <p className="font-medium">{application.first_payment_amount.toLocaleString()} CFA</p>
                  </div>
                </div>

                {application.application_status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleDecision(application.id, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      onClick={() => handleDecision(application.id, 'rejected')}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                )}

                {application.merchant_decision && (
                  <div className="pt-4 border-t text-sm text-gray-600">
                    <span>Décision prise le {new Date(application.merchant_decision_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantBNPLManager;
