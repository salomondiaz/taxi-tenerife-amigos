
import React from "react";
import { MapPin, Navigation, Home, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
import FavoriteLocations from "./FavoriteLocations";
import { MapCoordinates } from "@/components/map/types";

interface LocationSelectorProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  useManualSelection: boolean;
  setUseManualSelection: (value: boolean) => void;
  handleUseCurrentLocation: () => void;
  originCoords?: MapCoordinates | null;
  onSelectLocation?: (coordinates: MapCoordinates, address?: string) => void;
}

const HOME_ADDRESS_KEY = 'home_address';
const HOME_LOCATION_KEY = 'user_home_location';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  useManualSelection,
  setUseManualSelection,
  handleUseCurrentLocation,
  originCoords,
  onSelectLocation
}) => {
  const toggleSelectionMode = () => {
    setUseManualSelection(!useManualSelection);
    
    if (useManualSelection) {
      toast({
        title: "Modo de selección en el mapa desactivado",
        description: "Ahora debes introducir las direcciones manualmente",
      });
    } else {
      toast({
        title: "Modo de selección en el mapa activado",
        description: "Ahora puedes hacer clic en el mapa para seleccionar origen y destino",
      });
    }
  };

  const saveHomeAddress = () => {
    if (origin) {
      localStorage.setItem(HOME_ADDRESS_KEY, origin);
      
      // Verificar si tenemos coordenadas en homeLocation (para compatibilidad)
      const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
      if (!homeLocationJSON) {
        // Si no hay coordenadas guardadas, mostrar mensaje informativo
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
  };

  const useHomeAddress = () => {
    // Intentar obtener primero de HOME_LOCATION_KEY (nuevo sistema)
    const homeLocationJSON = localStorage.getItem(HOME_LOCATION_KEY);
    if (homeLocationJSON) {
      try {
        const homeLocation = JSON.parse(homeLocationJSON);
        if (homeLocation.address) {
          setOrigin(homeLocation.address);
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
        console.error("Error parsing home location:", error);
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
  };

  const handleSelectFavoriteLocation = (coordinates: MapCoordinates, address?: string) => {
    if (onSelectLocation) {
      onSelectLocation(coordinates, address);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">¿Cómo quieres indicar las ubicaciones?</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Button
            variant={useManualSelection ? "default" : "outline"}
            className={`w-full flex items-center justify-center ${useManualSelection ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
            onClick={() => setUseManualSelection(true)}
          >
            <MapPin size={18} className="mr-2" />
            Seleccionar en el mapa
          </Button>
          
          <Button
            variant={!useManualSelection ? "default" : "outline"}
            className={`w-full flex items-center justify-center ${!useManualSelection ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
            onClick={() => setUseManualSelection(false)}
          >
            <Navigation size={18} className="mr-2" />
            Introducir direcciones
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleUseCurrentLocation}
          >
            <Target size={18} className="mr-2" />
            Usar mi ubicación
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={useHomeAddress}
          >
            <Home size={18} className="mr-2" />
            Usar mi casa
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={saveHomeAddress}
          >
            <Home size={18} className="mr-2" />
            Guardar como mi casa
          </Button>
        </div>
        
        {!useManualSelection && (
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  Punto de recogida
                </label>
                <Input
                  id="origin"
                  type="text"
                  placeholder="¿Dónde te recogemos? (especifica 'Tenerife' en la dirección)"
                  className="w-full"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <Navigation size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destino
                </label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="¿A dónde vas? (especifica 'Tenerife' en la dirección)"
                  className="w-full"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ubicaciones favoritas */}
      <FavoriteLocations 
        origin={originCoords} 
        currentCoordinates={originCoords}
        onSelectLocation={handleSelectFavoriteLocation}
      />
    </div>
  );
};

export default LocationSelector;
