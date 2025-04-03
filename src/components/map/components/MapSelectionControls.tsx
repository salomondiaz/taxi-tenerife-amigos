
import React, { useState } from 'react';
import { MapSelectionMode } from '../types';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Search, Target, Home } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MapSelectionControlsProps {
  allowMapSelection: boolean;
  selectionMode: MapSelectionMode;
  setSelectionMode: (mode: MapSelectionMode) => void;
  onUseCurrentLocation?: () => void;
  onSearchLocation?: (query: string, type: 'origin' | 'destination') => void;
}

const MapSelectionControls: React.FC<MapSelectionControlsProps> = ({
  allowMapSelection,
  selectionMode,
  setSelectionMode,
  onUseCurrentLocation,
  onSearchLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  if (!allowMapSelection) return null;
  
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
      onSearchLocation(searchQuery, type);
      setShowSearchInput(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
      <div className="flex flex-col bg-white p-3 rounded-lg shadow-md gap-2">
        <Button 
          size="sm" 
          variant={selectionMode === 'origin' ? "default" : "outline"}
          onClick={() => setSelectionMode(selectionMode === 'origin' ? 'none' : 'origin')}
          className="flex items-center gap-2 w-full"
        >
          <MapPin size={18} className="text-blue-500" />
          {selectionMode === 'origin' ? 'Cancelar selección' : 'Seleccionar origen'}
        </Button>
        
        <Button 
          size="sm" 
          variant={selectionMode === 'destination' ? "default" : "outline"}
          onClick={() => setSelectionMode(selectionMode === 'destination' ? 'none' : 'destination')}
          className="flex items-center gap-2 w-full"
        >
          <Navigation size={18} className="text-red-500" />
          {selectionMode === 'destination' ? 'Cancelar selección' : 'Seleccionar destino'}
        </Button>

        {onUseCurrentLocation && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onUseCurrentLocation}
            className="flex items-center gap-2 w-full"
          >
            <Target size={18} />
            Usar mi ubicación actual
          </Button>
        )}

        {onSearchLocation && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="flex items-center gap-2 w-full"
            >
              <Search size={18} />
              Buscar ubicación
            </Button>

            {showSearchInput && (
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="Dirección o lugar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSearch('origin')}
                    className="flex-1"
                  >
                    Como origen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleSearch('destination')}
                    className="flex-1"
                  >
                    Como destino
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapSelectionControls;
