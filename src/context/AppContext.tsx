
import React, { createContext, useContext, useState, ReactNode } from "react";

// Definir tipos para los objetos de datos
type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  consentTimestamp?: Date;
  isTestUser?: boolean;
};

type Ride = {
  id: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination?: {
    address: string;
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  requestTime: Date;
  price?: number;
  distance?: number;
  driver?: Driver;
};

type Driver = {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
  rating: number;
  isAvailable: boolean;
  profilePicture?: string;
  isTestDriver?: boolean;
};

type Location = {
  lat: number;
  lng: number;
  address?: string;
};

// Definir el tipo para el contexto
interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentRide: Ride | null;
  setCurrentRide: React.Dispatch<React.SetStateAction<Ride | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  currentLocation: Location | null;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Location | null>>;
  testMode: boolean;
  setTestMode: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  language: "es" | "en";
  setLanguage: React.Dispatch<React.SetStateAction<"es" | "en">>;
  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el contexto con un valor predeterminado
const AppContext = createContext<AppContextType | undefined>(undefined);

// Proveedor del contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [testMode, setTestMode] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const value = {
    user,
    setUser,
    currentRide,
    setCurrentRide,
    isLoading,
    setIsLoading,
    isLoggedIn,
    setIsLoggedIn,
    currentLocation,
    setCurrentLocation,
    testMode,
    setTestMode,
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    highContrast,
    setHighContrast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider");
  }
  return context;
};
