
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppContext } from '@/context/AppContext';
import { MapProps, API_KEY_STORAGE_KEY, MapSelectionMode } from './types';
import MapApiKeyInput from './MapApiKeyInput';
import { useMapInitialization } from './useMapInitialization';
import { useDriverSimulation } from './useDriverSimulation';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentLocation } from './MapboxUtils';

const Map: React.FC<MapProps> = ({ 
  origin, 
  destination, 
  showDriverPosition = false,
  driverPosition,
  style, 
  className = "",
  interactive = true,
  onOriginChange,
  onDestinationChange,
  allowMapSelection = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const originMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const { testMode } = useAppContext();

  // Selección por defecto si allowMapSelection es true
  const defaultSelectionMode = allowMapSelection ? 'origin' : 'none';

  // Load API key on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  // Initialize map
  const { selectionMode, setSelectionMode } = useMapInitialization({
    apiKey,
    mapContainer,
    map,
    originMarker,
    destinationMarker,
    driverMarker,
    origin,
    destination,
    showDriverPosition,
    driverPosition,
    interactive,
    setShowKeyInput,
    onOriginChange,
    onDestinationChange,
    allowMapSelection,
    defaultSelectionMode
  });

  // Driver simulation effect
  useDriverSimulation({
    testMode,
    showDriverPosition,
    map: map.current,
    driverMarker,
    origin,
    destination,
    driverPosition
  });

  const handleApiKeySubmit = () => {
    setShowKeyInput(false);
  };

  const handleUseCurrentLocation = async () => {
    try {
      if (!apiKey) {
        toast({
          title: "Error",
          description: "Se necesita una clave de API para usar la ubicación actual",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Obteniendo ubicación",
        description: "Por favor, espere mientras obtenemos su ubicación actual...",
      });

      const position = await getCurrentLocation();
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (onOriginChange) {
        onOriginChange(coords);
      }

      toast({
        title: "Ubicación actual establecida",
        description: "Se ha establecido su ubicación actual como punto de origen",
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Error de ubicación",
        description: "No pudimos acceder a su ubicación. Por favor, asegúrese de haber concedido permisos de ubicación.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {showKeyInput ? (
        <MapApiKeyInput
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onSubmit={handleApiKeySubmit}
          testMode={testMode}
          onSkip={() => setShowKeyInput(false)}
        />
      ) : (
        <>
          <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm overflow-hidden" />
          
          {allowMapSelection && (
            <div className="absolute top-2 left-2 z-10 flex flex-col space-y-2 bg-white p-2 rounded-md shadow-md">
              <Button 
                size="sm" 
                variant={selectionMode === 'origin' ? "default" : "outline"}
                onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
                className="flex items-center"
              >
                <MapPin size={16} className="mr-2" />
                {selectionMode === 'origin' ? 'Seleccionando origen...' : 'Seleccionar origen'}
              </Button>
              
              <Button 
                size="sm" 
                variant={selectionMode === 'destination' ? "default" : "outline"}
                onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
                className="flex items-center"
              >
                <Navigation size={16} className="mr-2" />
                {selectionMode === 'destination' ? 'Seleccionando destino...' : 'Seleccionar destino'}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleUseCurrentLocation}
                className="flex items-center"
              >
                <span className="flex h-2 w-2 mr-2 rounded-full bg-blue-500 animate-pulse" />
                Usar ubicación actual
              </Button>
            </div>
          )}
          
          {selectionMode !== 'none' && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-md shadow-md text-sm">
              Haga clic en el mapa para seleccionar {selectionMode === 'origin' ? 'origen' : 'destino'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Map;
