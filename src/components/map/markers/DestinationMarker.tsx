
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

    // Check if the map is fully loaded and has a container
    if (!map.getContainer()) {
      console.error("Map container is not available");
      return;
    }

    try {
      const markerEl = document.createElement('div');
      markerEl.className = 'destination-marker';
      
      // Use red color for destination marker (increased size)
      markerEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#ea384c" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ea384c"/>
        </svg>
      `;
      
      // Add pulse effect
      const pulseCircle = document.createElement('div');
      pulseCircle.className = 'destination-pulse-circle';
      markerEl.appendChild(pulseCircle);
      
      // Add CSS for pulse effect
      const style = document.createElement('style');
      style.textContent = `
        .destination-pulse-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(234, 56, 76, 0.3);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          animation: destination-pulse 2s infinite;
        }
        
        @keyframes destination-pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      console.log("Creating destination marker at:", coordinates);
      
      // Only create and add the marker if the map is ready
      const addMarker = () => {
        try {
          markerRef.current = new mapboxgl.Marker({
            element: markerEl,
            draggable: !!onDragEnd
          })
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map);
            
          if (coordinates.address) {
            markerRef.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText("Destino: " + coordinates.address)
            );
          } else {
            markerRef.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText("Punto de destino")
            );
          }
          
          // Mostrar popup automáticamente
          markerRef.current.togglePopup();
          
          // Add drag end event listener
          if (onDragEnd && markerRef.current) {
            markerRef.current.on('dragend', () => {
              const lngLat = markerRef.current?.getLngLat();
              if (lngLat) {
                onDragEnd({ lat: lngLat.lat, lng: lngLat.lng });
              }
            });
          }
        } catch (error) {
          console.error("Error creating destination marker:", error);
        }
      };

      // Check if the map is fully loaded before adding the marker
      if (map.loaded()) {
        addMarker();
      } else {
        map.once('load', addMarker);
      }
    } catch (error) {
      console.error("Error in DestinationMarker useEffect:", error);
    }

    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch (error) {
          console.error("Error removing destination marker:", error);
        }
        markerRef.current = null;
      }
      map.off('load', () => {}); // Clean up any load event listeners
    };
  }, [map, coordinates, onDragEnd]);

  // Update marker position if coordinates change
  React.useEffect(() => {
    if (markerRef.current && coordinates) {
      try {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
        
        if (coordinates.address) {
          markerRef.current.setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText("Destino: " + coordinates.address)
          );
        } else {
          markerRef.current.setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText("Punto de destino")
          );
        }
      } catch (error) {
        console.error("Error updating destination marker:", error);
      }
    }
  }, [coordinates]);

  return null; // This is a non-visual component that manipulates the map directly
};

export default DestinationMarker;
