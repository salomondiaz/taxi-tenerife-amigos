
import React from "react";
import { MapPin, Navigation, Home, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useHomeAddressManager } from "@/hooks/useHomeAddressManager";

interface LocationSelectionControlsProps {
  useManualSelection: boolean;
  setUseManualSelection: (value: boolean) => void;
  handleUseCurrentLocation: () => void;
  origin: string;
  handleOriginChange: (coordinates: any) => void;
  setOrigin: (value: string) => void;
}

const LocationSelectionControls: React.FC<LocationSelectionControlsProps> = ({
  useManualSelection,
  setUseManualSelection,
  handleUseCurrentLocation,
  origin,
  handleOriginChange,
  setOrigin
}) => {
  const { saveHomeAddress, useHomeAddress } = useHomeAddressManager();

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

  return (
    <>
      {/* Home location options - prominently at the top */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-blue-50 p-3 rounded-lg">
        <Button
          variant="default"
          className="w-full flex items-center justify-center bg-tenerife-blue hover:bg-tenerife-blue/90"
          onClick={() => useHomeAddress(setOrigin, handleOriginChange)}
        >
          <Home size={18} className="mr-2" />
          Usar mi casa como origen
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => saveHomeAddress(origin)}
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
    </>
  );
};

export default LocationSelectionControls;
