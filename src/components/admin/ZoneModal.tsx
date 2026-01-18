
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DeliveryZone } from '@/hooks/useDeliveryZones';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

const zoneSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  areas: z.string().min(1, 'Les quartiers sont requis'),
  base_fee: z.coerce.number().min(0, 'Les frais doivent être positifs'),
  price_per_km: z.coerce.number().min(0, 'Le prix doit être positif'),
  max_delivery_time_minutes: z.coerce.number().int().min(0, 'Le temps doit être un entier positif'),
  is_active: z.boolean(),
});

type ZoneFormValues = z.infer<typeof zoneSchema>;

interface ZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  zone?: DeliveryZone;
}

export const ZoneModal: React.FC<ZoneModalProps> = ({ isOpen, onClose, onSuccess, zone }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        name: zone?.name || '',
        areas: zone?.areas.join(', ') || '',
        base_fee: zone?.base_fee || 0,
        price_per_km: zone?.price_per_km || 0,
        max_delivery_time_minutes: zone?.max_delivery_time_minutes || 30,
        is_active: zone?.is_active ?? true,
      };
      form.reset(defaultValues);
    } else {
      form.reset();
    }
  }, [isOpen, zone, form]);

  const onSubmit = async (data: ZoneFormValues) => {
    setIsSubmitting(true);
    try {
      const zoneData = {
        name: data.name,
        areas: data.areas.split(',').map(s => s.trim()).filter(Boolean),
        base_fee: data.base_fee,
        price_per_km: data.price_per_km,
        max_delivery_time_minutes: data.max_delivery_time_minutes,
        is_active: data.is_active,
      };

      if (zone) {
        const { error } = await supabase.from('delivery_zones' as any).update(zoneData).eq('id', zone.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('delivery_zones' as any).insert(zoneData as any);
        if (error) throw error;
      }

      toast({
        title: zone ? 'Zone modifiée' : 'Zone créée',
        description: `La zone ${data.name} a été enregistrée avec succès.`,
      });
      onSuccess();

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{zone ? 'Modifier la zone' : 'Nouvelle zone'}</DialogTitle>
          <DialogDescription>
            {zone ? 'Modifiez les détails de la zone de livraison.' : 'Créez une nouvelle zone de livraison.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nom de la zone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="areas" render={({ field }) => (
              <FormItem><FormLabel>Quartiers couverts</FormLabel><FormControl><Textarea {...field} placeholder="Dakar-Plateau, Fann, Point E..." /></FormControl><FormDescription>Séparez les noms de quartiers par une virgule.</FormDescription><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="base_fee" render={({ field }) => (
                <FormItem><FormLabel>Frais de base (CFA)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="price_per_km" render={({ field }) => (
                <FormItem><FormLabel>Prix / km (CFA)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="max_delivery_time_minutes" render={({ field }) => (
              <FormItem><FormLabel>Temps max (minutes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="is_active" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Zone Active</FormLabel><FormDescription>Les livreurs peuvent opérer dans cette zone.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {zone ? 'Enregistrer' : 'Créer la zone'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
