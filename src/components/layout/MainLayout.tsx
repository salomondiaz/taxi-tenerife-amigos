
import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import Navigation from "./Navigation";

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  hideNavigation?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  requireAuth = false,
  hideNavigation = false,
  className = "",
}) => {
  const { isLoggedIn, darkMode, highContrast } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, requireAuth, navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "dark" : ""
      } ${
        highContrast ? "contrast-125 brightness-125" : ""
      }`}
    >
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {!hideNavigation && (
        <Navigation />
      )}
    </div>
  );
};

export default MainLayout;
