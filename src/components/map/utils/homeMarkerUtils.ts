
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

export const getAddressForLocation = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return "Dirección desconocida";
  } catch (error) {
    console.error("Error getting address:", error);
    return "Error al obtener dirección";
  }
};
