
import { useEffect, useRef } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';

export function useGoogleMapMarkers({
  mapRef,
  origin,
  destination,
  allowHomeEditing = false,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange
}: {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  allowHomeEditing?: boolean;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}) {
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);
  const homeLocationKey = 'user_home_location';

  // Function to handle markers creation and updates
  const updateMarkers = () => {
    if (!mapRef.current) return;
    
    // Create or update the origin marker (blue)
    if (origin) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
      } else {
        originMarkerRef.current = new google.maps.Marker({
          position: { lat: origin.lat, lng: origin.lng },
          map: mapRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          },
          draggable: allowMapSelection,
          title: 'Origen'
        });
        
        if (allowMapSelection && onOriginChange) {
          originMarkerRef.current.addListener('dragend', () => {
            const position = originMarkerRef.current?.getPosition();
            if (position) {
              reverseGeocode(position.lat(), position.lng(), (address) => {
                onOriginChange({
                  lat: position.lat(),
                  lng: position.lng(),
                  address: address
                });
              });
            }
          });
        }
      }
      
      // Check if this is a home location
      const isHome = origin.address?.toLowerCase().includes('mi casa') || 
                     origin.address?.toLowerCase().includes('home');
      
      if (isHome) {
        updateHomeMarker();
      }
    } else if (originMarkerRef.current) {
      originMarkerRef.current.setMap(null);
      originMarkerRef.current = null;
    }

    // Create or update the destination marker (red)
    if (destination) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
      } else {
        // Using red icon for destination marker
        destinationMarkerRef.current = new google.maps.Marker({
          position: { lat: destination.lat, lng: destination.lng },
          map: mapRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          },
          draggable: allowMapSelection,
          title: 'Destino'
        });
        
        if (allowMapSelection && onDestinationChange) {
          destinationMarkerRef.current.addListener('dragend', () => {
            const position = destinationMarkerRef.current?.getPosition();
            if (position) {
              reverseGeocode(position.lat(), position.lng(), (address) => {
                onDestinationChange({
                  lat: position.lat(),
                  lng: position.lng(),
                  address: address
                });
              });
            }
          });
        }
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setMap(null);
      destinationMarkerRef.current = null;
    }
    
    // Create or update home marker if needed
    updateHomeMarker();
  };

  // Function specifically for home marker management
  const updateHomeMarker = () => {
    if (!mapRef.current) return;
    
    try {
      const homeLocationJSON = localStorage.getItem(homeLocationKey);
      if (homeLocationJSON) {
        const homeLocation = JSON.parse(homeLocationJSON);
        
        // Check if origin location is the home location
        const isOriginHome = origin && 
          homeLocation && 
          ((Math.abs(origin.lat - homeLocation.lat) < 0.0001 && 
            Math.abs(origin.lng - homeLocation.lng) < 0.0001) ||
           (origin.address && origin.address.toLowerCase().includes("mi casa")));
        
        // Show home marker if we're at home location or if we have allowHomeEditing enabled
        if (isOriginHome || allowHomeEditing) {
          if (homeMarkerRef.current) {
            homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
          } else {
            // Create a more visible home icon
            homeMarkerRef.current = new google.maps.Marker({
              position: { lat: homeLocation.lat, lng: homeLocation.lng },
              map: mapRef.current,
              icon: {
                url: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
                scaledSize: new google.maps.Size(40, 40)
              },
              title: 'Mi Casa'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error showing home marker:', error);
    }
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

  // Function to save home location
  const saveHomeLocation = () => {
    if (origin) {
      try {
        localStorage.setItem(homeLocationKey, JSON.stringify(origin));
        toast({
          title: 'Casa guardada',
          description: 'Tu ubicación de casa ha sido guardada',
        });
        
        updateHomeMarker();
      } catch (error) {
        console.error('Error saving home location:', error);
        toast({
          title: 'Error',
          description: 'No se pudo guardar la ubicación de tu casa',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Sin ubicación',
        description: 'Selecciona primero una ubicación',
        variant: 'destructive'
      });
    }
  };

  // Update markers when origin, destination or map changes
  useEffect(() => {
    updateMarkers();
  }, [origin, destination, mapRef.current]);

  return { 
    originMarkerRef, 
    destinationMarkerRef, 
    homeMarkerRef,
    updateMarkers,
    updateHomeMarker,
    saveHomeLocation
  };
}
