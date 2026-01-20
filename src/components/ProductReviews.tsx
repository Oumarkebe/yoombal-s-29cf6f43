import React, { useState } from 'react';
import { Star, Upload, X, CheckCircle, ThumbsUp } from 'lucide-react';
import { useProductReviews } from '@/hooks/useProductReviews';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

function StarButton({ filled, onClick }: { filled: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Noter" className="focus:outline-none transition-transform hover:scale-110">
      <Star className={`w-6 h-6 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    </button>
  );
}

function getAverageRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return Math.round(avg * 2) / 2;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { reviews, myReview, submitReview, isLoading, error, user } = useProductReviews(productId);
  const { toast } = useToast();
  const [form, setForm] = useState({
    rating: myReview?.rating || 0,
    comment: myReview?.comment || '',
    photos: myReview?.photos || [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const average = getAverageRating(reviews);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    // Limit to 3 photos
    if (form.photos.length >= 3) {
      toast({ title: 'Limite atteinte', description: 'Max 3 photos par avis.', variant: 'destructive' });
      return;
    }

    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Fichier trop lourd', description: 'Max 2MB par image.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('reviews')
        .getPublicUrl(fileName);

      setForm(prev => ({ ...prev, photos: [...prev.photos, publicUrl] }));
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({ title: 'Erreur upload', description: "Impossible d'uploader l'image.", variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitReview(form.rating, form.comment, form.photos);
    setSubmitting(false);
    if ('error' in result) {
      toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Avis publié !', description: 'Merci pour votre retour.' });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Avis clients</h3>

      {isLoading ? (
        <div className="flex justify-center p-8 text-gray-500">Chargement des avis...</div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{average || '-'}</div>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= average ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">{reviews.length} avis</div>
            </div>
            <div className="flex-1 border-l border-gray-200 pl-4">
              {/* Distribution bars could go here */}
              <p className="text-sm text-gray-600">
                La note moyenne est calculée sur la base des avis vérifiés de nos clients.
              </p>
            </div>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          {/* Formulaire */}
          {user ? (
            <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">
                {myReview ? 'Modifier votre avis' : 'Donnez votre avis'}
              </h4>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Note globale :</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarButton
                        key={i}
                        filled={form.rating >= i}
                        onClick={() => setForm((v) => ({ ...v, rating: i }))}
                      />
                    ))}
                  </div>
                </div>

                <Textarea
                  value={form.comment}
                  placeholder="Qu'avez-vous pensé de ce produit ? (Qualité, livraison, conformité...)"
                  onChange={(e) => setForm((v) => ({ ...v, comment: e.target.value }))}
                  className="min-h-[100px]"
                />

                {/* Photo Upload */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.photos.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
                        <img src={url} alt={`Avis ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {form.photos.length < 3 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        {uploading ? (
                          <span className="text-xs text-gray-500">...</span>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-[10px] text-gray-500">Photo</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Ajoutez jusqu'à 3 photos (max 2MB).</p>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || form.rating === 0 || uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? 'Envoi...' : 'Publier mon avis'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center mb-8">
              <p className="text-gray-600 mb-4">Connectez-vous pour partager votre expérience.</p>
              <Button variant="outline" asChild>
                <a href="/login">Se connecter</a>
              </Button>
            </div>
          )}

          {/* Liste des avis */}
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">Utilisateur</div>
                    {r.is_verified_purchase && (
                      <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700 hover:bg-green-100 border-none">
                        <CheckCircle className="w-3 h-3" />
                        Achat vérifié
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-3">{r.comment}</p>

                {r.photos && r.photos.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {r.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt={`Photo client ${idx}`}
                        className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-90 border"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    Utile ({r.helpful_count || 0})
                  </button>
                  {myReview && r.user_id === user?.id && (
                    <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 rounded">
                      C'est vous
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
