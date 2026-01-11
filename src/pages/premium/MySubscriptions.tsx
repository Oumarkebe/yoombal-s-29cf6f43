
import React from 'react';
import { useUserPremiumSubscriptions } from '@/hooks/useUserPremiumSubscriptions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, AlertCircle, Zap, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MySubscriptions() {
    const { subscriptions, isLoading } = useUserPremiumSubscriptions();
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="container p-8 text-center text-muted-foreground">Chargement de vos abonnements...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mes Abonnements</h1>
                <p className="text-muted-foreground">Gérez vos modules premium et vos accès.</p>
            </div>

            {subscriptions.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Zap className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-bold">Aucun abonnement actif</h3>
                            <p className="text-sm text-muted-foreground">
                                Découvrez nos modules premium pour booster votre productivité.
                            </p>
                        </div>
                        <Button onClick={() => navigate('/premium/subscriptions')}>
                            Parcourir le catalogue
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subscriptions.map(sub => (
                        <Card key={sub.id} className="relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${sub.status === 'active' ? 'bg-green-500' :
                                    sub.status === 'trial' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />

                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{sub.feature?.name}</CardTitle>
                                    <Badge variant={
                                        sub.status === 'active' ? 'default' :
                                            sub.status === 'trial' ? 'secondary' : 'destructive'
                                    }>
                                        {sub.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-1">
                                    {sub.feature?.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>Activé le {format(new Date(sub.activated_at || sub.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                                    </div>
                                    {sub.expires_at && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Expire le {format(new Date(sub.expires_at), 'dd MMMM yyyy', { locale: fr })}</span>
                                        </div>
                                    )}
                                </div>

                                {sub.status === 'trial' && (
                                    <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 font-medium flex items-center gap-2">
                                        <Sparkles className="h-3 w-3" />
                                        Période d'essai gratuite
                                    </div>
                                )}

                                {sub.status === 'expired' && (
                                    <div className="bg-red-50 p-2 rounded text-xs text-red-700 font-medium flex items-center gap-2">
                                        <AlertCircle className="h-3 w-3" />
                                        Veuillez renouveler votre accès
                                    </div>
                                )}
                            </CardContent>

                            <CardContent className="pt-0 border-t mt-4 flex justify-end gap-2 p-4">
                                <Button variant="outline" size="sm">Gérer</Button>
                                {(sub.status === 'trial' || sub.status === 'expired') && (
                                    <Button size="sm" onClick={() => navigate('/premium/subscriptions')}>S'abonner</Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
