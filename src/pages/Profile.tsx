import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Settings, LogOut, Moon, Sun, Eye, Languages } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn, darkMode, setDarkMode, language, setLanguage, highContrast, setHighContrast } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const handleLanguageChange = (newLanguage: "es" | "en") => {
    setLanguage(newLanguage);
  };

  return (
    <MainLayout requireAuth>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <UserIcon size={48} className="text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ajustes</h3>
              <ul className="space-y-2">
                <li>
                  <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Settings size={20} className="text-gray-500" />
                      <span>Configuración General</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </li>
                <li>
                  <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Languages size={20} className="text-gray-500" />
                      <span>Idioma</span>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as "es" | "en")}
                      className="bg-transparent border-none outline-none text-gray-800"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {darkMode ? (
                        <Sun size={20} className="text-gray-500" />
                      ) : (
                        <Moon size={20} className="text-gray-500" />
                      )}
                      <span>Modo {darkMode ? 'Claro' : 'Oscuro'}</span>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </button>
                </li>
                <li>
                  <button
                    onClick={toggleHighContrast}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Eye size={20} className="text-gray-500" />
                      <span>Alto Contraste</span>
                    </div>
                    <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react";

export default Profile;
