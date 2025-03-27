
import { useEffect, useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from '../types';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;

    // Clean up the previous listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Only set up new listener if we're in selection mode
    if (selectionMode && (selectionMode === 'origin' || selectionMode === 'destination')) {
      clickListenerRef.current = google.maps.event.addListener(
        mapRef.current,
        'click',
        (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          // Get address using reverse geocoding
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              address = results[0].formatted_address;
            } else {
              console.error('Error reverse geocoding:', status);
            }
            
            const coordinates: MapCoordinates = {
              lat,
              lng,
              address
            };
            
            if (selectionMode === 'origin' && onOriginChange) {
              onOriginChange(coordinates);
              toast({
                title: "Origen seleccionado",
                description: address
              });
              
              // Automatically switch to destination selection after setting origin
              setSelectionMode('destination');
            } else if (selectionMode === 'destination' && onDestinationChange) {
              onDestinationChange(coordinates);
              toast({
                title: "Destino seleccionado",
                description: address
              });
              
              // Exit selection mode after setting destination
              setSelectionMode(null);
            }
          });
        }
      );
      
      // Set appropriate cursor
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: 'crosshair'
        });
      }
    } else {
      // Reset cursor when not in selection mode
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: ''
        });
      }
    }

    // Cleanup listener on unmount or selection mode change
    return () => {
      if (clickListenerRef.current) {
        google.maps.event.removeListener(clickListenerRef.current);
        clickListenerRef.current = null;
      }
      
      // Also reset cursor
      if (mapRef.current) {
        mapRef.current.setOptions({
          draggableCursor: ''
        });
      }
    };
  }, [mapRef.current, selectionMode, allowMapSelection, onOriginChange, onDestinationChange]);

  return { selectionMode, setSelectionMode };
}
