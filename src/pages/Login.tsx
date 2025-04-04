
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simular inicio de sesión y redirigir a la página principal
    navigate("/home");
  };

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
              <p className="text-white/90">Iniciar sesión</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center my-8">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 mb-6">
              <UserCircle size={50} className="text-white" />
            </div>
            
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Acceder a tu cuenta</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleLogin} 
                    variant="default" 
                    className="w-full bg-tenerife-blue hover:bg-blue-700"
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button 
                  onClick={() => navigate("/")} 
                  variant="ghost" 
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Volver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
