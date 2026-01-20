import React from 'react';
import { Link } from 'react-router-dom';
import { useBNPLPlans, BNPLPlan } from '@/hooks/useBNPLPlans';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  AlertTriangle,
  Clock,
  Wallet,
  CalendarClock,
  FileText,
  Package,
  CheckCircle,
  BadgeCheck,
  XCircle,
  CircleSlash2,
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType; borderColor: string }
> = {
  active: {
    label: 'Actif',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle,
    borderColor: 'border-green-500',
  },
  paid: {
    label: 'Payé',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: BadgeCheck,
    borderColor: 'border-emerald-500',
  },
  overdue: {
    label: 'Retard',
    color: 'text-red-700 bg-red-50 border-red-200',
    icon: XCircle,
    borderColor: 'border-red-500',
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    icon: CircleSlash2,
    borderColor: 'border-gray-500',
  },
};

const getStatus = (status: string) => {
  return (
    statusConfig[status] || {
      label: status,
      color: 'text-gray-700 bg-gray-50 border-gray-200',
      icon: CircleSlash2,
      borderColor: 'border-gray-500',
    }
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
  }).format(value);
};

function getBNPLAlerts(plans: BNPLPlan[]) {
  const today = new Date();
  const alerts = [];

  // Paiements en retard
  const overdue = plans.filter((plan) => plan.status === 'overdue');
  if (overdue.length > 0) {
    alerts.push({
      type: 'destructive',
      title: '⚠️ Paiement BNPL en retard',
      desc: `Vous avez ${overdue.length} paiement(s) échelonné(s) en retard. Veuillez régulariser vos échéances au plus vite !`,
    });
  }

  // Paiements à venir sous peu (5 jours)
  const soon = plans.filter((plan) => {
    if (plan.status === 'active' && plan.next_payment_date) {
      const nextDate = new Date(plan.next_payment_date);
      const diff = (nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 5;
    }
    return false;
  });
  if (soon.length > 0) {
    alerts.push({
      type: 'default',
      title: '🕑 Échéance BNPL à venir',
      desc: `Vous avez ${soon.length} paiement(s) échelonné(s) à venir dans moins de 5 jours. Pensez à préparer votre règlement !`,
    });
  }

  return alerts;
}

export default function BNPLDashboard() {
  const { plans, isLoading, error, processPayment } = useBNPLPlans();
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = async (planId: string, amount: number) => {
    if (!confirm(`Confirmer le paiement de ${formatCurrency(amount)} ?`)) return;

    try {
      setIsProcessing(planId);
      await processPayment(planId, amount);
      toast({
        title: 'Succès',
        description: 'Votre paiement a été traité avec succès.',
      });
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Échec du paiement.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const summary = React.useMemo(() => {
    return plans.reduce(
      (acc, plan) => {
        if (plan.status === 'active' || plan.status === 'overdue') {
          acc.totalOutstanding += plan.monthly_payment * plan.remaining_months;
          acc.activePlansCount++;
          if (plan.next_payment_date) {
            const nextDate = new Date(plan.next_payment_date);
            if (!acc.nextPayment.date || nextDate < acc.nextPayment.date) {
              acc.nextPayment.date = nextDate;
              acc.nextPayment.amount = plan.monthly_payment;
            }
          }
        }
        return acc;
      },
      {
        totalOutstanding: 0,
        activePlansCount: 0,
        nextPayment: { date: null as Date | null, amount: 0 },
      }
    );
  }, [plans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin mr-2 h-8 w-8 text-blue-600" />
        <span className="text-lg text-gray-700 dark:text-gray-300">
          Chargement de vos paiements échelonnés...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const bnplAlerts = getBNPLAlerts(plans);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Mes Paiements Échelonnés
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Suivez et gérez vos plans de paiement en toute simplicité.
          </p>
        </header>

        {bnplAlerts.length > 0 && (
          <div className="space-y-4 mb-8">
            {bnplAlerts.map((alert, idx) => {
              const Icon = alert.type === 'destructive' ? AlertTriangle : Clock;
              return (
                <Alert key={idx} variant={alert.type as any}>
                  <Icon className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <AlertDescription>{alert.desc}</AlertDescription>
                </Alert>
              );
            })}
          </div>
        )}

        {plans.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Résumé</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Solde Restant Dû</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.totalOutstanding)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total sur tous les plans actifs</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Prochaine Échéance</CardTitle>
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {summary.nextPayment.date ? formatCurrency(summary.nextPayment.amount) : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {summary.nextPayment.date
                      ? `Le ${summary.nextPayment.date.toLocaleDateString('fr-FR')}`
                      : 'Aucune échéance à venir'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plans Actifs</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.activePlansCount}</div>
                  <p className="text-xs text-muted-foreground">Plans en cours de remboursement</p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {plans.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
            <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun plan de paiement trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Les produits éligibles au paiement en plusieurs fois sont indiqués sur le marketplace.
            </p>
            <Button asChild>
              <Link to="/marketplace">Explorer le Marketplace</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => {
              const statusInfo = getStatus(plan.status);
              const totalMonths = Math.round(plan.total_amount / plan.monthly_payment);
              const paidMonths = totalMonths - plan.remaining_months;
              const progress = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0;

              return (
                <Card
                  key={plan.id}
                  className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${statusInfo.borderColor}`}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">Plan #{plan.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          Pour la commande #{plan.order_id.slice(0, 8)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className={`py-1 px-3 text-sm ${statusInfo.color}`}>
                        <statusInfo.icon className="w-4 h-4 mr-2" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4 md:col-span-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Montant total</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {formatCurrency(plan.total_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Mensualité</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {formatCurrency(plan.monthly_payment)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Prochaine échéance</p>
                          <p
                            className={`font-semibold ${plan.status === 'overdue' ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}
                          >
                            {plan.next_payment_date
                              ? new Date(plan.next_payment_date).toLocaleDateString('fr-FR')
                              : '—'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progression</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {plan.remaining_months} échéances restantes
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end justify-center md:border-l md:pl-6 border-gray-200 dark:border-gray-700">
                      {plan.status === 'overdue' && (
                        <div className="w-full">
                          <p className="text-red-600 font-bold mb-2 text-sm">
                            ⚠️ Paiement en retard !
                          </p>
                          <Button
                            className="w-full bg-red-600 hover:bg-red-700"
                            onClick={() => handlePayment(plan.id, plan.monthly_payment)}
                            disabled={isProcessing === plan.id}
                          >
                            {isProcessing === plan.id ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              'Régulariser maintenant'
                            )}
                          </Button>
                        </div>
                      )}
                      {plan.status === 'active' && (
                        <Button
                          className="w-full md:w-auto"
                          onClick={() => handlePayment(plan.id, plan.monthly_payment)}
                          disabled={isProcessing === plan.id}
                        >
                          {isProcessing === plan.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            'Effectuer un paiement'
                          )}
                        </Button>
                      )}
                      {plan.status === 'paid' && (
                        <p className="text-sm text-emerald-600 font-medium">
                          Plan entièrement remboursé.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
