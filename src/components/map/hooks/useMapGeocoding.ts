
import { useEffect } from 'react';
import { MapCoordinates } from '../types';
import { geocodeAddress } from '../services/MapboxService';

interface UseMapGeocodingProps {
  apiKey: string;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  onOriginResolved?: (coords: MapCoordinates) => void;
  onDestinationResolved?: (coords: MapCoordinates) => void;
}

export function useMapGeocoding({
  apiKey,
  origin,
  destination,
  onOriginResolved,
  onDestinationResolved
}: UseMapGeocodingProps) {
  useEffect(() => {
    const resolveGeocoding = async () => {
      if (!apiKey) return;
      
      if (origin?.address && (!origin.lat || !origin.lng)) {
        const geocoded = await geocodeAddress(origin.address, apiKey);
        if (geocoded && onOriginResolved) {
          onOriginResolved({
            lat: geocoded.lat,
            lng: geocoded.lng,
            address: origin.address
          });
        }
      }
      
      if (destination?.address && (!destination.lat || !destination.lng)) {
        const geocoded = await geocodeAddress(destination.address, apiKey);
        if (geocoded && onDestinationResolved) {
          onDestinationResolved({
            lat: geocoded.lat,
            lng: geocoded.lng,
            address: destination.address
          });
        }
      }
    };
    
    resolveGeocoding();
  }, [apiKey, origin, destination, onOriginResolved, onDestinationResolved]);
}
