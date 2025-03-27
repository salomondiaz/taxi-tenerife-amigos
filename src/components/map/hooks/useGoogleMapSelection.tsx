
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

  // Handles map click events based on the current selection mode
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !selectionMode) return;

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
  };

  // Function to create selection mode controls
  const createSelectionControls = (controlDiv: HTMLDivElement) => {
    // Create the UI button container
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    
    // Create the Origin button
    const originButton = document.createElement('button');
    originButton.innerText = 'Seleccionar Origen';
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#4285F4' : '#fff';
    originButton.style.color = selectionMode === 'origin' ? 'white' : 'black';
    originButton.style.border = '1px solid #ccc';
    originButton.style.borderRadius = '4px';
    originButton.style.padding = '8px 12px';
    originButton.style.marginRight = '5px';
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
    originButton.onclick = () => {
      setSelectionMode(selectionMode === 'origin' ? null : 'origin');
    };
    
    destinationButton.onclick = () => {
      setSelectionMode(selectionMode === 'destination' ? null : 'destination');
    };
    
    // Add buttons to the control div
    controlDiv.appendChild(originButton);
    controlDiv.appendChild(destinationButton);
  };

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
        handleMapClick
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

  return { selectionMode, setSelectionMode, handleMapClick, createSelectionControls };
}
