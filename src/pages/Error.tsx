
import React from "react";
import { useRouteError } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Error inesperado</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, ha ocurrido un error inesperado.
        </p>
        <p className="text-sm text-gray-500 mb-8 p-4 bg-gray-100 rounded overflow-auto">
          {error.statusText || error.message || "Error desconocido"}
        </p>
        
        <Link to="/">
          <Button 
            variant="default" 
            className="w-full" 
          >
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
