
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';

interface UseGoogleMapSearchProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useGoogleMapSearch({
  mapRef,
  onOriginChange,
  onDestinationChange
}: UseGoogleMapSearchProps) {
  
  // Handle using current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get the address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const address = results[0].formatted_address;
              if (onOriginChange) {
                onOriginChange({
                  lat: latitude,
                  lng: longitude,
                  address
                });
                toast({
                  title: "Ubicación actual establecida",
                  description: address
                });
              }
            }
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast({
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación actual",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocalización no soportada",
        description: "Tu navegador no soporta geolocalización",
        variant: "destructive"
      });
    }
  };

  // Handle search location
  const handleSearchLocation = (query: string, type: 'origin' | 'destination') => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;
        
        if (type === 'origin' && onOriginChange) {
          onOriginChange({ lat, lng, address });
          // Fly to location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
          toast({
            title: "Origen establecido",
            description: address
          });
        } else if (type === 'destination' && onDestinationChange) {
          onDestinationChange({ lat, lng, address });
          // Fly to location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
          toast({
            title: "Destino establecido",
            description: address
          });
        }
      } else {
        toast({
          title: "Ubicación no encontrada",
          description: "No se encontró ninguna ubicación con esa dirección",
          variant: "destructive"
        });
      }
    });
  };

  return {
    handleUseCurrentLocation,
    handleSearchLocation
  };
}
