
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Phone, Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    description: string;
    type: 'credit_topup' | 'subscription_purchase';
    metadata?: any;
    onSuccess?: (method: 'orange_money' | 'wave', phoneNumber: string) => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
    isOpen,
    onClose,
    amount,
    description,
    type,
    metadata,
    onSuccess
}) => {
    const [method, setMethod] = useState<'orange_money' | 'wave'>('orange_money');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const { toast } = useToast();

    const handlePayment = async () => {
        if (!phoneNumber) {
            toast({
                title: "Numéro requis",
                description: "Veuillez entrer votre numéro de téléphone",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        setStatus('processing');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data, error } = await supabase.functions.invoke('create-payment-intent', {
                body: {
                    amount,
                    currency: 'FCFA',
                    provider: method,
                    phoneNumber,
                    type,
                    metadata: {
                        ...metadata,
                        userId: user.id
                    }
                }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            setStatus('success');
            toast({
                title: "Paiement réussi !",
                description: `Votre transaction ${method === 'orange_money' ? 'Orange Money' : 'Wave'} a été validée.`,
            });

            setTimeout(() => {
                if (onSuccess) onSuccess(method, phoneNumber);
                handleClose();
            }, 2000);

        } catch (err: any) {
            console.error('Payment Error:', err);
            setStatus('error');
            toast({
                title: "Échec du paiement",
                description: err.message || "Une erreur est survenue lors du paiement.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setPhoneNumber('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Paiement sécurisé</DialogTitle>
                    <DialogDescription>
                        {description} - <span className="font-bold text-primary">{amount.toLocaleString()} FCFA</span>
                    </DialogDescription>
                </DialogHeader>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <p className="text-xl font-semibold text-green-700">Paiement Validé !</p>
                        <p className="text-sm text-gray-500">Merci pour votre confiance.</p>
                    </div>
                ) : status === 'error' ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <p className="text-xl font-semibold text-red-700">Échec de la transaction</p>
                        <Button variant="outline" onClick={() => setStatus('idle')}>Réessayer</Button>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="space-y-3">
                            <Label>Moyen de paiement</Label>
                            <RadioGroup value={method} onValueChange={(v: any) => setMethod(v)} className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroupItem value="orange_money" id="om" className="peer sr-only" />
                                    <Label
                                        htmlFor="om"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-orange-500 [&:has([data-state=checked])]:border-orange-500 cursor-pointer transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mb-2">
                                            <span className="text-white font-bold text-xs">OM</span>
                                        </div>
                                        <span className="text-sm font-semibold">Orange Money</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="wave" id="wave" className="peer sr-only" />
                                    <Label
                                        htmlFor="wave"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                                            <span className="text-white font-bold text-xs">W</span>
                                        </div>
                                        <span className="text-sm font-semibold">Wave</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="phone">Numéro de téléphone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="77 000 00 00"
                                    className="pl-9"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type="tel"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Entrez le numéro associé à votre compte {method === 'orange_money' ? 'Orange Money' : 'Wave'}.
                            </p>
                        </div>

                        {/* Simulation Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                            <p className="text-xs text-yellow-800 flex items-center gap-2">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <strong>Mode Simulation :</strong> Aucun débit réel ne sera effectué.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-start">
                    {status !== 'success' && status !== 'error' && (
                        <Button
                            className={`w-full ${method === 'orange_money' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            onClick={handlePayment}
                            disabled={isLoading || !phoneNumber}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                </>
                            ) : (
                                <>
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Payer {amount.toLocaleString()} FCFA
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
