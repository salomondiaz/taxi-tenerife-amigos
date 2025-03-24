
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from '../types';

export const addOriginMarker = (
  map: mapboxgl.Map, 
  coordinates: MapCoordinates
): mapboxgl.Marker => {
  const markerEl = document.createElement('div');
  markerEl.className = 'origin-marker';
  markerEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
      <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `;
  
  const marker = new mapboxgl.Marker({
    element: markerEl,
    draggable: true
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);
    
  if (coordinates.address) {
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 }).setText(coordinates.address)
    );
  }
  
  return marker;
};

export const addDestinationMarker = (
  map: mapboxgl.Map, 
  coordinates: MapCoordinates
): mapboxgl.Marker => {
  const markerEl = document.createElement('div');
  markerEl.className = 'destination-marker';
  markerEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z"/>
      <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `;
  
  const marker = new mapboxgl.Marker({
    element: markerEl,
    draggable: true
  })
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);
    
  if (coordinates.address) {
    marker.setPopup(
      new mapboxgl.Popup({ offset: 25 }).setText(coordinates.address)
    );
  }
  
  return marker;
};

export const addDriverMarker = (
  map: mapboxgl.Map, 
  coordinates: { lat: number; lng: number }
): mapboxgl.Marker => {
  const markerEl = document.createElement('div');
  
  const driverIconHTML = `
    <div style="background-color: #1E88E5; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car">
        <path d="M5 11.5h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"/>
        <path d="M6 15.5v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3"/>
        <path d="m14 15.5 1-5h5l1 5"/>
        <path d="m3 15.5 1-5h5l1 5"/>
        <path d="M7 10.5h10"/>
        <path d="M13 10.5V5.5h1v5"/>
        <path d="M10 10.5V5.5h1v5"/>
      </svg>
    </div>
  `;
  
  markerEl.innerHTML = driverIconHTML;
  
  const marker = new mapboxgl.Marker(markerEl)
    .setLngLat([coordinates.lng, coordinates.lat])
    .addTo(map);
  
  return marker;
};
