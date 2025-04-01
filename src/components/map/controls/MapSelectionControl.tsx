
import React from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Target, Search, Home } from 'lucide-react';
import { MapSelectionMode } from '../types';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface MapSelectionControlProps {
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation: () => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

const MapSelectionControl: React.FC<MapSelectionControlProps> = ({
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
  onSearchLocation
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const handleSearch = (type: 'origin' | 'destination') => {
    if (!searchQuery.trim()) {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor introduce una dirección o lugar",
        variant: "destructive"
      });
      return;
    }
    
    if (onSearchLocation) {
      onSearchLocation(searchQuery + ', Tenerife', type);
    }
  };

  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col space-y-2 bg-white p-2 rounded-md shadow-md max-w-[250px]">
      <div className="flex flex-col space-y-1">
        <Button 
          size="sm" 
          variant={selectionMode === 'origin' ? "default" : "outline"}
          onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
          className="flex items-center"
        >
          <MapPin size={16} className="mr-2 text-blue-500" />
          {selectionMode === 'origin' ? 'Seleccionando origen...' : 'Seleccionar origen (azul)'}
        </Button>
        
        <Button 
          size="sm" 
          variant={selectionMode === 'destination' ? "default" : "outline"}
          onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
          className="flex items-center"
        >
          <Navigation size={16} className="mr-2 text-red-500" />
          {selectionMode === 'destination' ? 'Seleccionando destino...' : 'Seleccionar destino (rojo)'}
        </Button>
      </div>
      
      <div className="w-full h-px bg-gray-200 my-1"></div>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={onUseCurrentLocation}
        className="flex items-center"
      >
        <Target size={16} className="mr-2" />
        Usar ubicación actual
      </Button>
      
      <div className="flex flex-col space-y-2 mt-2 border-t border-gray-200 pt-2">
        <div className="text-xs text-gray-500 font-medium">Buscar lugar:</div>
        <Input
          placeholder="Buscar lugar en Tenerife"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs py-1"
        />
        
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSearch('origin')}
            className="flex items-center flex-1 h-8 text-xs"
          >
            <Search size={12} className="mr-1 text-blue-500" />
            Origen
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSearch('destination')}
            className="flex items-center flex-1 h-8 text-xs"
          >
            <Search size={12} className="mr-1 text-red-500" />
            Destino
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapSelectionControl;
