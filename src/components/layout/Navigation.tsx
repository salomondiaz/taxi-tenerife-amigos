
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, MapPin, History, Settings } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useAppContext();

  // Definir las rutas de navegación
  const navItems = [
    {
      name: "Inicio",
      path: "/home",
      icon: <Home size={24} />,
      ariaLabel: "Ir a la página de inicio",
    },
    {
      name: "Solicitar",
      path: "/solicitar",
      icon: <MapPin size={24} />,
      ariaLabel: "Solicitar un taxi",
    },
    {
      name: "Historial",
      path: "/historial",
      icon: <History size={24} />,
      ariaLabel: "Ver historial de viajes",
    },
    {
      name: "Ajustes",
      path: "/ajustes",
      icon: <Settings size={24} />,
      ariaLabel: "Ver ajustes",
    },
    {
      name: "Perfil",
      path: "/perfil",
      icon: <User size={24} />,
      ariaLabel: "Ver mi perfil",
    },
  ];

  // Handle navigation with prevention of current location re-navigation
  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <nav className={`${darkMode ? "bg-gray-900" : "bg-white"} border-t border-gray-200 fixed bottom-0 w-full z-50 shadow-lg`}>
      <div className="max-w-md mx-auto px-2">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center w-full py-3 px-1 focus:outline-none ${
                  location.pathname === item.path
                    ? `text-tenerife-blue ${darkMode ? "bg-gray-800" : "bg-blue-50"}`
                    : `text-gray-500 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`
                } transition-colors duration-200 rounded-lg text-xs`}
                aria-label={item.ariaLabel}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
