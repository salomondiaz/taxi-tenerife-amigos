
import { MapCoordinates } from "../types";

export const setHomeMarkerLocation = (
  marker: mapboxgl.Marker,
  coordinates: MapCoordinates
) => {
  marker.setLngLat([coordinates.lng, coordinates.lat]);
};

// Function to create the main marker element
export const createHomeMarkerElement = () => {
  const el = document.createElement("div");
  el.className = "home-marker";
  el.style.width = "40px";
  el.style.height = "40px";
  el.style.borderRadius = "50%";
  el.style.backgroundColor = "#4CAF50";
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.25)";
  el.style.cursor = "pointer";
  el.style.position = "relative";
  return el;
};

// Function to create edit button
export const createEditButton = (id: string = 'edit-home') => {
  const button = document.createElement("div");
  button.className = "home-marker-edit";
  button.id = id;
  button.style.position = "absolute";
  button.style.bottom = "-5px";
  button.style.right = "-5px";
  button.style.width = "18px";
  button.style.height = "18px";
  button.style.backgroundColor = "#2196F3";
  button.style.borderRadius = "50%";
  button.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
  button.style.cursor = "pointer";
  button.innerHTML = "✏️";
  button.style.fontSize = "10px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  return button;
};

// Function to create pulse circle effect
export const createPulseCircle = (id: string = 'pulse-circle') => {
  const pulse = document.createElement("div");
  pulse.className = "pulse-circle";
  pulse.id = id;
  pulse.style.position = "absolute";
  pulse.style.width = "100%";
  pulse.style.height = "100%";
  pulse.style.borderRadius = "50%";
  pulse.style.backgroundColor = "transparent";
  pulse.style.border = "3px solid rgba(76, 175, 80, 0.4)";
  pulse.style.animation = "pulse 2s infinite";
  return pulse;
};

// Function to add CSS styles for markers
export const addMarkerStyles = () => {
  const styleElement = document.getElementById("marker-styles");
  if (styleElement) return; // Styles already added

  const style = document.createElement("style");
  style.id = "marker-styles";
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      70% { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(1); opacity: 0; }
    }
    .home-marker {
      z-index: 1;
      cursor: pointer;
    }
    .home-marker-editing {
      background-color: #FF9800 !important;
    }
    .home-marker-popup {
      padding: 8px;
      font-family: Arial, sans-serif;
      max-width: 200px;
    }
    .home-popup-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .home-popup-address {
      font-size: 12px;
      margin-bottom: 8px;
      color: #555;
    }
    .edit-home-button, .save-home-button {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
    }
    .save-home-button {
      background-color: #4CAF50;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Creates HTML content for a home marker popup in editing mode
 */
export const createEditingPopupHTML = (): string => {
  return `
    <div class="home-marker-popup home-marker-popup-editing">
      <h3 class="home-popup-title">Editar ubicación de casa</h3>
      <p class="home-popup-description">Arrastra el marcador para ajustar la ubicación</p>
      <button class="save-home-button">Guardar ubicación</button>
    </div>
  `;
};

/**
 * Creates HTML content for a home marker popup in normal mode
 */
export const createNormalPopupHTML = (address: string): string => {
  return `
    <div class="home-marker-popup">
      <h3 class="home-popup-title">Mi Casa</h3>
      <p class="home-popup-address">${address}</p>
      <button class="edit-home-button">Editar ubicación</button>
    </div>
  `;
};

/**
 * Gets address for a location using reverse geocoding
 */
export const getAddressForLocation = async (
  coordinates: { lat: number; lng: number },
  mapboxToken: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?access_token=${mapboxToken}`
    );
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    
    return "Ubicación sin dirección";
  } catch (error) {
    console.error("Error getting address:", error);
    return "Ubicación sin dirección";
  }
};
