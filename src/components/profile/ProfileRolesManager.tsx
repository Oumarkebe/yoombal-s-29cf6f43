import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserRoles } from '@/hooks/useUserRoles';
import { AppRole, ROLE_LABELS } from '@/types/auth';
import { Plus } from 'lucide-react';

// Use database role names to match the app_role enum
const ROLE_OPTIONS: AppRole[] = ['user', 'merchant', 'driver', 'admin'];

interface ProfileRolesManagerProps {
  userId: string;
}

export function ProfileRolesManager({ userId }: ProfileRolesManagerProps) {
  const { roles, isLoading, addRole, removeRole, isPending, error } = useUserRoles({ userId });
  const [newRole, setNewRole] = useState<AppRole | ''>('');

  const canAddRoles = true; // ici tu pourras adapter les permissions selon les besoins

  // Liste des rôles disponibles à ajouter (non déjà attribués)
  const availableRoles = ROLE_OPTIONS.filter((opt) => !roles.some((r) => r.role === opt));

  const handleAdd = async () => {
    if (!newRole || isPending) return;
    await addRole(newRole);
    setNewRole('');
  };

  const handleRemove = async (role: AppRole) => {
    if (isPending) return;
    await removeRole(role);
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      <h3 className="font-medium text-sm text-gray-700">Rôles liés à votre compte :</h3>
      <div className="flex flex-wrap gap-2">
        {isLoading && <span className="text-xs text-gray-500">Chargement…</span>}
        {roles.length === 0 && !isLoading && (
          <span className="text-xs text-gray-500">Aucun rôle</span>
        )}
        {roles.map((r) => (
          <span
            key={r.role}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {r.role}
            {canAddRoles && (
              <button
                type="button"
                className="ml-1.5 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                onClick={() => handleRemove(r.role)}
                disabled={isPending}
                title="Retirer ce rôle"
                aria-label={`Retirer rôle ${r.role}`}
              >
                ✗
              </button>
            )}
          </span>
        ))}
      </div>
      {canAddRoles && (
        <div className="flex gap-2 mt-2">
          <select
            className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as AppRole | '')}
            disabled={isPending || availableRoles.length === 0}
          >
            <option value="">Sélectionner un rôle</option>
            {availableRoles.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newRole || isPending}
            className="flex-shrink-0"
          >
            {isPending ? <span className="animate-spin">⏳</span> : 'Ajouter'}
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{(error as Error).message}</p>}
    </div>
  );
}
