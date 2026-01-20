import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  // Verify that the user is authenticated (via the magic link)
  useEffect(() => {
    // Small timeout to allow session to load
    const timer = setTimeout(() => {
      if (!session) {
        toast.error('Lien invalide ou expiré. Veuillez refaire une demande.');
        navigate('/forgot-password');
      }
    }, 1000); // 1s tolerance for session check
    return () => clearTimeout(timer);
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit faire au moins 6 caractères.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await updatePassword(password);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Mot de passe mis à jour avec succès !');
        navigate('/login');
      }
    } catch (err: any) {
      toast.error('Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>

        <Card className="w-full max-w-md shadow-2xl relative z-10 border-t-4 border-t-amber-500 animate-in fade-in zoom-in-95 duration-500">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Nouveau mot de passe
            </CardTitle>
            <CardDescription className="text-slate-500">
              Sécurisez votre compte avec un nouveau mot de passe fort.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Confirmer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
