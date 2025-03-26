
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

interface OriginMarkerProps {
  map: mapboxgl.Map;
  coordinates: MapCoordinates;
  onDragEnd?: (coordinates: MapCoordinates) => void;
}

const OriginMarker: React.FC<OriginMarkerProps> = ({ map, coordinates, onDragEnd }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map || !map.getContainer()) return;

    try {
      // Define marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'origin-marker';
      
      // Use pin icon for origin marker
      markerEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#1E88E5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
        </svg>
      `;
      
      // Create marker
      markerRef.current = new mapboxgl.Marker({
        element: markerEl,
        draggable: !!onDragEnd
      })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map);
      
      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h3 class="font-bold">Punto de Origen</h3>
            <p class="text-sm">${coordinates.address || "Ubicación seleccionada"}</p>
          </div>
        `);
      
      markerRef.current.setPopup(popup);
      
      // Handle drag end if callback provided
      if (onDragEnd) {
        markerRef.current.on('dragend', () => {
          if (!markerRef.current) return;
          
          const lngLat = markerRef.current.getLngLat();
          const newCoords = {
            lat: lngLat.lat,
            lng: lngLat.lng
          };
          
          // Try to geocode the new position
          try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: newCoords.lat, lng: newCoords.lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                onDragEnd({
                  ...newCoords,
                  address: results[0].formatted_address
                });
              } else {
                onDragEnd(newCoords);
              }
            });
          } catch (error) {
            console.error("Error geocoding origin position:", error);
            onDragEnd(newCoords);
          }
        });
      }
    } catch (error) {
      console.error("Error creating origin marker:", error);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, onDragEnd]);

  // Update marker position if coordinates change
  useEffect(() => {
    if (markerRef.current && coordinates) {
      markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
      
      // Update popup content if address changes
      if (coordinates.address) {
        const popup = markerRef.current.getPopup();
        if (popup) {
          popup.setHTML(`
            <div>
              <h3 class="font-bold">Punto de Origen</h3>
              <p class="text-sm">${coordinates.address}</p>
            </div>
          `);
        }
      }
    }
  }, [coordinates]);

  return null;
};

export default OriginMarker;
