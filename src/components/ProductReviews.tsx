
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useProductReviews } from "@/hooks/useProductReviews";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Affichage d'une étoile cliquable
function StarButton({ filled, onClick } : { filled: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Noter">
      <Star className={`w-6 h-6 ${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    </button>
  );
}

// Calcul la moyenne avec arrondi demi point
function getAverageRating(reviews: {rating: number}[]): number {
  if (!reviews.length) return 0;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return Math.round(avg * 2) / 2;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { reviews, myReview, submitReview, isLoading, error, user } = useProductReviews(productId);
  const { toast } = useToast();
  const [form, setForm] = useState({
    rating: myReview?.rating || 0,
    comment: myReview?.comment || ""
  });
  const [submitting, setSubmitting] = useState(false);

  const average = getAverageRating(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await submitReview(form.rating, form.comment);
    setSubmitting(false);
    if ("error" in result) {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Avis publié !", description: "Merci pour votre retour." });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">Avis clients</h3>
      {isLoading ? (
        <div className="text-gray-500">Chargement des avis...</div>
      ) : (
        <>
          <div className="flex items-center mb-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((i) =>
                <Star key={i}
                  className={`h-5 w-5 ${i <= average ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              )}
            </div>
            <span className="ml-2 text-xl font-semibold">
              {average || "-"}
            </span>
            <span className="ml-2 text-gray-600 text-base">
              ({reviews.length} avis)
            </span>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          {/* Liste des avis */}
          <div className="space-y-3 mb-4">
            {reviews.length === 0 && (
              <div className="text-gray-500">Aucun avis pour ce produit.</div>
            )}
            {reviews.map(r =>
              <div key={r.id} className="rounded border bg-gray-50 px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i =>
                      <Star key={i} className={`h-4 w-4 ${i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="text-sm text-gray-800 mb-1">{r.comment}</div>
                {myReview && r.user_id === user?.id && (
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded">Moi</span>
                )}
              </div>
            )}
          </div>

          {/* Formulaire pour laisser un avis */}
          {user && (
            <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-700">Votre note :</span>
                {[1,2,3,4,5].map(i =>
                  <StarButton
                    key={i}
                    filled={form.rating >= i}
                    onClick={() => setForm(v => ({...v, rating: i}))}
                  />
                )}
              </div>
              <Textarea
                className="mb-2"
                value={form.comment}
                placeholder="Votre commentaire (optionnel)"
                minLength={0} maxLength={500}
                onChange={e => setForm(v => ({...v, comment: e.target.value}))}
                rows={2}
                required={false}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600"
                disabled={submitting || form.rating === 0}
              >
                {myReview ? "Modifier l’avis" : "Laisser un avis"}
              </Button>
            </form>
          )}
          {!user && (
            <div className="text-center text-gray-500 mt-3">
              Connectez-vous pour laisser un avis sur ce produit.
            </div>
          )}
        </>
      )}
    </Card>
  );
}
