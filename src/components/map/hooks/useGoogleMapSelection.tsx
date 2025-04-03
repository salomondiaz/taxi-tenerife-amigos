
import { useState, useEffect, useCallback } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapSelectionProps {
  map: google.maps.Map | null;
  allowMapSelection: boolean;
  defaultSelectionMode?: MapSelectionMode;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection?: boolean;
  homeLocation?: MapCoordinates | null;
  useHomeAsDestination?: () => void;
  showSelectMarkers?: boolean;
}

export function useGoogleMapSelection({
  map,
  allowMapSelection,
  defaultSelectionMode = 'none',
  onOriginChange,
  onDestinationChange,
  showDestinationSelection = true,
  homeLocation,
  useHomeAsDestination,
  showSelectMarkers = false
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>(defaultSelectionMode);
  const [showHomeDialog, setShowHomeDialog] = useState(false);

  // Change selection mode with feedback
  const changeSelectionMode = (mode: MapSelectionMode) => {
    setSelectionMode(mode);
    
    if (mode === 'none') {
      return;
    }
    
    // Show toast message
    toast({
      title: mode === 'origin' ? 'Selecciona el origen' : 'Selecciona el destino',
      description: `Haz clic en el mapa para seleccionar el punto de ${mode === 'origin' ? 'origen' : 'destino'}`,
    });
  };

  // Handle map click for selection
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (selectionMode === 'none' || !allowMapSelection || !map) return;
    
    const lat = e.latLng!.lat();
    const lng = e.latLng!.lng();
    
    console.log(`Map clicked at: ${lat}, ${lng} in mode: ${selectionMode}`);
    
    // Disable zoom on click - this helps prevent zoom jumping
    e.stop();
    
    // Use reverse geocoding to get the address
    reverseGeocode(lat, lng, (address) => {
      const coords: MapCoordinates = {
        lat,
        lng,
        address: address || `Ubicación (${lat.toFixed(6)}, ${lng.toFixed(6)})`
      };
      
      if (selectionMode === 'origin' && onOriginChange) {
        onOriginChange(coords);
        toast({
          title: "Origen seleccionado",
          description: coords.address
        });
        
        // Automatically switch to destination selection mode
        if (allowMapSelection && showDestinationSelection) {
          changeSelectionMode('destination');
        } else {
          changeSelectionMode('none');
        }
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coords);
        toast({
          title: "Destino seleccionado",
          description: coords.address
        });
        
        // Return to no selection mode
        changeSelectionMode('none');
      }
    });
  }, [selectionMode, allowMapSelection, onOriginChange, onDestinationChange, map, showDestinationSelection]);

  // Setup map click listener
  useEffect(() => {
    if (!map || !allowMapSelection) return;
    
    // Disable double-click zoom to prevent accidental zooming when selecting points
    map.setOptions({
      disableDoubleClickZoom: true
    });
    
    const listener = map.addListener('click', handleMapClick);
    
    console.log("Map selection mode activated: ", selectionMode);
    
    return () => {
      google.maps.event.removeListener(listener);
      console.log("Map click listener removed");
    };
  }, [map, allowMapSelection, handleMapClick, selectionMode]);

  return {
    selectionMode,
    setSelectionMode: changeSelectionMode,
    handleMapClick,
    showHomeDialog,
    setShowHomeDialog
  };
}
