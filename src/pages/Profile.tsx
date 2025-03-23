
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { User, Mail, Phone, LogOut, Sun, Moon, EyeOff, Eye, Languages, AlertTriangle, Settings as SettingsIcon } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { 
    user, 
    setUser, 
    setIsLoggedIn, 
    testMode, 
    setTestMode,
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    highContrast,
    setHighContrast
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "data">("profile");
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setUser({
        ...user!,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || undefined,
      });
      
      setEditing(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      setIsLoading(true);
      
      try {
        // Simulación de eliminación
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
        
        toast({
          title: "Cuenta eliminada",
          description: "Tu cuenta ha sido eliminada correctamente",
        });
      } catch (error) {
        toast({
          title: "Error al eliminar cuenta",
          description: "No se pudo eliminar la cuenta. Intenta nuevamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = () => {
    // Crear un objeto con todos los datos del usuario
    const userData = {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        consentTimestamp: user?.consentTimestamp,
      },
      // Aquí se pueden añadir más datos como historial de viajes, etc.
    };
    
    // Convertir a JSON y crear un blob
    const jsonData = JSON.stringify(userData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    
    // Crear un enlace para descargar
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mis-datos-taxi-tenerife.json";
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    toast({
      title: "Datos exportados",
      description: "Tus datos han sido exportados correctamente",
    });
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="bg-tenerife-blue text-white px-6 pt-12 pb-6">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-white/80 text-sm mt-1">
            Gestiona tu información personal y ajustes
          </p>
        </div>
        
        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="flex">
            {[
              { id: "profile", label: "Perfil", icon: <User size={16} /> },
              { id: "settings", label: "Ajustes", icon: <SettingsIcon size={16} /> },
              { id: "data", label: "Mis Datos", icon: <EyeOff size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-2 flex flex-col items-center text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-tenerife-blue border-b-2 border-tenerife-blue"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                <span className="mt-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Información Personal
                </h2>
                {!editing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setProfileData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
              
              {editing ? (
                <div className="space-y-4">
                  <FormInput
                    id="name"
                    name="name"
                    label="Nombre"
                    value={profileData.name}
                    onChange={handleChange}
                    icon={<User size={18} className="text-gray-400" />}
                  />
                  
                  <FormInput
                    id="email"
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    icon={<Mail size={18} className="text-gray-400" />}
                  />
                  
                  <FormInput
                    id="phone"
                    name="phone"
                    label="Teléfono (opcional)"
                    value={profileData.phone}
                    onChange={handleChange}
                    icon={<Phone size={18} className="text-gray-400" />}
                  />
                  
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      isLoading={isLoading}
                      fullWidth
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="mr-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Foto de perfil"
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={32} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user?.name}</h3>
                      <p className="text-sm text-gray-500">{user?.isTestUser ? "Usuario de prueba" : "Usuario"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-5 border-b">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nombre</p>
                            <p className="mt-1">{user?.name}</p>
                          </div>
                          <User size={20} className="text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="px-4 py-5 border-b">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Correo electrónico</p>
                            <p className="mt-1">{user?.email}</p>
                          </div>
                          <Mail size={20} className="text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="px-4 py-5">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Teléfono</p>
                            <p className="mt-1">{user?.phone || "-"}</p>
                          </div>
                          <Phone size={20} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      leftIcon={<LogOut size={18} />}
                      fullWidth
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "settings" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Ajustes de la aplicación
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3">
                          {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                          <p className="font-medium">Modo oscuro</p>
                          <p className="text-sm text-gray-500">Cambia la apariencia de la aplicación</p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tenerife-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tenerife-blue"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="px-4 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3">
                          <AlertTriangle size={20} />
                        </div>
                        <div>
                          <p className="font-medium">Alto contraste</p>
                          <p className="text-sm text-gray-500">Mejora la visibilidad de los elementos</p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={highContrast}
                          onChange={() => setHighContrast(!highContrast)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tenerife-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tenerife-blue"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="px-4 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3">
                          <Languages size={20} />
                        </div>
                        <div>
                          <p className="font-medium">Idioma</p>
                          <p className="text-sm text-gray-500">Cambia el idioma de la aplicación</p>
                        </div>
                      </div>
                      
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as "es" | "en")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-tenerife-blue focus:border-tenerife-blue p-2.5"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-lg mr-3">
                          <div className="text-lg">🧪</div>
                        </div>
                        <div>
                          <p className="font-medium">Modo de prueba</p>
                          <p className="text-sm text-gray-500">Activar datos de prueba</p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                          checked={testMode}
                          onChange={() => setTestMode(!testMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tenerife-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tenerife-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "data" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Gestión de Datos Personales
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-medium mb-3">Tus derechos RGPD</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes
                    derecho a acceder, rectificar y eliminar tus datos personales.
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      fullWidth
                      leftIcon={<Eye size={18} />}
                      onClick={handleExportData}
                    >
                      Exportar mis datos
                    </Button>
                    
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={handleDeleteAccount}
                      isLoading={isLoading}
                    >
                      Eliminar mi cuenta
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <h3 className="font-medium mb-2">Información adicional</h3>
                  <p className="text-sm text-gray-600">
                    Fecha de consentimiento: {user?.consentTimestamp 
                      ? new Date(user.consentTimestamp).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) 
                      : "No disponible"}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Para más información sobre cómo tratamos tus datos, consulta nuestra{" "}
                    <a href="#" className="text-tenerife-blue hover:underline">
                      política de privacidad
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
