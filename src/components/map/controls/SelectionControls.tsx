
import React, { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface CreateSelectionControlsProps {
  selectionMode: 'origin' | 'destination' | null;
  setSelectionMode: (mode: 'origin' | 'destination' | null) => void;
}

export const createSelectionControls = ({ 
  selectionMode, 
  setSelectionMode 
}: CreateSelectionControlsProps) => {
  
  return (controlDiv: HTMLDivElement) => {
    // Create the UI button container
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    controlDiv.style.display = 'flex';
    controlDiv.style.gap = '5px';
    
    // Create the Origin button
    const originButton = document.createElement('button');
    originButton.innerText = 'Seleccionar Origen';
    originButton.style.backgroundColor = selectionMode === 'origin' ? '#4285F4' : '#fff';
    originButton.style.color = selectionMode === 'origin' ? 'white' : 'black';
    originButton.style.border = '1px solid #ccc';
    originButton.style.borderRadius = '4px';
    originButton.style.padding = '8px 12px';
    originButton.style.cursor = 'pointer';
    
    // Create the Destination button
    const destinationButton = document.createElement('button');
    destinationButton.innerText = 'Seleccionar Destino';
    destinationButton.style.backgroundColor = selectionMode === 'destination' ? '#DB4437' : '#fff';
    destinationButton.style.color = selectionMode === 'destination' ? 'white' : 'black';
    destinationButton.style.border = '1px solid #ccc';
    destinationButton.style.borderRadius = '4px';
    destinationButton.style.padding = '8px 12px';
    destinationButton.style.cursor = 'pointer';
    
    // Add click handlers
    originButton.onclick = (e) => {
      e.stopPropagation(); // Evitar que el evento de clic llegue al mapa
      setSelectionMode(selectionMode === 'origin' ? null : 'origin');
      
      if (selectionMode !== 'origin') {
        toast({
          title: "Selección de origen activada",
          description: "Haz clic en el mapa para seleccionar el punto de origen"
        });
      }
    };
    
    destinationButton.onclick = (e) => {
      e.stopPropagation(); // Evitar que el evento de clic llegue al mapa
      setSelectionMode(selectionMode === 'destination' ? null : 'destination');
      
      if (selectionMode !== 'destination') {
        toast({
          title: "Selección de destino activada",
          description: "Haz clic en el mapa para seleccionar el punto de destino"
        });
      }
    };
    
    // Add buttons to the control div
    controlDiv.appendChild(originButton);
    controlDiv.appendChild(destinationButton);
  };
};

interface RenderFloatingButtonProps {
  selectionMode: 'origin' | 'destination' | null;
  setSelectionMode: (mode: 'origin' | 'destination' | null) => void;
  showDestinationSelection: boolean;
}

export const renderFloatingButton = ({
  selectionMode,
  setSelectionMode,
  showDestinationSelection
}: RenderFloatingButtonProps) => {
  if (!showDestinationSelection || selectionMode === 'destination') return null;
  
  return (
    <button 
      className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      onClick={() => {
        setSelectionMode('destination');
        toast({
          title: "Selección de destino activada",
          description: "Haz clic en el mapa para seleccionar tu destino"
        });
      }}
    >
      <span>Seleccionar destino</span>
    </button>
  );
};
