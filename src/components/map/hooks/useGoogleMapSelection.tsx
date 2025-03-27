
import { useState } from 'react';
import { MapCoordinates } from '../types';

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection,
  onOriginChange,
  onDestinationChange
}: {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}) {
  const [selectionMode, setSelectionMode] = useState<'origin' | 'destination' | 'none'>(
    allowMapSelection ? 'origin' : 'none'
  );

  // Handle map click for selection
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!mapRef.current || selectionMode === 'none' || !event.latLng) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    reverseGeocode(lat, lng, (address) => {
      const coordinates = { lat, lng, address };
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coordinates);
        setSelectionMode('destination');
      } else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coordinates);
        setSelectionMode('none');
      }
    });
  };

  // Helper function for geocoding
  const reverseGeocode = (lat: number, lng: number, callback: (address: string) => void) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        callback(results[0].formatted_address);
      } else {
        console.error('Error reverse geocoding:', status);
        callback(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    });
  };

  // Create selection controls for the map
  const createSelectionControls = (controlDiv: HTMLDivElement) => {
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    controlDiv.style.textAlign = 'center';
    
    const originButton = document.createElement('button');
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#1E88E5' : 'white';
    originButton.style.color = selectionMode === 'origin' ? 'white' : 'black';
    originButton.style.border = 'none';
    originButton.style.borderRadius = '4px';
    originButton.style.padding = '8px 12px';
    originButton.style.margin = '0 5px';
    originButton.style.fontSize = '14px';
    originButton.style.cursor = 'pointer';
    originButton.textContent = 'Seleccionar Origen';
    originButton.onclick = () => {
      setSelectionMode('origin');
      originButton.style.backgroundColor = '#1E88E5';
      originButton.style.color = 'white';
      destButton.style.backgroundColor = 'white';
      destButton.style.color = 'black';
    };
    
    const destButton = document.createElement('button');
    destButton.style.backgroundColor = selectionMode === 'destination' ? '#1E88E5' : 'white';
    destButton.style.color = selectionMode === 'destination' ? 'white' : 'black';
    destButton.style.border = 'none';
    destButton.style.borderRadius = '4px';
    destButton.style.padding = '8px 12px';
    destButton.style.margin = '0 5px';
    destButton.style.fontSize = '14px';
    destButton.style.cursor = 'pointer';
    destButton.textContent = 'Seleccionar Destino';
    destButton.onclick = () => {
      setSelectionMode('destination');
      destButton.style.backgroundColor = '#1E88E5';
      destButton.style.color = 'white';
      originButton.style.backgroundColor = 'white';
      originButton.style.color = 'black';
    };
    
    controlDiv.appendChild(originButton);
    controlDiv.appendChild(destButton);
  };

  return { 
    selectionMode, 
    setSelectionMode, 
    handleMapClick, 
    createSelectionControls 
  };
}
