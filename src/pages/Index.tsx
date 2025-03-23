
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

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
          <div className="flex-1 flex flex-col items-center justify-center my-8 animate-fade-in">
            <div className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full h-full bg-white/30 rounded-full flex items-center justify-center">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.707 15.293l-3-3a1 1 0 0 0-1.414 0L17 12.586V10a6 6 0 0 0-6-6H7.414l1.293-1.293a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 0 0 0 1.414l3 3a1 1 0 0 0 1.414-1.414L7.414 6H11a4 4 0 0 1 4 4v2.586l-.293-.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l3-3a1 1 0 0 0 0-1.414z"/>
                  <path d="M18 16.01L6 16l-.73 1.5c-.23.47-.14 1.03.23 1.41.36.37.91.51 1.41.29l2.78-1.11 2.78 1.11c.15.06.31.09.47.09.35 0 .68-.14.94-.38.36-.37.46-.94.24-1.4L14 16v-5c0-1.65 1.35-3 3-3h1c.55 0 1-.45 1-1s-.45-1-1-1h-1c-2.76 0-5 2.24-5 5v4.59l-5.29-5.3a.996.996 0 1 0-1.41 1.41l6 6c.18.2.43.3.7.3h5c1.1 0 2 .9 2 2v1"/>
                </svg>
              </div>
            </div>
            
            <div className="text-center mt-8 text-white">
              <h2 className="text-2xl font-semibold mb-3">Tu taxi en Puerto de la Cruz, La Orotava e Icod de los Vinos</h2>
              <p className="text-white/80 max-w-xs mx-auto">
                Servicio rápido, seguro y confiable en toda la isla de Tenerife
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 animate-slide-up">
            <Button 
              onClick={() => navigate("/login")} 
              variant="default" 
              className="w-full bg-white text-tenerife-blue hover:bg-gray-100 h-12"
            >
              Iniciar Sesión
              <ArrowRight size={20} />
            </Button>
            
            <Button 
              onClick={() => navigate("/register")} 
              variant="ghost" 
              className="w-full border-white text-white hover:bg-white/20 h-12"
            >
              Registrarse
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

export default Index;
