
import { useState, useCallback, useRef, useEffect } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import { toast } from '@/hooks/use-toast';
import { geocodeAddress } from '../services/GeocodingService';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
  useHomeAsDestination?: () => void;
  homeLocation?: MapCoordinates | null;
  showSelectMarkers?: boolean;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true,
  useHomeAsDestination,
  homeLocation,
  showSelectMarkers = false
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(allowMapSelection ? 'origin' : 'none');
  const [showHomeDialog, setShowHomeDialog] = useState(false);
  const { loadHomeLocation } = useHomeLocationStorage();
  const clickTimeoutRef = useRef<number | null>(null);
  
  // Si cambia allowMapSelection, actualizar el modo de selección
  useEffect(() => {
    if (allowMapSelection) {
      setSelectionMode('origin');
      console.log("Adding click listener for origin selection");
    } else {
      setSelectionMode('none');
    }
  }, [allowMapSelection]);

  // Función para manejar clics en el mapa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!mapRef.current || selectionMode === 'none') return;

    // Obtener coordenadas del clic
    const lat = e.latLng!.lat();
    const lng = e.latLng!.lng();
    
    // Geocodificación inversa para obtener la dirección
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const coords: MapCoordinates = {
          lat,
          lng,
          address: results[0].formatted_address
        };
        
        if (selectionMode === 'origin') {
          // Actualizar origen
          if (onOriginChange) {
            onOriginChange(coords);
          }
          
          // Mostrar notificación
          toast({
            title: "Origen seleccionado",
            description: "Ahora selecciona el punto de destino"
          });
          
          // Si se permite seleccionar destino, cambiar al siguiente modo
          if (showDestinationSelection) {
            setSelectionMode('destination');
          } else {
            setSelectionMode('none');
          }
        } else if (selectionMode === 'destination') {
          // Actualizar destino
          if (onDestinationChange) {
            onDestinationChange(coords);
          }
          
          // Mostrar notificación
          toast({
            title: "Destino seleccionado",
            description: "Calculando ruta..."
          });
          
          // Volver al modo sin selección
          setSelectionMode('none');
        }
      } else {
        console.error("Error geocodificando clic en mapa:", status);
        toast({
          title: "Error de geocodificación",
          description: "No se pudo obtener la dirección para este punto",
          variant: "destructive"
        });
      }
    });
  }, [mapRef, selectionMode, onOriginChange, onDestinationChange, showDestinationSelection]);

  // Crear controles de selección para el mapa
  const createSelectionControls = useCallback(() => {
    if (!mapRef.current || !allowMapSelection) return null;
    
    const controls = document.createElement('div');
    controls.className = 'map-selection-controls';
    controls.style.cssText = 'position:absolute;top:10px;left:10px;background:white;padding:10px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:1;';
    
    const originButton = document.createElement('button');
    originButton.textContent = 'Seleccionar Origen';
    originButton.className = `px-3 py-1 rounded ${selectionMode === 'origin' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`;
    originButton.addEventListener('click', () => {
      setSelectionMode(prev => prev === 'origin' ? 'none' : 'origin');
    });
    
    const destinationButton = document.createElement('button');
    destinationButton.textContent = 'Seleccionar Destino';
    destinationButton.className = `px-3 py-1 rounded mt-2 ${selectionMode === 'destination' ? 'bg-red-500 text-white' : 'bg-gray-100'}`;
    destinationButton.addEventListener('click', () => {
      setSelectionMode(prev => prev === 'destination' ? 'none' : 'destination');
    });
    
    controls.appendChild(originButton);
    controls.appendChild(document.createElement('br'));
    controls.appendChild(destinationButton);
    
    // Si hay una ubicación de casa guardada y función para usarla, añadir botón
    if (homeLocation && useHomeAsDestination) {
      controls.appendChild(document.createElement('hr'));
      
      const homeButton = document.createElement('button');
      homeButton.textContent = 'Ir a Casa';
      homeButton.className = 'px-3 py-1 rounded mt-2 bg-green-100 w-full';
      homeButton.addEventListener('click', useHomeAsDestination);
      
      controls.appendChild(homeButton);
    }
    
    return controls;
  }, [mapRef, allowMapSelection, selectionMode, homeLocation, useHomeAsDestination]);

  // Botón flotante para mostrar los controles de selección
  const renderFloatingButton = useCallback(() => {
    if (!mapRef.current || !allowMapSelection) return null;
    
    const button = document.createElement('button');
    button.textContent = '📍 Seleccionar';
    button.className = 'map-selection-button';
    button.style.cssText = 'position:absolute;bottom:80px;right:10px;background:white;padding:8px 12px;border-radius:20px;box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:1;display:flex;align-items:center;border:none;cursor:pointer;';
    button.addEventListener('click', () => {
      setShowHomeDialog(true);
    });
    
    return button;
  }, [mapRef, allowMapSelection]);

  // Diálogo para mostrar opciones de casa
  const HomeDialog = useCallback(() => {
    if (!showHomeDialog) return null;
    
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
          <h3 className="text-lg font-medium mb-4">Opciones de ubicación</h3>
          
          <div className="space-y-3">
            <button 
              className="w-full bg-blue-500 text-white rounded py-2 flex items-center justify-center"
              onClick={() => {
                setSelectionMode('origin');
                setShowHomeDialog(false);
              }}
            >
              <span className="mr-2">📍</span> Seleccionar origen
            </button>
            
            <button 
              className="w-full bg-red-500 text-white rounded py-2 flex items-center justify-center"
              onClick={() => {
                setSelectionMode('destination');
                setShowHomeDialog(false);
              }}
            >
              <span className="mr-2">🏁</span> Seleccionar destino
            </button>
            
            {homeLocation && useHomeAsDestination && (
              <button 
                className="w-full bg-green-500 text-white rounded py-2 flex items-center justify-center"
                onClick={() => {
                  useHomeAsDestination();
                  setShowHomeDialog(false);
                }}
              >
                <span className="mr-2">🏠</span> Ir a casa
              </button>
            )}
            
            <button 
              className="w-full bg-gray-200 rounded py-2"
              onClick={() => setShowHomeDialog(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }, [showHomeDialog, setSelectionMode, homeLocation, useHomeAsDestination]);

  return {
    selectionMode,
    setSelectionMode,
    handleMapClick,
    createSelectionControls,
    renderFloatingButton,
    HomeDialog,
    showHomeDialog
  };
}
