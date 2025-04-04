
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsLoggedIn, setUser } = useAppContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError("Por favor complete todos los campos");
      setIsLoading(false);
      return;
    }
    
    // Simulate login process
    setTimeout(() => {
      // For demo purposes, accept any valid email format
      if (email.includes("@") && password.length >= 6) {
        // Set logged in state
        setIsLoggedIn(true);
        
        // Set mock user data
        setUser({
          id: "user-123",
          name: "Usuario",
          email: email,
          phone: "+34 612 345 678"
        });
        
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de nuevo",
        });
        
        // Redirect to home page
        navigate("/home");
      } else {
        setError("Correo electrónico o contraseña incorrectos");
      }
      setIsLoading(false);
    }, 800);
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
              <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Acceder a tu cuenta</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="email">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="password">
                      Contraseña
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-tenerife-blue hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </div>
              </form>
              
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
