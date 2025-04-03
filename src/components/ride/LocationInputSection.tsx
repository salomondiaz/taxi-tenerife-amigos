
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MapCoordinates } from "@/components/map/types";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";

interface LocationInputSectionProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  handleOriginChange: (coordinates: MapCoordinates) => void;
  handleDestinationChange: (coordinates: MapCoordinates) => void;
  handleUseCurrentLocation: () => void;
  useHomeAddress: () => void;
  saveHomeAddress: () => void;
  isLoading: boolean;
  calculateEstimates: () => void;
  handleUseHomeAsDestination?: () => void;
  scheduledTime?: string;
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  handleOriginChange,
  handleDestinationChange,
  handleUseCurrentLocation,
  useHomeAddress,
  saveHomeAddress,
  isLoading,
  calculateEstimates,
  handleUseHomeAsDestination,
  scheduledTime
}) => {
  const { hasHomeLocation, homeLocation } = useHomeLocationStorage();
  
  const handleCheckEstimates = () => {
    if (!origin || !destination) {
      toast({
        title: "Información incompleta",
        description: "Por favor, introduce tanto el origen como el destino",
        variant: "destructive",
      });
      return;
    }
    
    calculateEstimates();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">¿De dónde a dónde vas?</h2>

      {/* Opciones de ubicaciones */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="flex justify-center items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <MapPin size={18} />
            Usar mi ubicación actual
          </Button>
          
          <Button
            variant="outline"
            onClick={useHomeAddress}
            disabled={isLoading || !hasHomeLocation}
            className={`flex justify-center items-center gap-2 ${hasHomeLocation ? 'border-blue-600 text-blue-600 hover:bg-blue-50' : 'opacity-50'}`}
          >
            <Navigation size={18} />
            Partir desde mi casa
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={saveHomeAddress}
            disabled={isLoading || !origin}
            className={`flex justify-center items-center gap-2 ${origin ? 'border-green-600 text-green-600 hover:bg-green-50' : 'opacity-50'}`}
          >
            <MapPin size={18} />
            Guardar origen como mi casa
          </Button>
          
          {handleUseHomeAsDestination && (
            <Button
              variant="outline"
              onClick={handleUseHomeAsDestination}
              disabled={isLoading || !hasHomeLocation}
              className={`flex justify-center items-center gap-2 ${hasHomeLocation ? 'border-green-600 text-green-600 hover:bg-green-50' : 'opacity-50'}`}
            >
              <MapPin size={18} />
              Ir a mi casa
            </Button>
          )}
        </div>
      </div>
      
      {/* Campos de origen y destino */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
            Origen
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-blue-600" />
            </div>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              disabled={isLoading}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm pl-10 w-full py-2"
              placeholder="¿Dónde te recogemos?"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Destino
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-red-600" />
            </div>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isLoading}
              className="border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md shadow-sm pl-10 w-full py-2"
              placeholder="¿A dónde vas?"
            />
          </div>
        </div>
      </div>
      
      {/* Botón de calcular */}
      <Button
        className="w-full"
        onClick={handleCheckEstimates}
        disabled={isLoading || !origin || !destination}
      >
        {isLoading ? "Calculando..." : "Calcular viaje"}
      </Button>
    </div>
  );
};

export default LocationInputSection;
