
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useCourses } from "@/hooks/useCourses";

const statusLabel: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  completed: "Terminée",
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { courses, isLoading } = useCourses();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-8 text-center">Chargement de la course…</div>;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4">Course introuvable.</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col">
      <main className="flex-1 max-w-xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <div className="mb-4 flex gap-2 items-center">
            <Link to="/courses" className="text-blue-500 underline text-sm">
              ← Retour aux courses
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-2">Détail de la course</h1>
          <div className="text-gray-700 mb-2">
            <strong>ID :</strong> <span>{course.id}</span>
          </div>
          <div className="text-gray-700 mb-2">
            <strong>Statut :</strong> <span>{statusLabel[course.status] || course.status}</span>
          </div>
          <div className="text-gray-500 mb-2 text-sm">
            <span>Créée le {new Date(course.created_at).toLocaleString()}</span>
          </div>
          <div>
            <strong>Identifiant livraison :</strong> {course.delivery_id}
          </div>
          <div>
            <strong>Service :</strong> {course.service_id ?? "N/A"}
          </div>
          <div>
            <strong>Livreur :</strong> {course.driver_id ?? "Aucun"}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CourseDetail;
