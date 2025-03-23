
import mapboxgl from 'mapbox-gl';
import { MapCoordinates } from './types';

export const addOriginMarker = (
  map: mapboxgl.Map, 
  coordinates: MapCoordinates
): mapboxgl.Marker => {
  const markerEl = document.createElement('div');
  markerEl.className = 'origin-marker';
  markerEl.style.width = '20px';
  markerEl.style.height = '20px';
  markerEl.style.borderRadius = '50%';
  markerEl.style.backgroundColor = '#3b82f6';
  markerEl.style.border = '3px solid #ffffff';
  markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  
  const marker = new mapboxgl.Marker(markerEl)
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
  markerEl.style.width = '20px';
  markerEl.style.height = '20px';
  markerEl.style.borderRadius = '50%';
  markerEl.style.backgroundColor = '#ef4444';
  markerEl.style.border = '3px solid #ffffff';
  markerEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  
  const marker = new mapboxgl.Marker(markerEl)
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

export const drawRoute = (
  map: mapboxgl.Map, 
  origin: MapCoordinates, 
  destination: MapCoordinates
): void => {
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat]
        ]
      }
    }
  });
  
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#1E88E5',
      'line-width': 4,
      'line-opacity': 0.7
    }
  });
};

export const fitMapToBounds = (
  map: mapboxgl.Map,
  origin: MapCoordinates,
  destination: MapCoordinates
): void => {
  const bounds = new mapboxgl.LngLatBounds()
    .extend([origin.lng, origin.lat])
    .extend([destination.lng, destination.lat]);
    
  map.fitBounds(bounds, {
    padding: 60,
    maxZoom: 14
  });
};

export const geocodeAddress = async (
  address: string,
  apiKey: string
): Promise<MapCoordinates | null> => {
  try {
    const searchQuery = `${address}, Tenerife, Spain`;
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${apiKey}&limit=1&country=es&proximity=-16.5,28.4`
    );
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lng, lat, address: data.features[0].place_name };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
