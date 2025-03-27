
import React from "react";
import { MapPin, Navigation, Home, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";
import FavoriteLocations from "./FavoriteLocations";
import { MapCoordinates } from "@/components/map/types";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";

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
  googleMapsApiKey?: string;
  onPlaceSelected?: (coordinates: MapCoordinates) => void;
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
  onSelectLocation,
  googleMapsApiKey,
  onPlaceSelected
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
  
  const handleOriginPlaceSelected = (coordinates: MapCoordinates) => {
    if (onSelectLocation) {
      onSelectLocation(coordinates, coordinates.address);
    }
    if (onPlaceSelected) {
      onPlaceSelected(coordinates);
    }
  };
  
  const handleDestinationPlaceSelected = (coordinates: MapCoordinates) => {
    // Solo para el destino, no necesitamos actualizar la ubicación guardada
    setDestination(coordinates.address || "");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">¿De dónde a dónde vas?</h2>
        
        {/* Home location options - prominently at the top */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-blue-50 p-3 rounded-lg">
          <Button
            variant="default"
            className="w-full flex items-center justify-center bg-tenerife-blue hover:bg-tenerife-blue/90"
            onClick={useHomeAddress}
          >
            <Home size={18} className="mr-2" />
            Usar mi casa como origen
          </Button>
          
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={saveHomeAddress}
          >
            <Home size={18} className="mr-2" />
            Guardar esta dirección como mi casa
          </Button>
        </div>
        
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
        
        {!useManualSelection && googleMapsApiKey && (
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <GooglePlacesAutocomplete
                  label="Punto de recogida"
                  placeholder="¿Dónde te recogemos? (especifica 'Tenerife' en la dirección)"
                  value={origin}
                  onChange={setOrigin}
                  onPlaceSelected={handleOriginPlaceSelected}
                  apiKey={googleMapsApiKey}
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <Navigation size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <GooglePlacesAutocomplete
                  label="Destino"
                  placeholder="¿A dónde vas? (especifica 'Tenerife' en la dirección)"
                  value={destination}
                  onChange={setDestination}
                  onPlaceSelected={handleDestinationPlaceSelected}
                  apiKey={googleMapsApiKey}
                />
              </div>
            </div>
          </div>
        )}
        
        {!useManualSelection && !googleMapsApiKey && (
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

        {useManualSelection && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium mb-2 text-blue-800">Instrucciones para selección en el mapa:</p>
            <ul className="text-sm text-blue-700 list-disc list-inside">
              <li>Haz <strong>doble clic</strong> en el mapa para marcar el origen (marcador azul)</li>
              <li>Usa los botones del mapa para cambiar entre selección de origen y destino</li>
              <li>Para destino, haz <strong>doble clic</strong> en el mapa (marcador rojo)</li>
              <li>Tu casa aparecerá marcada con un icono de casa verde</li>
            </ul>
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
