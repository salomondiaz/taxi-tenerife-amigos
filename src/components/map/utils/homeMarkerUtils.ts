
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';
import { reverseGeocode } from '../services/MapboxService';

/**
 * Creates the HTML element for the home marker
 */
export const createHomeMarkerElement = (): HTMLDivElement => {
  const markerEl = document.createElement('div');
  markerEl.className = 'home-marker';
  
  // Use house icon for home marker
  markerEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  `;
  
  return markerEl;
};

/**
 * Creates the edit button element for the home marker
 */
export const createEditButton = (): HTMLButtonElement => {
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
  
  return editButton;
};

/**
 * Creates the pulse effect circle element
 */
export const createPulseCircle = (): HTMLDivElement => {
  const pulseCircle = document.createElement('div');
  pulseCircle.className = 'pulse-circle';
  return pulseCircle;
};

/**
 * Adds CSS styles for the home marker animations
 */
export const addMarkerStyles = (): void => {
  const styleId = 'home-marker-styles';
  
  // Only add styles if they don't already exist
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
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
  }
};

/**
 * Creates normal (non-editing) popup content
 */
export const createNormalPopupHTML = (address: string): string => {
  return `
    <div>
      <h3 class="font-bold">Mi Casa</h3>
      <p class="text-sm">${address || "Mi hogar"}</p>
      <button class="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded edit-home-button">
        Editar ubicación
      </button>
    </div>
  `;
};

/**
 * Creates editing mode popup content
 */
export const createEditingPopupHTML = (): string => {
  return `
    <div>
      <h3 class="font-bold">Editando ubicación</h3>
      <p class="text-sm">Arrastra el marcador a tu ubicación preferida</p>
      <button class="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded save-home-button">
        Guardar posición
      </button>
    </div>
  `;
};

/**
 * Gets the address for a location using either Mapbox or Google geocoding
 */
export const getAddressForLocation = async (
  coordinates: MapCoordinates,
  mapboxToken?: string
): Promise<string> => {
  let address = "Mi hogar";
  
  try {
    // Try Mapbox first if token is available
    if (mapboxToken) {
      address = await reverseGeocode(coordinates, mapboxToken) || "Mi hogar";
    } 
    // Fallback to Google Maps if available in the global scope
    else if (typeof google !== 'undefined') {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve) => {
        geocoder.geocode({ location: { lat: coordinates.lat, lng: coordinates.lng } }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve("Mi hogar");
          }
        });
      });
    }
  } catch (error) {
    console.error("Error getting address:", error);
  }
  
  return address;
};
