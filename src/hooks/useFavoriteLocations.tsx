
import { useState, useEffect } from "react";
import { MapCoordinates } from "@/components/map/types";

// Tipos para ubicaciones favoritas
export interface FavoriteLocation {
  id: string;
  name: string | null;
  type: "home" | "work" | "favorite";
  coordinates: MapCoordinates;
  createdAt: Date;
}

// Clave para almacenar las ubicaciones en localStorage
const FAVORITE_LOCATIONS_KEY = "taxi-tenerife-favorite-locations";

export const useFavoriteLocations = () => {
  // Estado para las ubicaciones favoritas
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);

  // Cargar ubicaciones al iniciar
  useEffect(() => {
    const storedLocations = localStorage.getItem(FAVORITE_LOCATIONS_KEY);
    if (storedLocations) {
      try {
        setFavoriteLocations(JSON.parse(storedLocations));
      } catch (error) {
        console.error("Error parsing favorite locations from localStorage:", error);
        // Si hay un error, iniciar con un array vacío
        setFavoriteLocations([]);
      }
    }
  }, []);

  // Guardar ubicaciones cuando cambian
  useEffect(() => {
    if (favoriteLocations.length > 0) {
      localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(favoriteLocations));
    }
  }, [favoriteLocations]);

  // Agregar una nueva ubicación favorita
  const addFavoriteLocation = (
    coordinates: MapCoordinates,
    type: "home" | "work" | "favorite" = "favorite",
    name: string | null = null
  ) => {
    // Generar un ID único
    const id = Date.now().toString();
    
    // Crear la nueva ubicación
    const newLocation: FavoriteLocation = {
      id,
      name,
      type,
      coordinates,
      createdAt: new Date()
    };
    
    // Actualizar el estado
    setFavoriteLocations((prevLocations) => {
      // Si ya existe una ubicación de ese tipo y queremos que sea única
      if (type === "home" || type === "work") {
        // Filtrar ubicaciones del mismo tipo
        const sameName = prevLocations.filter(loc => 
          loc.name === name && loc.type === type
        );
        
        // Si ya existe una ubicación con el mismo nombre, actualizarla
        if (sameName.length > 0) {
          return prevLocations.map(loc => 
            (loc.name === name && loc.type === type) ? newLocation : loc
          );
        }
      }
      
      // Caso general: añadir a la lista
      return [...prevLocations, newLocation];
    });
    
    return id;
  };

  // Eliminar una ubicación favorita
  const removeFavoriteLocation = (id: string) => {
    setFavoriteLocations((prevLocations) => 
      prevLocations.filter(loc => loc.id !== id)
    );
  };

  // Obtener ubicación por tipo (ej: casa, trabajo)
  const getLocationByType = (type: "home" | "work" | "favorite"): FavoriteLocation | null => {
    const locations = favoriteLocations.filter(loc => loc.type === type);
    return locations.length > 0 ? locations[0] : null;
  };
  
  // Obtener todas las ubicaciones de un tipo específico
  const getLocationsByType = (type: "home" | "work" | "favorite"): FavoriteLocation[] => {
    return favoriteLocations.filter(loc => loc.type === type);
  };
  
  // Obtener ubicación por ID
  const getLocationById = (id: string): FavoriteLocation | null => {
    const location = favoriteLocations.find(loc => loc.id === id);
    return location || null;
  };

  // Actualizar una ubicación existente
  const updateFavoriteLocation = (
    id: string,
    updates: Partial<FavoriteLocation>
  ) => {
    setFavoriteLocations((prevLocations) =>
      prevLocations.map(loc =>
        loc.id === id ? { ...loc, ...updates } : loc
      )
    );
  };

  return {
    favoriteLocations,
    addFavoriteLocation,
    removeFavoriteLocation,
    getLocationByType,
    getLocationsByType,
    getLocationById,
    updateFavoriteLocation
  };
};
