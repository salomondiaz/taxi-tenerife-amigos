
import { useCallback, useEffect, useRef } from 'react';
import { MapCoordinates } from '../types';

interface UseGoogleMapMarkersProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  allowHomeEditing?: boolean;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  alwaysShowHomeMarker?: boolean;
  showHomeMarker?: boolean;
  homeLocation?: MapCoordinates | null;
}

export function useGoogleMapMarkers({
  mapRef,
  origin,
  destination,
  allowHomeEditing = false,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange,
  alwaysShowHomeMarker = false,
  showHomeMarker = false,
  homeLocation
}: UseGoogleMapMarkersProps) {
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const homeMarkerRef = useRef<google.maps.Marker | null>(null);

  // Function to create the origin marker
  const updateOriginMarker = useCallback(() => {
    if (!mapRef.current || !origin) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setMap(null);
        originMarkerRef.current = null;
      }
      return;
    }

    // Create marker element with custom SVG
    const createMarkerElement = () => {
      const div = document.createElement('div');
      div.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1E88E5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
        </svg>
      `;
      return div.firstChild as HTMLElement;
    };

    if (!originMarkerRef.current) {
      // Create new marker
      originMarkerRef.current = new google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map: mapRef.current,
        draggable: allowMapSelection,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#1E88E5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 36)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>Origen:</strong> ${origin.address || "Ubicación seleccionada"}</div>`
      });

      originMarkerRef.current.addListener('click', () => {
        infoWindow.open(mapRef.current, originMarkerRef.current);
      });

      // Handle drag events if the marker is draggable
      if (allowMapSelection && onOriginChange) {
        originMarkerRef.current.addListener('dragend', () => {
          const position = originMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            // Use geocoder to get the address for the new position
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                onOriginChange({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
                
                // Update info window with new address
                infoWindow.setContent(`<div><strong>Origen:</strong> ${results[0].formatted_address}</div>`);
              } else {
                onOriginChange({ lat, lng });
                infoWindow.setContent(`<div><strong>Origen:</strong> Ubicación seleccionada</div>`);
              }
            });
          }
        });
      }
    } else {
      // Update existing marker
      originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
      originMarkerRef.current.setMap(mapRef.current);
    }
  }, [mapRef, origin, allowMapSelection, onOriginChange]);

  // Function to create the destination marker
  const updateDestinationMarker = useCallback(() => {
    if (!mapRef.current || !destination) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null);
        destinationMarkerRef.current = null;
      }
      return;
    }

    if (!destinationMarkerRef.current) {
      // Create new marker
      destinationMarkerRef.current = new google.maps.Marker({
        position: { lat: destination.lat, lng: destination.lng },
        map: mapRef.current,
        draggable: allowMapSelection,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#D32F2F" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#D32F2F"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 36)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>Destino:</strong> ${destination.address || "Ubicación seleccionada"}</div>`
      });

      destinationMarkerRef.current.addListener('click', () => {
        infoWindow.open(mapRef.current, destinationMarkerRef.current);
      });

      // Handle drag events if the marker is draggable
      if (allowMapSelection && onDestinationChange) {
        destinationMarkerRef.current.addListener('dragend', () => {
          const position = destinationMarkerRef.current?.getPosition();
          if (position) {
            const lat = position.lat();
            const lng = position.lng();
            
            // Use geocoder to get the address for the new position
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                onDestinationChange({
                  lat,
                  lng,
                  address: results[0].formatted_address
                });
                
                // Update info window with new address
                infoWindow.setContent(`<div><strong>Destino:</strong> ${results[0].formatted_address}</div>`);
              } else {
                onDestinationChange({ lat, lng });
                infoWindow.setContent(`<div><strong>Destino:</strong> Ubicación seleccionada</div>`);
              }
            });
          }
        });
      }
    } else {
      // Update existing marker
      destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
      destinationMarkerRef.current.setMap(mapRef.current);
    }
  }, [mapRef, destination, allowMapSelection, onDestinationChange]);

  // Function to create the home marker
  const updateHomeMarker = useCallback(() => {
    const shouldShow = homeLocation && (showHomeMarker || alwaysShowHomeMarker);
    
    if (!mapRef.current || !shouldShow) {
      if (homeMarkerRef.current) {
        homeMarkerRef.current.setMap(null);
        homeMarkerRef.current = null;
      }
      return;
    }

    if (!homeMarkerRef.current) {
      // Create new home marker with house icon
      homeMarkerRef.current = new google.maps.Marker({
        position: { lat: homeLocation.lat, lng: homeLocation.lng },
        map: mapRef.current,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          `),
          scaledSize: new google.maps.Size(36, 36),
          anchor: new google.maps.Point(18, 36)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <strong>Mi Casa</strong>
            <p>${homeLocation.address || "Ubicación guardada"}</p>
            ${allowHomeEditing ? '<button id="edit-home-btn" class="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2">Editar</button>' : ''}
          </div>
        `
      });

      homeMarkerRef.current.addListener('click', () => {
        infoWindow.open(mapRef.current, homeMarkerRef.current);
        
        // Add event listener to edit button after info window is opened
        google.maps.event.addListener(infoWindow, 'domready', () => {
          const editBtn = document.getElementById('edit-home-btn');
          if (editBtn && allowHomeEditing) {
            editBtn.addEventListener('click', () => {
              console.log("Editar ubicación de casa");
              // Add edit functionality here if needed
            });
          }
        });
      });
    } else {
      // Update existing marker
      homeMarkerRef.current.setPosition({ lat: homeLocation.lat, lng: homeLocation.lng });
      homeMarkerRef.current.setMap(mapRef.current);
    }
  }, [mapRef, homeLocation, showHomeMarker, alwaysShowHomeMarker, allowHomeEditing]);

  // Function to save home location
  const saveHomeLocation = useCallback(() => {
    console.log("Guardando ubicación de casa", origin);
    return origin;
  }, [origin]);

  // Update markers when relevant props change
  useEffect(() => {
    updateOriginMarker();
    updateDestinationMarker();
    updateHomeMarker();
    
    // Clean up markers when component unmounts
    return () => {
      if (originMarkerRef.current) {
        originMarkerRef.current.setMap(null);
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null);
      }
      if (homeMarkerRef.current) {
        homeMarkerRef.current.setMap(null);
      }
    };
  }, [updateOriginMarker, updateDestinationMarker, updateHomeMarker]);

  // Function to update all markers
  const updateMarkers = useCallback(() => {
    console.log("Updating markers with:", { origin, destination });
    updateOriginMarker();
    updateDestinationMarker();
    updateHomeMarker();
  }, [updateOriginMarker, updateDestinationMarker, updateHomeMarker, origin, destination]);

  return { 
    originMarkerRef, 
    destinationMarkerRef, 
    homeMarkerRef,
    updateMarkers,
    updateHomeMarker,
    saveHomeLocation
  };
}
