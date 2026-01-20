import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  videoUrl?: string | null;
  onVideoChange: (videoUrl?: string | null) => void;
}

export function MediaUploader({
  images,
  onImagesChange,
  videoUrl,
  onVideoChange,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Upload vers Supabase Storage directement (client-side)
  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`; // On met à la racine ou dans un dossier produits

      const { data, error } = await supabase.storage
        .from('products') // Assumant que le bucket 'products' existe
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('products').getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Erreur upload: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert FileList to Array and process
    const newPromises = Array.from(files).map(async (file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Fichier ${file.name} trop lourd (>10MB)`);
        return null;
      }
      try {
        return await uploadFile(file);
      } catch {
        return null;
      }
    });

    const results = await Promise.all(newPromises);
    const successUrls = results.filter((url): url is string => url !== null);

    onImagesChange([...images, ...successUrls]);
    event.target.value = ''; // Reset input
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const newPromises = files.map(async (file) => {
        if (file.type.startsWith('image/')) {
          try {
            return await uploadFile(file);
          } catch {
            return null;
          }
        }
        return null;
      });

      const results = await Promise.all(newPromises);
      const successUrls = results.filter((url): url is string => url !== null);

      if (successUrls.length > 0) {
        onImagesChange([...images, ...successUrls]);
      }
    },
    [images, onImagesChange]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [primary] = newImages.splice(index, 1);
    newImages.unshift(primary);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Image principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5" />
            Galerie d'images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zone de drag & drop */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-primary bg-primary/5' : 'border-slate-200'}
              ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && document.getElementById('image-upload')?.click()}
          >
            {uploading ? (
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            ) : (
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            )}
            <p className="text-lg font-medium mb-2">
              {uploading ? 'Téléchargement...' : 'Glissez-déposez vos images ici'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              ou cliquez pour sélectionner (max 10MB par image)
            </p>
            <Button type="button" disabled={uploading} variant="secondary">
              Choisir des fichiers
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Prévisualisation des images */}
          {images.length > 0 && (
            <div className="space-y-4">
              <Label>Images ({images.length}) - La première est l'image principale</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 bg-slate-100
                      ${index === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                  >
                    {/* Badge image principale */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        PRINCIPALE
                      </div>
                    )}

                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay d'actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {index !== 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryImage(index);
                          }}
                          className="w-full h-8 text-xs"
                        >
                          Définir Prin.
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="w-full h-8 text-xs"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!images || images.length === 0) && (
            <div className="flex gap-2 items-center text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              ⚠️ Ajoutez au moins une image pour que le produit soit attractif.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vidéo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5" />
            Vidéo produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">URL de la vidéo (YouTube, Vimeo, etc.)</Label>
              <div className="flex gap-2">
                <Input
                  id="video-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl || ''}
                  onChange={(e) => onVideoChange(e.target.value || null)}
                />
                {videoUrl && (
                  <Button type="button" variant="outline" onClick={() => onVideoChange(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Collez un lien vers une vidéo de démonstration.
              </p>
            </div>

            {/* Simple preview if URL looks valid */}
            {videoUrl && (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden border">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}`}
                  title="Video preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
