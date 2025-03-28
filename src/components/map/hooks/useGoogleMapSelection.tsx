
import { useEffect, useState, useRef, useCallback } from 'react';
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

  // Handles map click events based on the current selection mode
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !selectionMode) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    console.log("Map clicked in mode:", selectionMode, "at coordinates:", lat, lng);
    
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
  }, [selectionMode, onOriginChange, onDestinationChange]);

  // Function to create selection mode controls
  const createSelectionControls = useCallback((controlDiv: HTMLDivElement) => {
    // Create the UI button container
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    controlDiv.style.display = 'flex';
    controlDiv.style.gap = '5px';
    
    // Create the Origin button
    const originButton = document.createElement('button');
    originButton.innerText = 'Seleccionar Origen';
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#4285F4' : '#fff';
    originButton.style.color = selectionMode === 'origin' ? 'white' : 'black';
    originButton.style.border = '1px solid #ccc';
    originButton.style.borderRadius = '4px';
    originButton.style.padding = '8px 12px';
    originButton.style.cursor = 'pointer';
    
    // Create the Destination button
    const destinationButton = document.createElement('button');
    destinationButton.innerText = 'Seleccionar Destino';
    destinationButton.style.backgroundColor = selectionMode === 'destination' ? '#DB4437' : '#fff';
    destinationButton.style.color = selectionMode === 'destination' ? 'white' : 'black';
    destinationButton.style.border = '1px solid #ccc';
    destinationButton.style.borderRadius = '4px';
    destinationButton.style.padding = '8px 12px';
    destinationButton.style.cursor = 'pointer';
    
    // Add click handlers
    originButton.onclick = (e) => {
      e.stopPropagation(); // Evitar que el evento de clic llegue al mapa
      setSelectionMode(selectionMode === 'origin' ? null : 'origin');
      
      if (selectionMode !== 'origin') {
        toast({
          title: "Selección de origen activada",
          description: "Haz clic en el mapa para seleccionar el punto de origen"
        });
      }
    };
    
    destinationButton.onclick = (e) => {
      e.stopPropagation(); // Evitar que el evento de clic llegue al mapa
      setSelectionMode(selectionMode === 'destination' ? null : 'destination');
      
      if (selectionMode !== 'destination') {
        toast({
          title: "Selección de destino activada",
          description: "Haz clic en el mapa para seleccionar el punto de destino"
        });
      }
    };
    
    // Add buttons to the control div
    controlDiv.appendChild(originButton);
    controlDiv.appendChild(destinationButton);
  }, [selectionMode]);

  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;

    // Clean up the previous listener
    if (clickListenerRef.current) {
      google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    // Set cursor based on selection mode
    if (mapRef.current) {
      if (selectionMode) {
        mapRef.current.setOptions({
          draggableCursor: 'crosshair'
        });
      } else {
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
  }, [mapRef.current, selectionMode, allowMapSelection]);

  return { selectionMode, setSelectionMode, handleMapClick, createSelectionControls };
}
