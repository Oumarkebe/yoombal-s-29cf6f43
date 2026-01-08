
import React from "react";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Badge } from "@/components/ui/badge";

export function RolesBadges({ userId }: { userId: string }) {
  const { roles, isLoading } = useUserRoles({ userId });
  if (isLoading) return <Badge className="bg-gray-100 text-gray-400">...</Badge>;
  return (
    <div className="flex gap-1 flex-wrap">
      {roles.length === 0 && <span className="text-gray-400 text-xs">Aucun</span>}
      {roles.map(r => (
        <Badge key={r.id} className="bg-purple-100 text-purple-700 border-purple-300">{r.role}</Badge>
      ))}
    </div>
  );
}
