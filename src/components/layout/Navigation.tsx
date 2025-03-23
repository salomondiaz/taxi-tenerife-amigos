
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, MapPin, Info, Settings } from "lucide-react";
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
      path: "/request-ride",
      icon: <MapPin size={24} />,
      ariaLabel: "Solicitar un taxi",
    },
    {
      name: "Perfil",
      path: "/profile",
      icon: <User size={24} />,
      ariaLabel: "Ver mi perfil",
    },
  ];

  return (
    <nav className={`${darkMode ? "bg-gray-900" : "bg-white"} border-t border-gray-200 fixed bottom-0 w-full z-50 shadow-lg`}>
      <div className="max-w-md mx-auto px-4">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <button
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full py-3 focus:outline-none ${
                  location.pathname === item.path
                    ? `text-tenerife-blue ${darkMode ? "bg-gray-800" : "bg-blue-50"}`
                    : `text-gray-500 ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`
                } transition-colors duration-200 rounded-lg`}
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
