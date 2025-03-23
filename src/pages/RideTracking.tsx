
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RideTracking = () => {
  const navigate = useNavigate();

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-4">Seguimiento de viaje</h1>
        
        <div className="text-center py-12">
          <p className="text-gray-600">Esta página está en desarrollo</p>
          <p className="text-sm text-gray-500 mt-2">
            Aquí implementaremos la funcionalidad para seguir el progreso de tu viaje
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RideTracking;
