import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  CalendarIcon,
  Package,
  Download,
  Building2,
  Upload,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvancedSettingsFormProps {
  formData: any;
  onChange: (data: any) => void;
}

export function AdvancedSettingsForm({ formData, onChange }: AdvancedSettingsFormProps) {
  return (
    <div className="space-y-6">
      {/* Produit Digital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="h-5 w-5" />
            Produit Numérique (Formation / Ebook)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Produit 100% Digital</Label>
              <div className="text-sm text-muted-foreground">
                Cochez cette case si aucune expédition physique n'est requise.
              </div>
            </div>
            <Switch
              checked={formData.is_digital}
              onCheckedChange={(checked) => onChange({ ...formData, is_digital: checked })}
            />
          </div>

          {formData.is_digital && (
            <div className="space-y-4 pt-4 border-t mt-2">
              <div className="space-y-2">
                <Label htmlFor="download-url">URL de téléchargement ou d'accès</Label>
                <div className="flex gap-2">
                  <Input
                    id="download-url"
                    type="url"
                    value={formData.download_url || ''}
                    onChange={(e) => onChange({ ...formData, download_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      id="digital-file-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const loadingToast = toast.loading('Téléchargement du fichier...');
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                          const filePath = `${fileName}`;

                          const { error: uploadError } = await supabase.storage
                            .from('digital-products')
                            .upload(filePath, file);

                          if (uploadError) throw uploadError;

                          const {
                            data: { publicUrl },
                          } = supabase.storage.from('digital-products').getPublicUrl(filePath);

                          onChange({ ...formData, download_url: publicUrl });
                          toast.success('Fichier mis en ligne avec succès !', { id: loadingToast });
                        } catch (error: any) {
                          console.error('Error uploading file:', error);
                          toast.error(`Erreur lors de l'envoi : ${error.message}`, {
                            id: loadingToast,
                          });
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 shrink-0"
                      onClick={() => document.getElementById('digital-file-upload')?.click()}
                    >
                      {formData.download_url?.includes('digital-products') ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Héberger
                    </Button>
                  </div>
                </div>
                {formData.download_url && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-md border border-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium truncate flex-1">
                      Configuré : {formData.download_url}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onChange({ ...formData, download_url: '' })}
                    >
                      Effacer
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Vous pouvez coller un lien existant ou cliquer sur "Héberger" pour envoyer un
                  fichier sur nos serveurs sécurisés.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options B2B */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Options Grossistes (B2B)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wholesale-price">Prix Grossiste (XOF)</Label>
              <Input
                id="wholesale-price"
                type="number"
                min="0"
                value={formData.wholesale_price || ''}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    wholesale_price: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                placeholder="Ex: 40000"
              />
              {formData.wholesale_price && formData.price && (
                <p className="text-xs text-blue-600 font-medium">
                  Marge grossiste: -
                  {Math.round((1 - formData.wholesale_price / formData.price) * 100)}% sur le prix
                  public
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-order-quantity">Quantité Minimum (MOQ)</Label>
              <Input
                id="min-order-quantity"
                type="number"
                min="1"
                value={formData.min_order_quantity || 1}
                onChange={(e) =>
                  onChange({
                    ...formData,
                    min_order_quantity: parseInt(e.target.value) || 1,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum pour déclencher le tarif grossiste.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logistique avancée */}
      {!formData.is_digital && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Détails Logistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids Unitaire (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight || ''}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      weight: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="0.5"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Dimensions (L x l x h) en cm</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="L"
                    type="number"
                    value={formData.dimensions?.length || ''}
                    onChange={(e) =>
                      onChange({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          length: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="l"
                    type="number"
                    value={formData.dimensions?.width || ''}
                    onChange={(e) =>
                      onChange({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          width: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="h"
                    type="number"
                    value={formData.dimensions?.height || ''}
                    onChange={(e) =>
                      onChange({
                        ...formData,
                        dimensions: {
                          ...formData.dimensions,
                          height: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Code-barres (EAN-13 / UPC)</Label>
              <Input
                id="barcode"
                value={formData.barcode || ''}
                onChange={(e) => onChange({ ...formData, barcode: e.target.value })}
                placeholder="Scan ou saisie manuelle..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publication programmée */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Planification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Date de publication</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!formData.published_at && 'text-muted-foreground'}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.published_at ? (
                      format(new Date(formData.published_at), 'PPP', { locale: fr })
                    ) : (
                      <span>Immédiatement (si actif)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.published_at ? new Date(formData.published_at) : undefined}
                    onSelect={(date) =>
                      onChange({
                        ...formData,
                        published_at: date ? date.toISOString() : null,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {formData.published_at && new Date(formData.published_at) > new Date() && (
              <div className="bg-yellow-50 text-yellow-800 p-2 rounded text-sm border border-yellow-200">
                Le produit sera visible automatiquement à partir du{' '}
                {format(new Date(formData.published_at), 'Pp', { locale: fr })}.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
