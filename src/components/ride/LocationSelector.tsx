
import React from "react";
import { MapPin, Navigation, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";

interface LocationSelectorProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  useManualSelection: boolean;
  setUseManualSelection: (value: boolean) => void;
  handleUseCurrentLocation: () => void;
}

const HOME_ADDRESS_KEY = 'home_address';

const LocationSelector: React.FC<LocationSelectorProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  useManualSelection,
  setUseManualSelection,
  handleUseCurrentLocation,
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
      toast({
        title: "Dirección guardada",
        description: "Tu casa ha sido guardada correctamente",
      });
    } else {
      toast({
        title: "No hay dirección para guardar",
        description: "Por favor, introduce primero una dirección de origen",
        variant: "destructive",
      });
    }
  };

  const useHomeAddress = () => {
    const homeAddress = localStorage.getItem(HOME_ADDRESS_KEY);
    if (homeAddress) {
      setOrigin(homeAddress);
      toast({
        title: "Dirección de casa cargada",
        description: "Se ha establecido tu casa como punto de origen",
      });
    } else {
      toast({
        title: "No hay dirección guardada",
        description: "Aún no has guardado ninguna dirección como tu casa",
        variant: "destructive",
      });
    }
  };

  return (
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
          <span className="flex h-2 w-2 mr-2 rounded-full bg-blue-500 animate-pulse" />
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
  );
};

export default LocationSelector;
