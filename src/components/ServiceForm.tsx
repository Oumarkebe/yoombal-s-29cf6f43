import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ServiceFormProps {
  service: {
    name: string;
    description?: string;
    is_active: boolean;
  };
  mode: 'edit' | 'new';
  onSubmit: (data: { name: string; description?: string; is_active: boolean }) => void;
  onClose: () => void;
}

const ServiceForm = ({ service, mode, onSubmit, onClose }: ServiceFormProps) => {
  const [formData, setFormData] = useState(service);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'edit' ? 'Modifier la prestation' : 'Ajouter une prestation'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div className="mb-4">
            <label className="font-medium block mb-1">Nom</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-medium block mb-1">Description</label>
            <Input
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <label className="font-medium">Active ?</label>
            <Switch
              checked={!!formData.is_active}
              onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{mode === 'edit' ? 'Sauvegarder' : 'Ajouter'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
