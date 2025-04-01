
import { MapPin, Navigation } from 'lucide-react';
import { MapSelectionMode } from '../types';
import { toast } from '@/hooks/use-toast';

interface SelectionControlsProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
}

interface FloatingButtonControlsProps extends SelectionControlsProps {
  showDestinationSelection: boolean;
}

export function createSelectionControls({ selectionMode, setSelectionMode }: SelectionControlsProps) {
  return function(controlDiv: HTMLDivElement) {
    controlDiv.style.padding = '10px';
    controlDiv.style.display = 'flex';
    controlDiv.style.justifyContent = 'center';
    controlDiv.style.alignItems = 'center';
    
    // Crear contenedor
    const controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderRadius = '8px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    controlUI.style.display = 'flex';
    controlUI.style.padding = '6px';
    controlUI.style.gap = '6px';
    controlDiv.appendChild(controlUI);
    
    // Botón para seleccionar origen
    const originButton = document.createElement('button');
    originButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Origen</span>
      </div>
    `;
    originButton.style.border = 'none';
    originButton.style.borderRadius = '6px';
    originButton.style.cursor = 'pointer';
    originButton.style.fontFamily = 'system-ui, sans-serif';
    originButton.style.fontSize = '14px';
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#EBF5FF' : 'transparent';
    originButton.style.color = selectionMode === 'origin' ? '#2563EB' : '#4B5563';
    
    originButton.addEventListener('click', () => {
      const newMode = selectionMode === 'origin' ? 'none' : 'origin';
      setSelectionMode(newMode);
    });
    
    controlUI.appendChild(originButton);
    
    // Botón para seleccionar destino
    const destinationButton = document.createElement('button');
    destinationButton.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
        <span>Destino</span>
      </div>
    `;
    destinationButton.style.border = 'none';
    destinationButton.style.borderRadius = '6px';
    destinationButton.style.cursor = 'pointer';
    destinationButton.style.fontFamily = 'system-ui, sans-serif';
    destinationButton.style.fontSize = '14px';
    destinationButton.style.backgroundColor = selectionMode === 'destination' ? '#FEE2E2' : 'transparent';
    destinationButton.style.color = selectionMode === 'destination' ? '#E11D48' : '#4B5563';
    
    destinationButton.addEventListener('click', () => {
      const newMode = selectionMode === 'destination' ? 'none' : 'destination';
      setSelectionMode(newMode);
    });
    
    controlUI.appendChild(destinationButton);
  };
}

export function renderFloatingButton({ selectionMode, setSelectionMode, showDestinationSelection }: FloatingButtonControlsProps) {
  if (!showDestinationSelection) return null;

  // Si no está en modo de selección, mostrar botón flotante para seleccionar destino
  const handleClick = () => {
    if (selectionMode === 'destination') {
      setSelectionMode('none');
      toast({
        title: "Selección cancelada",
        description: "Has cancelado la selección de destino"
      });
    } else {
      setSelectionMode('destination');
      toast({
        title: "Selección de destino activada",
        description: "Haz clic en el mapa para seleccionar el punto de destino"
      });
    }
  };

  return (
    <div className="absolute bottom-5 right-5 z-10">
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${
          selectionMode === 'destination'
            ? 'bg-red-100 text-red-600 border border-red-200'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {selectionMode === 'destination' ? (
          <>
            <Navigation size={18} className="text-red-600" />
            <span>Cancelar selección</span>
          </>
        ) : (
          <>
            <Navigation size={18} className="text-red-600" />
            <span>Seleccionar destino</span>
          </>
        )}
      </button>
    </div>
  );
}
