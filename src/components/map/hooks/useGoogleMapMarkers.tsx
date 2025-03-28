
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [homeLocation, setHomeLocation] = useState<MapCoordinates | null>(null);

  // Load home location
  useEffect(() => {
    try {
      const homeLocationJSON = localStorage.getItem(homeLocationKey);
      if (homeLocationJSON) {
        const parsedHome = JSON.parse(homeLocationJSON);
        setHomeLocation(parsedHome);
      }
    } catch (error) {
      console.error('Error loading home location:', error);
    }
  }, []);

  // Function to handle markers creation and updates
  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;
    
    console.log("Updating markers with:", { origin, destination });
    
    // Create or update the origin marker (blue)
    if (origin) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
      } else {
        // Custom marker SVG for origin
        const originSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
            <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" fill="#1E88E5" stroke="#ffffff" stroke-width="1"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
          </svg>
        `;
        
        const originIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(originSvg),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40)
        };
        
        originMarkerRef.current = new google.maps.Marker({
          position: { lat: origin.lat, lng: origin.lng },
          map: mapRef.current,
          icon: originIcon,
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
        
        // Add info window
        if (origin.address) {
          const infowindow = new google.maps.InfoWindow({
            content: `<div><strong>Origen:</strong> ${origin.address}</div>`
          });
          
          originMarkerRef.current.addListener('click', () => {
            infowindow.open(mapRef.current, originMarkerRef.current);
          });
        }
      }
      
      // Check if this is a home location
      if (homeLocation && origin.address?.toLowerCase().includes('mi casa')) {
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
        // Custom marker SVG for destination
        const destinationSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
            <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" fill="#E53935" stroke="#ffffff" stroke-width="1"/>
            <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#E53935"/>
          </svg>
        `;
        
        const destinationIcon = {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(destinationSvg),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40)
        };
        
        destinationMarkerRef.current = new google.maps.Marker({
          position: { lat: destination.lat, lng: destination.lng },
          map: mapRef.current,
          icon: destinationIcon,
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
        
        // Add info window
        if (destination.address) {
          const infowindow = new google.maps.InfoWindow({
            content: `<div><strong>Destino:</strong> ${destination.address}</div>`
          });
          
          destinationMarkerRef.current.addListener('click', () => {
            infowindow.open(mapRef.current, destinationMarkerRef.current);
          });
        }
      }
    } else if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setMap(null);
      destinationMarkerRef.current = null;
    }
    
    // Create or update home marker if needed
    updateHomeMarker();
  }, [mapRef, origin, destination, homeLocation, allowMapSelection, onOriginChange, onDestinationChange]);

  // Function specifically for home marker management
  const updateHomeMarker = useCallback(() => {
    if (!mapRef.current) return;
    
    try {
      if (homeLocation) {
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
            // Custom house icon
            const homeSvg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#4CAF50" stroke="#ffffff" stroke-width="1"/>
                <polyline points="9 22 9 12 15 12 15 22" fill="#ffffff" stroke="#4CAF50"/>
              </svg>
            `;
            
            const homeIcon = {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(homeSvg),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40)
            };
            
            homeMarkerRef.current = new google.maps.Marker({
              position: { lat: homeLocation.lat, lng: homeLocation.lng },
              map: mapRef.current,
              icon: homeIcon,
              title: 'Mi Casa'
            });
            
            // Add info window
            const infowindow = new google.maps.InfoWindow({
              content: `<div><strong>Mi Casa</strong></div>${homeLocation.address ? `<div>${homeLocation.address}</div>` : ''}`
            });
            
            homeMarkerRef.current.addListener('click', () => {
              infowindow.open(mapRef.current, homeMarkerRef.current);
            });
          }
        } else if (homeMarkerRef.current) {
          homeMarkerRef.current.setMap(null);
          homeMarkerRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error showing home marker:', error);
    }
  }, [mapRef, origin, homeLocation, allowHomeEditing]);

  // Helper function for geocoding
  const reverseGeocode = (lat: number, lng: number, callback: (address: string) => void) => {
    if (!window.google?.maps) {
      callback(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      return;
    }
    
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
  const saveHomeLocation = useCallback(() => {
    if (origin) {
      try {
        localStorage.setItem(homeLocationKey, JSON.stringify(origin));
        setHomeLocation(origin);
        
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
  }, [origin, updateHomeMarker]);

  return { 
    originMarkerRef, 
    destinationMarkerRef, 
    homeMarkerRef,
    updateMarkers,
    updateHomeMarker,
    saveHomeLocation
  };
}
