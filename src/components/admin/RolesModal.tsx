import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useUserRoles } from '@/hooks/useUserRoles';
import { AppRole, ROLE_LABELS } from '@/types/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

// Use database role names to match the app_role enum
const ROLE_OPTIONS: AppRole[] = ['user', 'merchant', 'driver', 'admin'];
const ADMIN_CONFIRM_PASSWORD = 'yoombal-admin';

interface RolesModalProps {
  user: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  onClose?: () => void;
}

export function RolesModal({ user, onClose }: RolesModalProps) {
  const { roles, isLoading, addRole, removeRole, isPending } = useUserRoles({ userId: user.id });
  const [addInput, setAddInput] = useState<AppRole | ''>('');

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<(() => Promise<void>) | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  const customRoleOptions = ROLE_OPTIONS.filter((opt) => !roles.some((r) => r.role === opt));

  const handleAdd = async (role: AppRole) => {
    if (!role) return;
    const action = async () => {
      await addRole(role);
      setAddInput('');
    };

    if (role === 'admin') {
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

    if (role === 'admin') {
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
      toast.error('Mot de passe incorrect.');
      setPasswordInput('');
    }
  };

  const handleCancelAction = () => {
    setIsAlertOpen(false);
    setPasswordInput('');
    setActionToConfirm(null);
  };

  const onAlertDialogChange = (open: boolean) => {
    if (!open) {
      handleCancelAction();
    }
    setIsAlertOpen(open);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open && onClose) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-bold border-b pb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Modifier rôles & Accès IA
          </div>
          <div className="text-sm text-gray-500">
            {user.first_name} {user.last_name} <br />
            {user.email}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Rôles attribués :</h4>
            <div className="bg-gray-50 p-3 rounded flex flex-wrap gap-2 min-h-[50px] items-center">
              {isLoading && <span className="text-xs text-gray-400">Chargement...</span>}
              {roles.map((r) => (
                <span
                  key={r.role}
                  className="inline-flex items-center px-2 py-1 bg-white border rounded text-xs font-semibold shadow-sm"
                >
                  {r.role}
                  <button
                    onClick={() => handleRemove(r.role)}
                    className="ml-1 text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                    aria-label="Retirer le rôle"
                    disabled={isPending}
                  >
                    ✗
                  </button>
                </span>
              ))}
              {roles.length === 0 && !isLoading && (
                <span className="text-xs text-gray-400 italic">Aucun rôle attribué.</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Ajouter un rôle :</h4>
            <div className="flex gap-2">
              <select
                value={addInput}
                onChange={(e) => setAddInput(e.target.value as AppRole | '')}
                className="border rounded px-2 py-1 text-sm w-full"
                disabled={customRoleOptions.length === 0}
              >
                <option value="">Sélectionner un rôle</option>
                {customRoleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={() => {
                  if (addInput) handleAdd(addInput);
                }}
                disabled={!addInput || isPending}
              >
                {isPending ? <span className="animate-spin mr-1">⏳</span> : 'Ajouter'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>

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
            placeholder="Mot de passe admin"
            autoComplete="current-password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmAction();
            }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAction}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
