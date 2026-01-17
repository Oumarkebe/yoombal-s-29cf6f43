import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      // Redirect based on user role (using DB role names)
      if (user.role === 'merchant') {
        navigate('/merchant');
      } else if (user.role === 'driver') {
        navigate('/delivery');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Wait a bit for AuthContext to load user profile
        setTimeout(() => {
          setIsLoading(false);
          // Navigation will be handled by the useEffect above
        }, 500);
      }
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>

        <Card className="w-full max-w-md shadow-2xl relative z-10 border-t-4 border-t-amber-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Connexion</CardTitle>
            <CardDescription className="text-slate-500">
              Heureux de vous revoir sur Yoombal
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm flex items-start">
                  <div className="flex-1">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link to="/forgot-password" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 text-lg"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</> : 'Se connecter'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4">
                S'inscrire gratuitement
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
