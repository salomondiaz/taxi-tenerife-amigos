import { MapCoordinates } from "../types";

export const setHomeMarkerLocation = (
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  markerRef: React.MutableRefObject<google.maps.Marker | null>,
  isEditing: boolean = false
) => {
  if (!markerRef.current) {
    return;
  }

  markerRef.current.setPosition(position);
  if (map) {
    map.panTo(position);
  }
};

export const createHomeMarkerElement = (isEditing: boolean = false): HTMLDivElement => {
  const markerElement = document.createElement("div");
  markerElement.className = `home-marker ${isEditing ? "home-marker-editing" : ""}`;
  markerElement.innerHTML = '<span>🏠</span>';
  return markerElement;
};

export const createEditButton = (
  onClick: () => void,
  text: string,
  className: string
): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.onclick = onClick;
  return button;
};

export const createPulseCircle = (): HTMLDivElement => {
  const pulseCircle = document.createElement("div");
  pulseCircle.className = "pulse-circle";
  return pulseCircle;
};

export const addMarkerStyles = (marker: HTMLElement): void => {
  marker.style.display = "flex";
  marker.style.alignItems = "center";
  marker.style.justifyContent = "center";
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
