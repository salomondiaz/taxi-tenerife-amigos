
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

interface DestinationMarkerProps {
  map: mapboxgl.Map;
  coordinates: MapCoordinates;
  onDragEnd?: (coords: MapCoordinates) => void;
}

const DestinationMarker: React.FC<DestinationMarkerProps> = ({ map, coordinates, onDragEnd }) => {
  const markerRef = React.useRef<mapboxgl.Marker | null>(null);

  React.useEffect(() => {
    if (!map) return;

    const markerEl = document.createElement('div');
    markerEl.className = 'destination-marker';
    markerEl.style.width = '20px';
    markerEl.style.height = '20px';
    markerEl.style.borderRadius = '50%';
    markerEl.style.backgroundColor = '#ef4444';
    markerEl.style.border = '3px solid #ffffff';
    markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    
    markerRef.current = new mapboxgl.Marker({
      element: markerEl,
      draggable: true
    })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map);
      
    if (coordinates.address) {
      markerRef.current.setPopup(
        new mapboxgl.Popup({ offset: 25 }).setText(coordinates.address)
      );
    }
    
    // Add drag end event listener
    if (onDragEnd && markerRef.current) {
      markerRef.current.on('dragend', () => {
        const lngLat = markerRef.current?.getLngLat();
        if (lngLat) {
          onDragEnd({ lat: lngLat.lat, lng: lngLat.lng });
        }
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, coordinates, onDragEnd]);

  // Update marker position if coordinates change
  React.useEffect(() => {
    if (markerRef.current && coordinates) {
      markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      
      if (coordinates.address) {
        markerRef.current.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(coordinates.address)
        );
      }
    }
  }, [coordinates]);

  return null; // This is a non-visual component that manipulates the map directly
};

export default DestinationMarker;
