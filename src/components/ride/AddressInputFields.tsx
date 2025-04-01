
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";
import { MapCoordinates } from "@/components/map/types";

interface AddressInputFieldsProps {
  useManualSelection: boolean;
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  googleMapsApiKey?: string;
  onOriginPlaceSelected?: (coordinates: MapCoordinates) => void;
  onDestinationPlaceSelected?: (coordinates: MapCoordinates) => void;
}

const AddressInputFields: React.FC<AddressInputFieldsProps> = ({
  useManualSelection,
  origin,
  setOrigin,
  destination,
  setDestination,
  googleMapsApiKey,
  onOriginPlaceSelected,
  onDestinationPlaceSelected
}) => {
  if (useManualSelection) {
    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium mb-2 text-blue-800">Instrucciones para selección en el mapa:</p>
        <ul className="text-sm text-blue-700 list-disc list-inside">
          <li>Haz <strong>doble clic</strong> en el mapa para marcar el origen (marcador azul)</li>
          <li>Usa los botones del mapa para cambiar entre selección de origen y destino</li>
          <li>Para destino, haz <strong>doble clic</strong> en el mapa (marcador rojo)</li>
          <li>Tu casa aparecerá marcada con un icono de casa verde</li>
        </ul>
      </div>
    );
  }

  if (googleMapsApiKey) {
    return (
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
              onPlaceSelected={onOriginPlaceSelected}
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
              onPlaceSelected={onDestinationPlaceSelected}
              apiKey={googleMapsApiKey}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default AddressInputFields;
