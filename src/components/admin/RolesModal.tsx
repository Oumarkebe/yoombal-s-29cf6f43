
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserAiSettingsManager } from "./UserAiSettingsManager";
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const ROLE_OPTIONS: AppRole[] = ["admin", "user", "merchant", "driver", "moderator"];
const ADMIN_CONFIRM_PASSWORD = "010101";

interface RolesModalProps {
  user: any;
  onClose: () => void;
}

export function RolesModal({ user, onClose }: RolesModalProps) {
  const { roles, isLoading, addRole, removeRole, isPending } = useUserRoles({ userId: user.id });
  const [addInput, setAddInput] = useState<AppRole | "">("");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<(() => Promise<void>) | null>(null);
  const [passwordInput, setPasswordInput] = useState("");

  const customRoleOptions = ROLE_OPTIONS.filter(opt => !roles.some(r => r.role === opt));

  const handleAdd = async (role: AppRole) => {
    if (!role) return;
    const action = async () => {
      await addRole(role);
      setAddInput("");
    };

    if (role === "admin") {
      setActionToConfirm(() => action);
      setIsAlertOpen(true);
    } else {
      await action();
    }
  };

  const handleRemove = async (role: AppRole) => {
    const action = async () => {
      await removeRole(role);
    };

    if (role === "admin") {
      setActionToConfirm(() => action);
      setIsAlertOpen(true);
    } else {
      await action();
    }
  };

  const handleConfirmAction = async () => {
    if (passwordInput === ADMIN_CONFIRM_PASSWORD) {
      if (actionToConfirm) {
        await actionToConfirm();
      }
      handleCancelAction();
    } else {
      toast.error("Mot de passe incorrect.");
      setPasswordInput("");
    }
  };

  const handleCancelAction = () => {
    setIsAlertOpen(false);
    setPasswordInput("");
    setActionToConfirm(null);
  };

  const onAlertDialogChange = (open: boolean) => {
    if (!open) {
      handleCancelAction();
    }
    setIsAlertOpen(open);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
          <h2 className="font-bold text-lg mb-2">Modifier rôles & Accès IA</h2>
          <p className="mb-4 text-sm text-gray-600">
            {user.first_name} {user.last_name} <br />
            <span className="text-xs text-gray-400">{user.email}</span>
          </p>
          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold text-gray-600">Rôles attribués :</div>
            <div className="flex gap-2 flex-wrap min-h-[24px]">
              {isLoading && <Badge className="animate-pulse">Chargement...</Badge>}
              {roles.map(r => (
                <Badge key={r.id} className="bg-purple-100 text-purple-700 border-purple-300 flex gap-1 items-center">
                  {r.role}
                  <button
                    type="button"
                    onClick={() => handleRemove(r.role)}
                    className="ml-1 text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                    aria-label="Retirer le rôle"
                    disabled={isPending}
                  >✗</button>
                </Badge>
              ))}
              {roles.length === 0 && !isLoading && <span className="text-xs text-gray-400">Aucun rôle attribué.</span>}
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-2 text-xs font-semibold text-gray-600">Ajouter un rôle :</div>
            <div className="flex gap-2">
              <select
                value={addInput}
                onChange={e => setAddInput(e.target.value as AppRole | "")}
                className="border rounded px-2 py-1 text-sm w-full"
                disabled={customRoleOptions.length === 0}
              >
                <option value="">Sélectionner un rôle</option>
                {customRoleOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { if (addInput) handleAdd(addInput); }}
                disabled={!addInput || isPending}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Ajouter'}
              </Button>
            </div>
          </div>
          <hr className="my-6" />

          <UserAiSettingsManager userId={user.id} />

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isPending}>Fermer</Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={onAlertDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation requise</AlertDialogTitle>
            <AlertDialogDescription>
              Pour modifier le rôle 'admin', veuillez entrer le mot de passe de confirmation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmAction(); }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAction}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
