
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Loader2 } from "lucide-react";

const ROLE_OPTIONS = ["admin", "client", "marchand", "livreur"];

export function ProfileRolesManager() {
  const {
    roles,
    isLoading,
    addRole,
    removeRole,
    error,
    isPending,
  } = useUserRoles();
  const [newRole, setNewRole] = useState("");

  const canAddRoles = true; // ici tu pourras adapter les permissions selon les besoins

  // Liste des rôles disponibles à ajouter (non déjà attribués)
  const availableRoles = ROLE_OPTIONS.filter(
    (opt) => !roles.some((r) => r.role === opt)
  );

  const handleAdd = async () => {
    if (!newRole || isPending) return;
    await addRole(newRole);
    setNewRole("");
  };

  const handleRemove = async (role: string) => {
    if (isPending) return;
    await removeRole(role);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="mb-1 text-xs text-gray-600">Rôles liés à votre compte :</div>
      <div className="flex gap-2 flex-wrap min-h-[28px] items-center">
        {isLoading && <Badge className="animate-pulse">Chargement…</Badge>}
        {roles.length === 0 && !isLoading && <Badge className="bg-gray-100 text-gray-500">Aucun rôle</Badge>}
        {roles.map((r) => (
          <Badge key={r.id} className="bg-purple-100 text-purple-700 border-purple-300 flex items-center gap-2">
            {r.role}
            {canAddRoles && (
              <button
                type="button"
                className="ml-1 text-red-500 font-bold hover:underline text-[10px] disabled:opacity-50"
                onClick={() => handleRemove(r.role)}
                disabled={isPending}
                title="Retirer ce rôle"
                aria-label={`Retirer rôle ${r.role}`}
              >
                ✗
              </button>
            )}
          </Badge>
        ))}
      </div>
      {canAddRoles && (
        <div className="flex gap-2 mt-1 items-center">
          <select
            className="border rounded px-2 py-1 text-xs"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            disabled={isPending || availableRoles.length === 0}
          >
            <option value="">Sélectionner un rôle</option>
            {availableRoles.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!newRole || isPending}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Ajouter'}
          </Button>
        </div>
      )}
      {error && (
        <span className="text-xs text-red-500">{(error as Error).message}</span>
      )}
    </div>
  );
}
