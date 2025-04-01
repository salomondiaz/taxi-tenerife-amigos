
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";

// Keys for local storage
export const HOME_ADDRESS_KEY = 'home_address';
export const HOME_LOCATION_KEY = 'user_home_location';

export const useHomeAddressManager = () => {
  const { toast } = useToast();

  const saveHomeAddress = useCallback((origin: string) => {
    if (origin) {
      localStorage.setItem(HOME_ADDRESS_KEY, origin);
      
      // Verify if we have coordinates in homeLocation (for compatibility)
      const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
      if (!homeLocationJSON) {
        toast({
          title: "Dirección guardada",
          description: "Para guardar la ubicación exacta, usa la opción 'Guardar como Mi Casa' en el mapa",
        });
      } else {
        toast({
          title: "Dirección guardada",
          description: "Tu casa ha sido guardada correctamente",
        });
      }
    } else {
      toast({
        title: "No hay dirección para guardar",
        description: "Por favor, introduce primero una dirección de origen o selecciónala en el mapa",
        variant: "destructive",
      });
    }
  }, [toast]);

  const useHomeAddress = useCallback((setOrigin: (value: string) => void, handleOriginChange: (coords: MapCoordinates) => void) => {
    // Intentar obtener primero de HOME_LOCATION_KEY (nuevo sistema)
    const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
    if (homeLocationJSON) {
      try {
        const homeLocation = JSON.parse(homeLocationJSON);
        if (homeLocation.address) {
          setOrigin(homeLocation.address);
          if (homeLocation.lat && homeLocation.lng) {
            handleOriginChange({
              lat: homeLocation.lat,
              lng: homeLocation.lng,
              address: homeLocation.address
            });
          }
          toast({
            title: "Dirección de casa cargada",
            description: "Se ha establecido tu casa como punto de origen",
          });
          
          // Forzar actualización del componente
          setTimeout(() => {
            const homeAddressEvent = new CustomEvent('home-address-used');
            window.dispatchEvent(homeAddressEvent);
          }, 100);
          return;
        }
      } catch (error) {
        console.error("Error al procesar ubicación de casa:", error);
      }
    }
    
    // Si no hay datos en el nuevo sistema o no tienen dirección, usar el antiguo
    const homeAddress = localStorage.getItem(HOME_ADDRESS_KEY);
    if (homeAddress) {
      setOrigin(homeAddress);
      toast({
        title: "Dirección de casa cargada",
        description: "Se ha establecido tu casa como punto de origen",
      });
      
      // Forzar actualización del componente
      setTimeout(() => {
        const homeAddressEvent = new CustomEvent('home-address-used');
        window.dispatchEvent(homeAddressEvent);
      }, 100);
    } else {
      toast({
        title: "No hay dirección guardada",
        description: "Aún no has guardado ninguna dirección como tu casa",
        variant: "destructive",
      });
    }
  }, [toast]);

  return { saveHomeAddress, useHomeAddress };
};
