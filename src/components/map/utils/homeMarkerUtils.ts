
import { MapCoordinates } from '../types';

// Create home marker element
export const createHomeMarkerElement = () => {
  const markerEl = document.createElement('div');
  markerEl.className = 'home-marker';
  markerEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#4CAF50" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/>
      <path d="M9 22V12h6v10"/>
      <path d="M2 10.6L12 2l10 8.6"/>
    </svg>
  `;
  return markerEl;
};

// Create edit button for home marker
export const createEditButton = () => {
  const editButton = document.createElement('div');
  editButton.className = 'marker-edit-button';
  editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  `;
  editButton.style.cssText = `
    position: absolute;
    top: -10px;
    right: -10px;
    background: #2196F3;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    z-index: 10;
  `;
  return editButton;
};

// Create pulse circle effect for home marker
export const createPulseCircle = () => {
  const pulseCircle = document.createElement('div');
  pulseCircle.className = 'marker-pulse';
  pulseCircle.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.3);
    z-index: -1;
    animation: pulse 2s infinite;
  `;
  return pulseCircle;
};

// Add marker styles to document
export const addMarkerStyles = () => {
  if (!document.getElementById('home-marker-styles')) {
    const style = document.createElement('style');
    style.id = 'home-marker-styles';
    style.innerHTML = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        70% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
      }
      .home-marker {
        position: relative;
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
      .marker-edit-button:hover {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);
  }
};

// Create HTML for the normal popup
export const createNormalPopupHTML = (address: string) => {
  return `
    <div class="p-2">
      <h3 class="font-bold text-green-700 mb-1">Mi Casa</h3>
      <p class="text-sm text-gray-600 mb-2">${address}</p>
      <button class="edit-home-button bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded">
        Editar ubicación
      </button>
    </div>
  `;
};

// Create HTML for the editing popup
export const createEditingPopupHTML = () => {
  return `
    <div class="p-2">
      <h3 class="font-bold text-blue-700 mb-1">Editando Mi Casa</h3>
      <p class="text-sm text-gray-600 mb-2">Arrastra el marcador para mover la ubicación</p>
      <div class="flex space-x-2">
        <button class="save-home-button bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2 rounded">
          Guardar
        </button>
        <button class="cancel-home-button bg-gray-500 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  `;
};
