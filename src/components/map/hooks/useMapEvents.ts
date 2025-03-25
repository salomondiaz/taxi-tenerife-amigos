
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode, geocodeAddress } from '../services/MapboxService';
import { toast } from '@/hooks/use-toast';

interface UseMapEventsProps {
  map: mapboxgl.Map | null;
  apiKey: string;
  selectionMode: MapSelectionMode;
  onOriginSelect?: (coordinates: MapCoordinates) => void;
  onDestinationSelect?: (coordinates: MapCoordinates) => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

export function useMapEvents({
  map,
  apiKey,
  selectionMode,
  onOriginSelect,
  onDestinationSelect,
  onSearchLocation
}: UseMapEventsProps) {
  // Función para buscar ubicaciones
  useEffect(() => {
    if (!map || !onSearchLocation) return;
    
    // Esta función será expuesta a través del componente
    onSearchLocation = async (query: string, type: 'origin' | 'destination') => {
      try {
        toast({
          title: "Buscando ubicación",
          description: "Espera mientras buscamos: " + query
        });
        
        const geocodedLocation = await geocodeAddress(query, apiKey);
        
        if (geocodedLocation) {
          // Volar a la ubicación encontrada
          map.flyTo({
            center: [geocodedLocation.lng, geocodedLocation.lat],
            zoom: 15,
            essential: true
          });
          
          // Si estamos buscando un origen o destino, seleccionarlo automáticamente
          if (type === 'origin' && onOriginSelect) {
            onOriginSelect(geocodedLocation);
            toast({
              title: "Origen establecido",
              description: geocodedLocation.address || "Ubicación seleccionada"
            });
          } else if (type === 'destination' && onDestinationSelect) {
            onDestinationSelect(geocodedLocation);
            toast({
              title: "Destino establecido",
              description: geocodedLocation.address || "Ubicación seleccionada"
            });
          }
        } else {
          toast({
            title: "Ubicación no encontrada",
            description: "No pudimos encontrar: " + query,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error al buscar ubicación:", error);
        toast({
          title: "Error de búsqueda",
          description: "Ocurrió un error al buscar la ubicación",
          variant: "destructive"
        });
      }
    };
  }, [map, apiKey, onOriginSelect, onDestinationSelect, onSearchLocation]);
  
  // Handle map double-click events for selection
  useEffect(() => {
    if (!map) return;
    
    const handleMapDblClick = async (e: mapboxgl.MapMouseEvent) => {
      try {
        // Solo procesar si estamos en modo de selección
        if (selectionMode === 'none') {
          return;
        }
        
        console.log("Mapa doble-clickeado en modo:", selectionMode);
        
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
        console.error("Error procesando el doble clic en el mapa:", error);
      }
    };
    
    // Solo agregar el controlador de doble clics si estamos en modo de selección
    if (selectionMode !== 'none') {
      if (map.loaded()) {
        map.on('dblclick', handleMapDblClick);
      } else {
        map.once('load', () => {
          map.on('dblclick', handleMapDblClick);
        });
      }
    }
    
    return () => {
      if (map) {
        map.off('dblclick', handleMapDblClick);
      }
    };
  }, [map, apiKey, selectionMode, onOriginSelect, onDestinationSelect]);
  
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
