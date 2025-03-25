
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/MapboxService';
import { toast } from '@/hooks/use-toast';

interface UseMapEventsProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  selectionMode: MapSelectionMode;
  onOriginSelect?: (coordinates: MapCoordinates) => void;
  onDestinationSelect?: (coordinates: MapCoordinates) => void;
}

export function useMapEvents({
  map,
  apiKey,
  selectionMode,
  onOriginSelect,
  onDestinationSelect
}: UseMapEventsProps) {
  // Handle map click events for selection
  useEffect(() => {
    if (!map) return;
    
    const handleMapClick = async (e: mapboxgl.MapMouseEvent) => {
      try {
        // Solo procesar si estamos en modo de selección
        if (selectionMode === 'none') {
          return;
        }
        
        console.log("Mapa clickeado en modo:", selectionMode);
        
        const lngLat = e.lngLat;
        const coordinates = {
          lat: lngLat.lat,
          lng: lngLat.lng
        };
        
        // Obtain address via reverse geocoding
        try {
          const address = await reverseGeocode(coordinates, apiKey);
          const coordsWithAddress = { ...coordinates, address };
          
          if (selectionMode === 'origin' && onOriginSelect) {
            console.log("Estableciendo origen en:", coordsWithAddress);
            onOriginSelect(coordsWithAddress);
            toast({
              title: "Origen seleccionado",
              description: address || "Ubicación seleccionada en el mapa",
            });
          } else if (selectionMode === 'destination' && onDestinationSelect) {
            console.log("Estableciendo destino en:", coordsWithAddress);
            onDestinationSelect(coordsWithAddress);
            toast({
              title: "Destino seleccionado",
              description: address || "Ubicación seleccionada en el mapa",
            });
          }
        } catch (error) {
          console.error("Error durante la geocodificación inversa:", error);
          
          // Incluso si falla la geocodificación, establecer las coordenadas
          if (selectionMode === 'origin' && onOriginSelect) {
            onOriginSelect(coordinates);
            toast({
              title: "Origen seleccionado",
              description: "No se pudo obtener la dirección",
            });
          } else if (selectionMode === 'destination' && onDestinationSelect) {
            onDestinationSelect(coordinates);
            toast({
              title: "Destino seleccionado",
              description: "No se pudo obtener la dirección",
            });
          }
        }
      } catch (error) {
        console.error("Error procesando el clic en el mapa:", error);
      }
    };
    
    // Solo agregar el controlador de clics si estamos en modo de selección
    if (selectionMode !== 'none') {
      if (map.loaded()) {
        map.on('click', handleMapClick);
      } else {
        map.once('load', () => {
          map.on('click', handleMapClick);
        });
      }
    }
    
    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
}
