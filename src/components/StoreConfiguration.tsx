
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Store, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const storeSchema = z.object({
    businessName: z.string().min(2, "Le nom de l'entreprise est requis (min 2 car.)"),
    avatarUrl: z.string().url("Veuillez entrer une URL valide pour le logo").optional().or(z.literal("")),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const StoreConfiguration = () => {
    const { user } = useAuth();
    const { profile, isLoading, updateProfile, isUpdating } = useProfile(user?.id);

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            businessName: '',
            avatarUrl: '',
        },
    });

    useEffect(() => {
        if (profile) {
            form.reset({
                businessName: profile.businessName || '',
                avatarUrl: profile.avatarUrl || '',
            });
        }
    }, [profile, form]);

    const onSubmit = (values: StoreFormValues) => {
        updateProfile({
            businessName: values.businessName,
            avatarUrl: values.avatarUrl,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Store className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardTitle>Configuration de la Boutique</CardTitle>
                    </div>
                    <CardDescription>
                        Personnalisez l'identité de votre boutique pour attirer plus de clients.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Nom de l'entreprise / boutique</Label>
                                    <Input
                                        id="businessName"
                                        placeholder="Ex: Ma Super Boutique"
                                        {...form.register('businessName')}
                                        className="focus-visible:ring-amber-500"
                                    />
                                    {form.formState.errors.businessName && (
                                        <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avatarUrl">URL du Logo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="avatarUrl"
                                            placeholder="https://image-url.com/logo.png"
                                            {...form.register('avatarUrl')}
                                            className="focus-visible:ring-amber-500"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <ImageIcon className="h-3 w-3" />
                                        Utilisez une URL directe vers votre image (JPEG, PNG).
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <div className="mb-4 relative">
                                    {form.watch('avatarUrl') ? (
                                        <img
                                            src={form.watch('avatarUrl')}
                                            alt="Aperçu Logo"
                                            className="h-32 w-32 object-cover rounded-2xl shadow-md border-4 border-white"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo+Invalide';
                                            }}
                                        />
                                    ) : (
                                        <div className="h-32 w-32 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                                            <Store className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-900">{form.watch('businessName') || 'Ma Boutique'}</p>
                                    <p className="text-sm text-slate-500">Aperçu sur le marketplace</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium opacity-0 group-data-[success=true]:opacity-100 transition-opacity">
                                <CheckCircle2 className="h-4 w-4" /> modifications sauvegardées
                            </div>
                            <Button
                                type="submit"
                                disabled={isUpdating}
                                className="bg-amber-600 hover:bg-amber-700 text-white min-w-[200px]"
                            >
                                {isUpdating ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
                                ) : (
                                    "Enregistrer ma boutique"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-r from-slate-900 to-indigo-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Félicitations ! Votre boutique est prête.</h3>
                            <p className="text-slate-300">
                                Vous pouvez maintenant ajouter vos premiers produits et commencer à vendre.
                            </p>
                        </div>
                        <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                            Ajouter un produit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StoreConfiguration;
