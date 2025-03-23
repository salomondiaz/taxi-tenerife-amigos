
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Usuario intentó acceder a una ruta inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <MapPin size={32} className="text-tenerife-blue" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">¡Oops! Página no encontrada</p>
        <p className="text-gray-500 mb-8">
          La página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>
        
        <Button 
          onClick={() => navigate("/")}
          variant="primary" 
          size="lg" 
          fullWidth
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
