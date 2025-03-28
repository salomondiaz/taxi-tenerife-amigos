
import React from 'react';

interface HomeControlProps {
  onSaveHome: () => void;
}

const HomeControl = ({ onSaveHome }: HomeControlProps) => {
  // Create a function that returns the home button creation function
  const createHomeButton = (controlDiv: HTMLDivElement) => {
    controlDiv.style.padding = '10px';
    controlDiv.style.backgroundColor = 'white';
    controlDiv.style.borderRadius = '8px';
    controlDiv.style.margin = '10px';
    controlDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    
    const button = document.createElement('button');
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.padding = '8px 12px';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    button.innerHTML = '<span style="font-size: 16px;">🏠</span> Guardar Casa';
    
    button.onclick = onSaveHome;
    
    controlDiv.appendChild(button);
  };

  // Return an object with the createHomeButton function
  return {
    createHomeButton
  };
};

export default HomeControl;
