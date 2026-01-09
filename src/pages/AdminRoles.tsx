
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { RolesBadges } from "@/components/admin/RolesBadges";
import { RolesModal } from "@/components/admin/RolesModal";
import { UserFeaturesModal } from "@/components/admin/UserFeaturesModal";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AuthUser {
  id: string;
  email: string;
  confirmed_at: string | null;
  user_metadata: {
    first_name?: string;
    last_name?: string;
  };
}

async function fetchUsers(): Promise<AuthUser[]> {
  const { data, error } = await supabase.functions.invoke<AuthUser[]>('get-users');
  if (error) {
    toast.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    throw new Error(error.message);
  }
  return data || [];
}

async function activateUser(userId: string) {
  const { error } = await supabase.functions.invoke('activate-user', {
    body: { userId },
  });
  if (error) {
    toast.error(`Erreur lors de l'activation: ${error.message}`);
    throw new Error(error.message);
  }
  toast.success("Utilisateur activé avec succès !");
}


export default function AdminRoles() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [featureUser, setFeatureUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const { data: users = [], isLoading, refetch } = useQuery<AuthUser[]>({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
  });

  const handleActivate = async (userId: string) => {
    setActivatingId(userId);
    try {
      await activateUser(userId);
      await refetch();
    } finally {
      setActivatingId(null);
    }
  };

  const handleModalClose = () => {
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u =>
    `${u.user_metadata.first_name || ""} ${u.user_metadata.last_name || ""} ${u.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/admin" className="text-amber-600 hover:underline">← Retour Admin</Link>
          <h1 className="text-3xl font-bold">Gestion des rôles utilisateurs</h1>
        </div>
        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Recherche par nom ou e-mail"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => refetch()} size="sm" variant="outline">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualiser'}
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : (
          <Card className="shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôles</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-medium">{u.user_metadata.first_name || ""} {u.user_metadata.last_name || ""}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                          {!u.confirmed_at && <Badge variant="destructive" className="mt-1">Non activé</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><RolesBadges userId={u.id} /></TableCell>
                    <TableCell className="text-center">
                      {!u.confirmed_at && (
                        <Button
                          size="sm"
                          className="mr-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleActivate(u.id)}
                          disabled={activatingId === u.id}
                        >
                          {activatingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activer'}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setSelectedUser({
                        id: u.id,
                        email: u.email,
                        first_name: u.user_metadata.first_name,
                        last_name: u.user_metadata.last_name,
                      })}>
                        Modifier rôles
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setFeatureUser(u)} className="ml-2">
                        <User className="mr-2 h-3 w-3" />
                        Fonctionnalités
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-400">Aucun utilisateur trouvé</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
        {selectedUser && (
          <RolesModal
            user={selectedUser}
            onClose={handleModalClose}
          />
        )}
        {featureUser && (
          <UserFeaturesModal
            user={featureUser}
            onClose={() => setFeatureUser(null)}
            onUpdate={refetch}
          />
        )}
      </div>
    </div>
  );
}
