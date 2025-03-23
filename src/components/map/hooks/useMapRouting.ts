
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

export function useMapRouting(
  map: mapboxgl.Map | null,
  origin?: MapCoordinates,
  destination?: MapCoordinates
) {
  useEffect(() => {
    if (!map || !origin || !destination) return;

    // Draw route between points
    drawRoute(map, origin, destination);
    
    // Fit map to show both points
    fitMapToBounds(map, origin, destination);
    
    return () => {
      // Clean up route when component unmounts
      if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
      }
    };
  }, [map, origin, destination]);
}

function drawRoute(
  map: mapboxgl.Map, 
  origin: MapCoordinates, 
  destination: MapCoordinates
): void {
  // Remove existing route if there is one
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  }
  
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ]
      }
    }
  });
  
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#1E88E5',
      'line-width': 4,
      'line-opacity': 0.7
    }
  });
}

function fitMapToBounds(
  map: mapboxgl.Map,
  origin: MapCoordinates,
  destination: MapCoordinates
): void {
  const bounds = new mapboxgl.LngLatBounds()
    .extend([origin.lng, origin.lat])
    .extend([destination.lng, destination.lat]);
    
  map.fitBounds(bounds, {
    padding: 60,
    maxZoom: 14
  });
}
