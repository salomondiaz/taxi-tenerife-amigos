
import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { toast } from '@/hooks/use-toast';
import { 
  createEditingPopupHTML, 
  createNormalPopupHTML, 
  getAddressForLocation 
} from '../utils/homeMarkerUtils';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';

interface UseHomeMarkerEditProps {
  map: mapboxgl.Map;
  markerRef: React.MutableRefObject<mapboxgl.Marker | null>;
  coordinates: MapCoordinates;
}

export function useHomeMarkerEdit({ 
  map, 
  markerRef, 
  coordinates 
}: UseHomeMarkerEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { editFavoriteLocation } = useFavoriteLocations();
  
  /**
   * Toggle edit mode for the home marker
   */
  const toggleEditMode = useCallback(() => {
    if (!markerRef.current) return;
    
    setIsEditing(!isEditing);
    
    if (!isEditing) {
      // Enter edit mode
      markerRef.current.setDraggable(true);
      const element = markerRef.current.getElement();
      if (element) {
        element.classList.add('home-marker-editing');
      }
      
      toast({
        title: "Modo de edición activado",
        description: "Arrastra el marcador para reubicar tu casa, luego haz clic en él para guardar",
      });
      
      // Remove existing popup
      if (markerRef.current.getPopup()) {
        markerRef.current.getPopup().remove();
      }
      
      // Create save popup
      const savePopup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(createEditingPopupHTML());
      
      markerRef.current.setPopup(savePopup);
      markerRef.current.togglePopup();
      
      savePopup.on('open', () => {
        const saveBtn = document.querySelector('.save-home-button');
        if (saveBtn) {
          saveBtn.addEventListener('click', saveHomePosition);
        }
      });
    } else {
      // Exit edit mode
      saveHomePosition();
    }
  }, [isEditing, markerRef]);
  
  /**
   * Save the current home marker position
   */
  const saveHomePosition = useCallback(async () => {
    if (!markerRef.current) return;
    
    // Get current marker position
    const lngLat = markerRef.current.getLngLat();
    const newCoords = {
      lat: lngLat.lat,
      lng: lngLat.lng
    };
    
    // Get the access token from the map
    const token = mapboxgl.accessToken;
    
    try {
      // Get address for the new location
      const address = await getAddressForLocation(newCoords, token);
      
      // Update the home location in localStorage and state
      updateHomeLocation({
        ...newCoords,
        address: address
      });
    } catch (error) {
      console.error("Error with geocoding:", error);
      updateHomeLocation(newCoords);
    }
  }, [markerRef]);
  
  /**
   * Update the home location in storage and update the marker UI
   */
  const updateHomeLocation = useCallback((newCoords: MapCoordinates) => {
    if (!markerRef.current) return;
    
    // Update the home location in localStorage
    editFavoriteLocation('home', {
      coordinates: newCoords
    });
    
    // Disable dragging and update styling
    markerRef.current.setDraggable(false);
    const element = markerRef.current.getElement();
    if (element) {
      element.classList.remove('home-marker-editing');
    }
    
    // Update popup content
    const normalPopup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(createNormalPopupHTML(newCoords.address || ""));
    
    markerRef.current.setPopup(normalPopup);
    markerRef.current.togglePopup();
    
    normalPopup.on('open', () => {
      const editBtn = document.querySelector('.edit-home-button');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          toggleEditMode();
        });
      }
    });
    
    setIsEditing(false);
    
    toast({
      title: "Ubicación actualizada",
      description: "La ubicación de tu casa ha sido actualizada con éxito"
    });
  }, [editFavoriteLocation, markerRef, toggleEditMode]);
  
  return {
    isEditing,
    toggleEditMode,
    saveHomePosition
  };
}
