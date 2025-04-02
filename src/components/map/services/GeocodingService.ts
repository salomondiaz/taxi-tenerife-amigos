
import { toast } from '@/hooks/use-toast';

// Function to reverse geocode coordinates to an address
export const reverseGeocode = (
  lat: number,
  lng: number,
  callback: (address: string) => void
) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    toast({
      title: "Error",
      description: "No se pudo cargar la API de Google Maps",
      variant: "destructive"
    });
    callback("Ubicación seleccionada");
    return;
  }

  const geocoder = new google.maps.Geocoder();
  const latLng = new google.maps.LatLng(lat, lng);

  geocoder.geocode({ 'location': latLng }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results && results[0]) {
        const address = results[0].formatted_address;
        callback(address);
      } else {
        console.error('No address found for coordinates:', lat, lng);
        callback("Ubicación seleccionada");
      }
    } else {
      console.error('Geocoder failed due to:', status);
      callback("Ubicación seleccionada");
    }
  });
};

// Function to geocode an address to coordinates
export const geocode = (
  address: string,
  callback: (lat: number, lng: number, formattedAddress: string) => void,
  errorCallback?: () => void
) => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    toast({
      title: "Error",
      description: "No se pudo cargar la API de Google Maps",
      variant: "destructive"
    });
    if (errorCallback) errorCallback();
    return;
  }

  const geocoder = new google.maps.Geocoder();
  
  // Add Tenerife to the search query if not already included
  const searchAddress = address.toLowerCase().includes('tenerife') ? 
    address : `${address}, Tenerife, Spain`;

  geocoder.geocode({ 'address': searchAddress }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const formattedAddress = results[0].formatted_address;
        callback(lat, lng, formattedAddress);
      } else {
        console.error('No coordinates found for address:', address);
        if (errorCallback) errorCallback();
      }
    } else {
      console.error('Geocoder failed due to:', status);
      if (errorCallback) errorCallback();
    }
  });
};
