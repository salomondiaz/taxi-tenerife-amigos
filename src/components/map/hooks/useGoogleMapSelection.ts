
import { useState, useEffect, useCallback } from 'react';
import { MapCoordinates, MapSelectionMode } from '../types';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UseGoogleMapSelectionProps {
  map: google.maps.Map | null;
  allowMapSelection: boolean;
  defaultSelectionMode?: MapSelectionMode;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  homeLocation?: MapCoordinates | null;
  useHomeAsDestination?: () => void;
}

export function useGoogleMapSelection({
  map,
  allowMapSelection,
  defaultSelectionMode = 'none',
  onOriginChange,
  onDestinationChange,
  homeLocation,
  useHomeAsDestination
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
        changeSelectionMode('destination');
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
  }, [selectionMode, allowMapSelection, onOriginChange, onDestinationChange, map, changeSelectionMode]);

  // Setup map click listener
  useEffect(() => {
    if (!map || !allowMapSelection) return;
    
    const listener = map.addListener('click', handleMapClick);
    
    console.log('Map click listener added with selection mode:', selectionMode);
    
    return () => {
      google.maps.event.removeListener(listener);
      console.log('Map click listener removed');
    };
  }, [map, allowMapSelection, handleMapClick, selectionMode]);

  // Home Dialog component
  const HomeDialog = () => {
    if (!homeLocation) return null;
    
    return (
      <Dialog open={showHomeDialog} onOpenChange={setShowHomeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usar tu casa como destino</DialogTitle>
            <DialogDescription>
              ¿Quieres usar tu dirección guardada como destino?
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-2 mb-4">
            <Home className="text-green-500" size={20} />
            <span className="font-medium">{homeLocation.address || 'Mi Casa'}</span>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowHomeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (useHomeAsDestination) {
                useHomeAsDestination();
                setShowHomeDialog(false);
              }
            }}>
              Usar como destino
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return { 
    selectionMode, 
    setSelectionMode: changeSelectionMode,
    handleMapClick,
    HomeDialog,
    showHomeDialog,
    setShowHomeDialog
  };
}
