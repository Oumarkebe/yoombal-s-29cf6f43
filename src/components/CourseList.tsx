
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useCourses } from "@/hooks/useCourses";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import CourseForm from "./CourseForm";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminée",
};

const CourseList = () => {
  const { courses, isLoading, addCourse, updateCourse, deleteCourse } = useCourses();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("admin");
  const [editing, setEditing] = useState<{ id: string; mode: "edit" | "new" } | null>(null);

  if (isLoading) return <div>Chargement des courses…</div>;
  if (!courses.length) return <div>Aucune course pour l’instant.</div>;

  return (
    <div>
      {(isAdmin) && (
        <div className="mb-4">
          <Button onClick={() => setEditing({ id: "", mode: "new" })}>Ajouter une course</Button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-gray-500">
                  {statusLabel[c.status] || c.status}
                </div>
                <div className="font-bold text-lg mb-1">{c.id.slice(0, 8)}</div>
                <div className="text-xs text-gray-400">
                  Créée le {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
              <Link to={`/courses/${c.id}`} className="text-blue-600 underline">
                Détails
              </Link>
            </div>
            {(isAdmin) && (
              <div className="absolute right-3 top-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing({ id: c.id, mode: "edit" })}>
                  Éditer
                </Button>
                <Button size="sm" variant="destructive" onClick={async () => {
                  try {
                    await deleteCourse.mutateAsync(c.id);
                    toast.success("Course supprimée");
                  } catch {
                    toast.error("Erreur lors de la suppression");
                  }
                }}>
                  Supprimer
                </Button>
              </div>
            )}
            {editing && editing.id === c.id && editing.mode === "edit" && (
              <CourseForm
                course={c}
                mode="edit"
                onClose={() => setEditing(null)}
                onSubmit={async (formData) => {
                  try {
                    await updateCourse.mutateAsync({ ...formData, id: c.id });
                    toast.success("Course modifiée !");
                    setEditing(null);
                  } catch {
                    toast.error("Erreur modification");
                  }
                }}
              />
            )}
          </Card>
        ))}
      </div>
      {(editing && editing.mode === "new") && (
        <CourseForm
          course={{ delivery_id: "", status: "pending" }}
          mode="new"
          onClose={() => setEditing(null)}
          onSubmit={async (formData) => {
            try {
              await addCourse.mutateAsync(formData);
              toast.success("Course ajoutée !");
              setEditing(null);
            } catch {
              toast.error("Erreur création");
            }
          }}
        />
      )}
    </div>
  );
};

export default CourseList;
