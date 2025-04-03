
import { useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import { toast } from '@/hooks/use-toast';

interface UseHomeMarkerEditProps {
  map: mapboxgl.Map | null;
  markerRef: React.MutableRefObject<mapboxgl.Marker | null>;
  coordinates: MapCoordinates;
}

export function useHomeMarkerEdit({ map, markerRef, coordinates }: UseHomeMarkerEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateHomeLocation } = useHomeLocationStorage();

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    if (!map || !markerRef.current) return;

    const newIsEditing = !isEditing;
    setIsEditing(newIsEditing);
    
    // Make marker draggable when editing
    markerRef.current.setDraggable(newIsEditing);
    
    if (newIsEditing) {
      // When entering edit mode
      toast({
        title: "Modo de edición activado",
        description: "Arrastra el marcador para mover la ubicación de tu casa"
      });
      
      // Add dragend listener to update location when editing
      markerRef.current.on('dragend', () => {
        const newPosition = markerRef.current?.getLngLat();
        if (newPosition) {
          // Use reverse geocoding to get address
          try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: newPosition.lat, lng: newPosition.lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                const newCoords: MapCoordinates = {
                  lat: newPosition.lat,
                  lng: newPosition.lng,
                  address: results[0].formatted_address
                };
                
                updateHomeLocation(newCoords);
                
                toast({
                  title: "Ubicación actualizada",
                  description: "La ubicación de tu casa ha sido actualizada"
                });
                
                // Exit edit mode
                setIsEditing(false);
                if (markerRef.current) markerRef.current.setDraggable(false);
              }
            });
          } catch (error) {
            console.error("Error updating home location:", error);
          }
        }
      });
      
    } else {
      // When exiting edit mode, remove any listeners
      markerRef.current.off('dragend');
      toast({
        title: "Edición guardada",
        description: "Los cambios en la ubicación de tu casa han sido guardados"
      });
    }
  }, [isEditing, map, markerRef, updateHomeLocation]);

  return { isEditing, toggleEditMode };
}
