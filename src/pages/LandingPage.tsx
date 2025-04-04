
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-tenerife-blue via-tenerife-blue/80 to-tenerife-green/60 opacity-90"></div>
        
        <div className="relative px-6 py-12 flex-1 flex flex-col justify-between z-10">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-2">Taxi Tenerife</h1>
              <p className="text-white/90">Tu transporte de confianza</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center my-8">
            <div className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/3f027f1c-4ee8-4827-b4ce-9d6d560d6b75.png" 
                  alt="Taxi Tenerife Logo" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>
            
            <div className="text-center mt-8 text-white">
              <h2 className="text-2xl font-semibold mb-3">Tu taxi en Puerto de la Cruz</h2>
              <p className="text-white/80 max-w-xs mx-auto">
                Servicio rápido, seguro y confiable en toda la isla de Tenerife
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/login")} 
              variant="default" 
              className="w-full bg-white text-tenerife-blue hover:bg-gray-100 h-12"
            >
              Solicitar un taxi
              <MapPin size={20} className="ml-2" />
            </Button>
            
            <Button 
              onClick={() => navigate("/login")} 
              variant="ghost" 
              className="w-full border-white text-white hover:bg-white/20 h-12"
            >
              Iniciar sesión
              <ArrowRight size={20} className="ml-2" />
            </Button>
            
            <p className="text-center text-white/80 text-sm mt-6">
              El servicio oficial de taxis de la isla de Tenerife
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
