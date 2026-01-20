import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CourseFormProps {
  course: {
    delivery_id: string;
    service_id?: string;
    driver_id?: string;
    status?: string;
    started_at?: string;
    ended_at?: string;
  };
  mode: 'edit' | 'new';
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const CourseForm = ({ course, mode, onSubmit, onClose }: CourseFormProps) => {
  const [formData, setFormData] = useState(course);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === 'edit' ? 'Modifier la course' : 'Ajouter une course'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div className="mb-4">
            <label className="font-medium block mb-1">Delivery ID</label>
            <Input
              value={formData.delivery_id || ''}
              onChange={(e) => setFormData({ ...formData, delivery_id: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-medium block mb-1">Service ID</label>
            <Input
              value={formData.service_id || ''}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium block mb-1">Driver ID</label>
            <Input
              value={formData.driver_id || ''}
              onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="font-medium block mb-1">Statut</label>
            <Input
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
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

export default CourseForm;
