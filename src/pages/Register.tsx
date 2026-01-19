import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserPlus, Store, Truck, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const getDefaultRole = (urlRole: string | null): AppRole => {
  if (!urlRole) return 'user';
  const mapping: Record<string, AppRole> = {
    client: 'user',
    merchant: 'merchant',
    delivery: 'driver',
    admin: 'admin',
  };
  return mapping[urlRole] || 'user';
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = getDefaultRole(searchParams.get('role'));

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole as AppRole,
    business_name: '',
    business_type: '',
    vehicle_type: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'user' as AppRole, label: 'Client', icon: <User className="h-4 w-4" />, description: 'Acheter des produits' },
    { value: 'merchant' as AppRole, label: 'Marchand', icon: <Store className="h-4 w-4" />, description: 'Vendre des produits' },
    { value: 'driver' as AppRole, label: 'Livreur', icon: <Truck className="h-4 w-4" />, description: 'Livrer des commandes' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as AppRole
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        business_name: formData.business_name,
        business_type: formData.business_type,
        vehicle_type: formData.vehicle_type
      });

      if (result.error) {
        setError(result.error);
      } else {
        if (formData.role === 'merchant') navigate('/merchant');
        else if (formData.role === 'driver') navigate('/delivery');
        else navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>

        <Card className="w-full max-w-lg shadow-2xl relative z-10 border-t-4 border-t-amber-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Créer un compte Yoombal</CardTitle>
            <CardDescription className="text-slate-500">
              Rejoignez l'écosystème de commerce digital n°1
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm flex items-start">
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Quel type de compte souhaitez-vous ?</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleRoleChange(option.value)}
                      className={`cursor-pointer rounded-lg border-2 p-3 flex flex-col items-center justify-center gap-2 text-center transition-all hover:bg-slate-50 ${formData.role === option.value
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-slate-200 text-slate-500'
                        }`}
                    >
                      {option.icon}
                      <span className="text-xs font-bold">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="Moussa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Diop" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel ou personnel</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="moussa.diop@exemple.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+221 77 000 00 00" />
              </div>

              {/* Dynamic Fields based on Role */}
              {formData.role === 'merchant' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2"><Store className="h-4 w-4" /> Détails Boutique</h4>
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Nom de l'entreprise</Label>
                    <Input id="business_name" name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Ex: Diop Couture" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Secteur d'activité</Label>
                    <Input id="business_type" name="business_type" value={formData.business_type} onChange={handleChange} placeholder="Ex: Mode & Accessoires" />
                  </div>
                </div>
              )}

              {formData.role === 'driver' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 animate-in slide-in-from-top-2">
                  <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2"><Truck className="h-4 w-4" /> Détails Véhicule</h4>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Type de véhicule</Label>
                    <Select value={formData.vehicle_type} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moto">Moto</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                        <SelectItem value="voiture">Voiture</SelectItem>
                        <SelectItem value="velo">Vélo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                </div>
              </div>
              <p className="text-xs text-slate-500">Au moins 6 caractères.</p>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-lg" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</> : <><CheckCircle2 className="mr-2 h-5 w-5" /> Créer mon compte</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-amber-600 hover:text-amber-700 underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
