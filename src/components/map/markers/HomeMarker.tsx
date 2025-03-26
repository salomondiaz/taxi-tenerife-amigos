
import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFavoriteLocations } from '@/hooks/useFavoriteLocations';

interface HomeMarkerProps {
  map: mapboxgl.Map;
  coordinates: MapCoordinates;
}

const HomeMarker: React.FC<HomeMarkerProps> = ({ map, coordinates }) => {
  const markerRef = React.useRef<mapboxgl.Marker | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { editFavoriteLocation } = useFavoriteLocations();

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
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      `;
      
      // Add Edit button
      const editButton = document.createElement('button');
      editButton.className = 'edit-home-button';
      editButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      `;
      editButton.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      markerEl.appendChild(editButton);
      
      // Add pulse effect for better visibility
      const pulseCircle = document.createElement('div');
      pulseCircle.className = 'pulse-circle';
      markerEl.appendChild(pulseCircle);
      
      // Add CSS for pulse effect
      const style = document.createElement('style');
      style.textContent = `
        .pulse-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(76, 175, 80, 0.3);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        .home-marker-editing {
          opacity: 0.7;
          cursor: move;
        }
      `;
      document.head.appendChild(style);
      
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
            .setHTML(`
              <div>
                <h3 class="font-bold">Mi Casa</h3>
                <p class="text-sm">${coordinates.address || "Mi hogar"}</p>
                <button class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded edit-home-button">
                  Editar ubicación
                </button>
              </div>
            `);
          
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
      
      const toggleEditMode = () => {
        if (!markerRef.current) return;
        
        setIsEditing(!isEditing);
        
        if (!isEditing) {
          // Enter edit mode
          markerRef.current.setDraggable(true);
          markerEl.classList.add('home-marker-editing');
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
            .setHTML(`
              <div>
                <h3 class="font-bold">Editando ubicación</h3>
                <p class="text-sm">Arrastra el marcador a tu ubicación preferida</p>
                <button class="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded save-home-button">
                  Guardar posición
                </button>
              </div>
            `);
          
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
      };
      
      const saveHomePosition = () => {
        if (!markerRef.current) return;
        
        // Get current marker position
        const lngLat = markerRef.current.getLngLat();
        const newCoords = {
          lat: lngLat.lat,
          lng: lngLat.lng
        };
        
        // Geocode the new position to get address
        const geocoder = new mapboxgl.Geocoder({
          accessToken: map.getStyle().sources.openmaptiles.url.includes('mapbox') 
            ? map.getStyle().sources.openmaptiles.url.split('access_token=')[1]
            : ''
        });
        
        if (geocoder.query) {
          geocoder.query(`${newCoords.lng},${newCoords.lat}`, (err, result) => {
            if (err) {
              console.error("Error geocoding home position:", err);
              updateHomeLocation(newCoords);
              return;
            }
            
            if (result && result.features && result.features.length > 0) {
              const address = result.features[0].place_name;
              updateHomeLocation({
                ...newCoords,
                address: address
              });
            } else {
              updateHomeLocation(newCoords);
            }
          });
        } else {
          // Fallback for Google Maps
          try {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat: newCoords.lat, lng: newCoords.lng } }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                updateHomeLocation({
                  ...newCoords,
                  address: results[0].formatted_address
                });
              } else {
                updateHomeLocation(newCoords);
              }
            });
          } catch (error) {
            console.error("Error with Google geocoding:", error);
            updateHomeLocation(newCoords);
          }
        }
      };
      
      const updateHomeLocation = (newCoords: MapCoordinates) => {
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
          .setHTML(`
            <div>
              <h3 class="font-bold">Mi Casa</h3>
              <p class="text-sm">${newCoords.address || "Mi hogar"}</p>
              <button class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded edit-home-button">
                Editar ubicación
              </button>
            </div>
          `);
        
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
  }, [map, coordinates, editFavoriteLocation, isEditing]);

  // Update marker position if coordinates change
  React.useEffect(() => {
    if (markerRef.current && coordinates && !isEditing) {
      try {
        markerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
        
        if (coordinates.address) {
          const popup = markerRef.current.getPopup();
          if (popup) {
            popup.setHTML(`
              <div>
                <h3 class="font-bold">Mi Casa</h3>
                <p class="text-sm">${coordinates.address || "Mi hogar"}</p>
                <button class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded edit-home-button">
                  Editar ubicación
                </button>
              </div>
            `);
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
