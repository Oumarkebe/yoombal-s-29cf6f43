import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useServices } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import ServiceForm from './ServiceForm';
import { toast } from 'sonner';

const ServiceList = () => {
  const { services, isLoading, addService, updateService, deleteService } = useServices();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin');
  const [editing, setEditing] = useState<{ id: string; mode: 'edit' | 'new' } | null>(null);

  if (isLoading) {
    return <div>Chargement des prestations…</div>;
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-4">
          <Button onClick={() => setEditing({ id: '', mode: 'new' })}>
            Ajouter une prestation
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(services as any[]).map((s: any) => (
          <Card key={s.id} className="p-4 flex flex-col gap-2 relative">
            <div>
              <h3 className="text-lg font-bold text-primary">{s.name}</h3>
              <div className="text-gray-600">{s.description}</div>
            </div>
            <div className="mt-1">
              {s.is_active ? (
                <span className="text-xs text-green-500 font-semibold">Disponible</span>
              ) : (
                <span className="text-xs text-gray-400">Non active</span>
              )}
            </div>
            {isAdmin && (
              <div className="absolute right-3 top-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing({ id: s.id, mode: 'edit' })}
                >
                  Éditer
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteService.mutateAsync(s.id);
                      toast.success('Service supprimé');
                    } catch {
                      toast.error('Erreur lors de la suppression');
                    }
                  }}
                >
                  Supprimer
                </Button>
              </div>
            )}
            {editing && editing.id === s.id && editing.mode === 'edit' && (
              <ServiceForm
                service={s}
                mode="edit"
                onClose={() => setEditing(null)}
                onSubmit={async (data) => {
                  try {
                    await updateService.mutateAsync({ ...data, id: s.id });
                    toast.success('Service modifié !');
                    setEditing(null);
                  } catch {
                    toast.error('Erreur modification');
                  }
                }}
              />
            )}
          </Card>
        ))}
      </div>
      {editing && editing.mode === 'new' && (
        <ServiceForm
          service={{ name: '', description: '', is_active: true }}
          mode="new"
          onClose={() => setEditing(null)}
          onSubmit={async (data) => {
            try {
              await addService.mutateAsync(data);
              toast.success('Service ajouté !');
              setEditing(null);
            } catch {
              toast.error('Erreur création');
            }
          }}
        />
      )}
    </div>
  );
};

export default ServiceList;
