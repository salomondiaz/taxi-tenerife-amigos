
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, setTestMode, testMode } = useAppContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Limpiar el error relacionado con este campo
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggleTestMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestMode(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulación de login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (testMode) {
        // En modo de prueba, iniciar sesión con usuario de prueba
        setUser({
          id: "test-user-1",
          name: "Usuario de Prueba",
          email: formData.email,
          isTestUser: true,
        });
        
        toast({
          title: "Modo de prueba activado",
          description: "Has iniciado sesión como usuario de prueba",
        });
      } else {
        // En un caso real, aquí iría la integración con Firebase Auth
        // Por ahora simulamos un inicio de sesión exitoso
        setUser({
          id: "user-1",
          name: "Usuario",
          email: formData.email,
        });
      }
      
      setIsLoggedIn(true);
      navigate("/home");
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavigation className="bg-gray-50">
      <div className="min-h-screen p-6 flex flex-col">
        <button
          onClick={() => navigate("/")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <div className="my-8">
          <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido de nuevo, ingresa tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            icon={<Mail size={20} className="text-gray-400" />}
          />

          <FormInput
            id="password"
            name="password"
            type="password"
            label="Contraseña"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
            aria-describedby={errors.password ? "password-error" : undefined}
            icon={<Lock size={20} className="text-gray-400" />}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded border-gray-300 text-tenerife-blue focus:ring-tenerife-blue"
              />
              <span>Recordarme</span>
            </label>

            <a
              href="#"
              className="text-sm text-tenerife-blue hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div className="mt-6 py-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              fullWidth
            >
              Iniciar Sesión
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-tenerife-blue hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Modo de prueba</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={testMode}
                onChange={handleToggleTestMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tenerife-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tenerife-blue"></div>
            </label>
          </div>
          {testMode && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
              <AlertCircle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                El modo de prueba está activo. Este modo simula el comportamiento de la aplicación con datos ficticios.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
