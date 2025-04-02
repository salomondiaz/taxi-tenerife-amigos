
import { useState, useEffect, useCallback } from 'react';
import { MapSelectionMode, MapCoordinates } from '../types';
import { reverseGeocode } from '../services/GeocodingService';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UseGoogleMapSelectionProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  allowMapSelection: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  showDestinationSelection: boolean;
  useHomeAsDestination?: () => void;
  homeLocation?: MapCoordinates | null;
  showSelectMarkers?: boolean;
}

export function useGoogleMapSelection({
  mapRef,
  allowMapSelection,
  onOriginChange,
  onDestinationChange,
  showDestinationSelection,
  useHomeAsDestination,
  homeLocation,
  showSelectMarkers = false
}: UseGoogleMapSelectionProps) {
  const [selectionMode, setSelectionMode] = useState<MapSelectionMode>('none');
  const [showHomeDialog, setShowHomeDialog] = useState(false);

  // Handle map click for selection
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (selectionMode === 'none' || !allowMapSelection) return;
    
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
        if (allowMapSelection && showDestinationSelection) {
          setSelectionMode('destination');
        } else {
          setSelectionMode('none');
        }
      } 
      else if (selectionMode === 'destination' && onDestinationChange) {
        onDestinationChange(coords);
        toast({
          title: "Destino seleccionado",
          description: coords.address
        });
        
        // Return to no selection mode
        setSelectionMode('none');
      }
    });
  }, [selectionMode, allowMapSelection, onOriginChange, onDestinationChange, showDestinationSelection]);

  // Setup map click listener
  useEffect(() => {
    if (!mapRef.current || !allowMapSelection) return;
    
    const map = mapRef.current;
    const listener = map.addListener('click', handleMapClick);
    
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapRef, allowMapSelection, handleMapClick]);

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
            <span className="font-medium">{homeLocation.address}</span>
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
    setSelectionMode,
    handleMapClick,
    HomeDialog,
    showHomeDialog,
    setShowHomeDialog
  };
}
