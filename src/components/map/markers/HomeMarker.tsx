
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { 
  createHomeMarkerElement, 
  createEditButton, 
  createPulseCircle, 
  addMarkerStyles, 
  createNormalPopupHTML 
} from '../utils/homeMarkerUtils';
import { useHomeMarkerEdit } from '../hooks/useHomeMarkerEdit';

interface HomeMarkerProps {
  map: mapboxgl.Map;
  coordinates: MapCoordinates;
}

const HomeMarker: React.FC<HomeMarkerProps> = ({ map, coordinates }) => {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const { isEditing, toggleEditMode } = useHomeMarkerEdit({ 
    map, 
    markerRef, 
    coordinates 
  });

  // Create and manage the marker
  useEffect(() => {
    if (!map) return;

    // Check if the map is fully loaded and has a container
    if (!map.getContainer()) {
      console.error("Map container is not available");
      return;
    }

    try {
      // Add marker styles
      addMarkerStyles();
      
      // Create marker elements
      const markerEl = createHomeMarkerElement();
      const editButton = createEditButton();
      const pulseCircle = createPulseCircle();
      
      markerEl.appendChild(editButton);
      markerEl.appendChild(pulseCircle);
      
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
            
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(createNormalPopupHTML(coordinates.address || ""));
          
          // Set up popup
          markerRef.current.setPopup(popup);
          
          // Show popup by default
          markerRef.current.togglePopup();
          
          // Add event listeners for edit mode
          editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEditMode();
          });
          
          popup.on('open', () => {
            const editBtn = document.querySelector('.edit-home-button');
            if (editBtn) {
              editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleEditMode();
              });
            }
          });
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
  }, [map, coordinates, toggleEditMode]);

  // Update marker position if coordinates change
  useEffect(() => {
    if (markerRef.current && coordinates && !isEditing) {
      try {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
        
        if (coordinates.address) {
          const popup = markerRef.current.getPopup();
          if (popup) {
            popup.setHTML(createNormalPopupHTML(coordinates.address));
          }
        }
      } catch (error) {
        console.error("Error updating home marker:", error);
      }
    }
  }, [coordinates, isEditing]);

  return null; // This is a non-visual component that manipulates the map directly
};

export default HomeMarker;
