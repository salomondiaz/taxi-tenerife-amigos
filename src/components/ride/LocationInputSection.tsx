import React from "react";
import { Button } from "@/components/ui/button";
import { MapCoordinates, API_KEY_STORAGE_KEY } from "@/components/map/types";
import { MapPin, Navigation, Home, LocateIcon, Search, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import EnhancedLocationSelector from "./EnhancedLocationSelector";

interface LocationInputSectionProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  handleOriginChange: (coords: MapCoordinates) => void;
  handleDestinationChange: (coords: MapCoordinates) => void;
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
  const googleMapsApiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';

  const formatScheduledTime = () => {
    if (!scheduledTime) return null;
    
    try {
      const date = new Date(scheduledTime);
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error("Error formatting scheduled time:", error);
      return scheduledTime;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <h2 className="text-lg font-semibold mb-4">¿De dónde a dónde vas?</h2>
      
      <div className="p-4 bg-blue-50 rounded-lg mb-4">
        <p className="text-sm text-blue-800 font-medium mb-2">Instrucciones simplificadas:</p>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Haz <strong>clic en el mapa</strong> para seleccionar tu punto de origen</li>
          <li>Haz <strong>clic nuevamente</strong> para seleccionar tu destino</li>
          <li>El viaje se guardará automáticamente con estado "pendiente"</li>
        </ol>
      </div>
      
      {(origin || destination) && (
        <div className="mt-4 space-y-2">
          {origin && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-sm truncate">{origin}</p>
            </div>
          )}
          
          {destination && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
              <p className="text-sm truncate">{destination}</p>
            </div>
          )}
        </div>
      )}
      
      {scheduledTime && (
        <div className="mt-4 flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <Clock className="text-amber-600" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">Viaje programado</p>
            <p className="text-xs text-amber-700">{formatScheduledTime()}</p>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={handleUseCurrentLocation}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
        >
          Usar mi ubicación
        </button>
        
        <button 
          onClick={useHomeAddress}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
        >
          Usar mi casa como origen
        </button>
        
        {handleUseHomeAsDestination && (
          <button 
            onClick={handleUseHomeAsDestination}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
          >
            Ir a casa
          </button>
        )}
        
        <button 
          onClick={saveHomeAddress}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
        >
          Guardar casa
        </button>
        
        <button 
          onClick={calculateEstimates}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full"
          disabled={isLoading}
        >
          {isLoading ? "Calculando..." : "Calcular ruta"}
        </button>
      </div>
      
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-gray-500">Opciones avanzadas</summary>
        <div className="mt-4">
          <EnhancedLocationSelector
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            onOriginCoordinatesChange={handleOriginChange}
            onDestinationCoordinatesChange={handleDestinationChange}
            handleUseCurrentLocation={handleUseCurrentLocation}
            useHomeAddress={useHomeAddress}
            saveHomeAddress={saveHomeAddress}
            googleMapsApiKey={googleMapsApiKey}
            calculateEstimates={calculateEstimates}
            isCalculating={isLoading}
          />
        </div>
      </details>
    </div>
  );
};

export default LocationInputSection;
