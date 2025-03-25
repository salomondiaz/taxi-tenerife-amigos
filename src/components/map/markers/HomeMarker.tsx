
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

interface HomeMarkerProps {
  map: mapboxgl.Map;
  coordinates: MapCoordinates;
}

const HomeMarker: React.FC<HomeMarkerProps> = ({ map, coordinates }) => {
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
      markerEl.className = 'home-marker';
      
      // Use house icon for home marker - made larger and more visible
      markerEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `;
      
      console.log("Creating home marker at:", coordinates);
      
      // Only create and add the marker if the map is ready
      const addMarker = () => {
        try {
          markerRef.current = new mapboxgl.Marker({
            element: markerEl,
            draggable: false
          })
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map);
            
          if (coordinates.address) {
            markerRef.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText("Mi Casa: " + coordinates.address)
            );
          } else {
            markerRef.current.setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText("Mi Casa")
            );
          }
          
          // Show popup by default
          markerRef.current.togglePopup();
        } catch (error) {
          console.error("Error creating home marker:", error);
        }
      };

      // Check if the map is fully loaded before adding the marker
      if (map.loaded()) {
        addMarker();
      } else {
        map.once('load', addMarker);
      }
    } catch (error) {
      console.error("Error in HomeMarker useEffect:", error);
    }

    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch (error) {
          console.error("Error removing home marker:", error);
        }
        markerRef.current = null;
      }
      map.off('load', () => {}); // Clean up any load event listeners
    };
  }, [map, coordinates]);

  // Update marker position if coordinates change
  React.useEffect(() => {
    if (markerRef.current && coordinates) {
      try {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
        
        if (coordinates.address) {
          markerRef.current.setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText("Mi Casa: " + coordinates.address)
          );
        }
      } catch (error) {
        console.error("Error updating home marker:", error);
      }
    }
  }, [coordinates]);

  return null; // This is a non-visual component that manipulates the map directly
};

export default HomeMarker;
