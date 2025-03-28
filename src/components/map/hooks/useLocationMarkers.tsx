
import { useRef, useCallback, useEffect } from 'react';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';
import { 
  getOriginMarkerSvg, 
  getDestinationMarkerSvg, 
  createMarkerIcon 
} from '../hooks/useMapMarkerIcons';
import { reverseGeocode } from '../services/GeocodingService';

interface UseLocationMarkersProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  allowMapSelection?: boolean;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
}

export function useLocationMarkers({
  mapRef,
  origin,
  destination,
  allowMapSelection = false,
  onOriginChange,
  onDestinationChange
}: UseLocationMarkersProps) {
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);

  // Create or update the origin marker
  const updateOriginMarker = useCallback(() => {
    if (!mapRef.current || !origin) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setMap(null);
        originMarkerRef.current = null;
      }
      return;
    }

    if (originMarkerRef.current) {
      originMarkerRef.current.setPosition({ lat: origin.lat, lng: origin.lng });
    } else {
      const originIcon = createMarkerIcon(getOriginMarkerSvg());
      
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
  }, [mapRef, origin, allowMapSelection, onOriginChange]);

  // Create or update the destination marker
  const updateDestinationMarker = useCallback(() => {
    if (!mapRef.current || !destination) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null);
        destinationMarkerRef.current = null;
      }
      return;
    }

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setPosition({ lat: destination.lat, lng: destination.lng });
    } else {
      const destinationIcon = createMarkerIcon(getDestinationMarkerSvg());
      
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
  }, [mapRef, destination, allowMapSelection, onDestinationChange]);

  // Run updates when origin or destination changes
  useEffect(() => {
    updateOriginMarker();
    return () => {
      if (originMarkerRef.current) {
        originMarkerRef.current.setMap(null);
        originMarkerRef.current = null;
      }
    };
  }, [updateOriginMarker]);

  useEffect(() => {
    updateDestinationMarker();
    return () => {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setMap(null);
        destinationMarkerRef.current = null;
      }
    };
  }, [updateDestinationMarker]);

  return {
    originMarkerRef,
    destinationMarkerRef,
    updateOriginMarker,
    updateDestinationMarker
  };
}
