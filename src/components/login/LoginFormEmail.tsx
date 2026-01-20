import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface LoginFormEmailProps {
  formData: { email: string; password: string };
  setFormData: (f: any) => void;
  isLoading: boolean;
}

export function LoginFormEmail({ formData, setFormData, isLoading }: LoginFormEmailProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={formData.email}
          onChange={(e) => setFormData((f: any) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="Votre mot de passe"
          value={formData.password}
          onChange={(e) => setFormData((f: any) => ({ ...f, password: e.target.value }))}
          required
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300" />
          <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700">
          Mot de passe oublié ?
        </Link>
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 mb-4"
        disabled={isLoading}
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </>
  );
}
