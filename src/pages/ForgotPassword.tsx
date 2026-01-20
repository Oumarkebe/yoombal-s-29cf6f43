import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
        toast.success('Email envoyé avec succès !');
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
              <KeyRound className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Mot de passe oublié ?
            </CardTitle>
            <CardDescription className="text-slate-500">
              Pas de panique ! Entrez votre email et nous vous enverrons un lien de
              réinitialisation.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 border border-green-200">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Email envoyé !</span>
                </div>
                <p className="text-sm text-slate-600">
                  Vérifiez votre boîte de réception (et vos spams) pour réinitialiser votre mot de
                  passe.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">Retour à la connexion</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email associé au compte</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-6">
            <Link
              to="/login"
              className="flex items-center text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
