
/**
 * Create HTML for the regular home marker popup
 */
export const createNormalPopupHTML = (address: string) => {
  return `
    <div class="home-popup">
      <h3 class="font-medium text-lg">Tu casa</h3>
      <p class="text-sm text-gray-600">${address}</p>
      <button class="edit-home-button px-3 py-1 mt-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
        Editar ubicación
      </button>
    </div>
  `;
};

/**
 * Create HTML for the editing mode popup
 */
export const createEditingPopupHTML = () => {
  return `
    <div class="home-popup-editing">
      <h3 class="font-medium text-lg">Editando ubicación de casa</h3>
      <p class="text-sm text-gray-600">Arrastra el marcador al punto deseado</p>
      <button class="save-home-button px-3 py-1 mt-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
        Guardar posición
      </button>
    </div>
  `;
};

/**
 * Get address for a given location using geocoding
 */
export const getAddressForLocation = async (coords: { lat: number; lng: number }, token: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${token}&limit=1&language=es`
    );
    
    if (!response.ok) {
      throw new Error(`Error in geocoding request: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    
    return "Ubicación desconocida";
  } catch (error) {
    console.error("Error in geocoding:", error);
    return "Ubicación desconocida";
  }
};
