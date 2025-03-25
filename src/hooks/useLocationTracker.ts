
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";

export const useLocationTracker = (initialDestination?: string) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  
  // Establecer destino si viene de la página de inicio
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
      // Si tenemos un destino predefinido, establecemos un origen de ejemplo
      if (!origin) {
        setOrigin("Tu ubicación actual");
      }
    }
  }, [initialDestination, origin]);
  
  // Escuchar evento personalizado para forzar actualización
  useEffect(() => {
    const handleHomeAddressUsed = () => {
      console.log("Home address used event detected");
    };
    
    window.addEventListener('home-address-used', handleHomeAddressUsed);
    
    return () => {
      window.removeEventListener('home-address-used', handleHomeAddressUsed);
    };
  }, []);
  
  const handleUseCurrentLocation = async () => {
    try {
      if (navigator.geolocation) {
        toast({
          title: "Obteniendo ubicación",
          description: "Por favor, espere mientras obtenemos su ubicación actual...",
        });
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            console.log("Current location obtained:", coords);
            
            // Intentar obtener la dirección
            const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
            if (apiKey) {
              fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${apiKey}&limit=1&language=es`
              )
                .then(response => response.json())
                .then(data => {
                  if (data.features && data.features.length > 0) {
                    const address = data.features[0].place_name;
                    setOrigin(address);
                    console.log("Address found for current location:", address);
                  } else {
                    setOrigin("Ubicación actual");
                  }
                })
                .catch(error => {
                  console.error("Error al obtener dirección:", error);
                  setOrigin("Ubicación actual");
                });
            } else {
              setOrigin("Ubicación actual");
            }
            
            toast({
              title: "Ubicación actual establecida",
              description: "Se ha establecido su ubicación actual como punto de origen",
            });
          },
          (error) => {
            console.error("Error al obtener ubicación:", error);
            toast({
              title: "Error de ubicación",
              description: "No pudimos acceder a su ubicación. Por favor, asegúrese de haber concedido permisos de ubicación.",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "Error de ubicación",
          description: "Su navegador no soporta geolocalización",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al usar ubicación actual:", error);
      toast({
        title: "Error de ubicación",
        description: "Ocurrió un error al intentar obtener su ubicación actual",
        variant: "destructive",
      });
    }
  };
  
  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    handleUseCurrentLocation
  };
};
