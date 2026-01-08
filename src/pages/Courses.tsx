
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceList from "@/components/ServiceList";
import CourseList from "@/components/CourseList";
import { Card } from "@/components/ui/card";

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gestion des Courses & Prestations</h1>
        {/* Services disponibles */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-2">Prestations proposées</h2>
          <p className="mb-4 text-gray-500 text-sm">
            Liste des services activés, sélectionnables lors de la création d’une nouvelle livraison.
          </p>
          <ServiceList />
        </Card>
        {/* Mes courses */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-2">Mes courses</h2>
          <CourseList />
        </Card>
      </main>
      <Footer />
    </div>
  );
};
export default CoursesPage;
