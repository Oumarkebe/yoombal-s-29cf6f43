
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, User, Shield, Search, UserX, CheckCircle, Ban, Settings } from "lucide-react";
import { UserDetailModal } from './UserDetailModal';
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    status?: 'active' | 'suspended' | 'blocked' | 'pending';
    created_at?: string;
    avatar_url?: string;
}

const fetchProfiles = async (): Promise<Profile[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Attempt to fetch emails from a secure view or metadata if available
    // For now, we assume profile has an 'email' field or we fallback gracefully
    return (data as any) || [];
};

export function UserManagementTable() {
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-profiles'],
        queryFn: fetchProfiles,
    });

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        setUpdatingId(userId);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', userId);

            if (error) throw error;

            toast.success(`Statut mis à jour : ${newStatus}`);
            refetch();
        } catch (error: any) {
            toast.error(`Erreur : ${error.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleManageUser = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        (user.first_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.last_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.role?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
            case 'suspended':
                return <Badge className="bg-orange-500 hover:bg-orange-600">Suspendu</Badge>;
            case 'blocked':
                return <Badge variant="destructive">Bloqué</Badge>;
            default:
                return <Badge variant="secondary">{status || 'Inconnu'}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Gestion des Utilisateurs
                </h2>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Inscription</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2 text-gray-500">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Chargement...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    Aucun utilisateur trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar_url || ""} />
                                                <AvatarFallback>{(user.first_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                    {user.id.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {user.role || "user"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(user.status)}
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleManageUser(user.id)} className="cursor-pointer">
                                                    <Settings className="mr-2 h-4 w-4" /> Gérer le compte
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(user.id, 'active')}
                                                    disabled={user.status === 'active'}
                                                >
                                                    Activer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(user.id, 'suspended')}
                                                    disabled={updatingId === user.id || user.status === 'suspended'}
                                                    className="text-orange-600 focus:text-orange-700"
                                                >
                                                    <UserX className="mr-2 h-4 w-4" /> Suspendre
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(user.id, 'blocked')}
                                                    disabled={updatingId === user.id || user.status === 'blocked'}
                                                    className="text-red-600 focus:text-red-700"
                                                >
                                                    <Ban className="mr-2 h-4 w-4" /> Bloquer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserDetailModal
                userId={selectedUserId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
