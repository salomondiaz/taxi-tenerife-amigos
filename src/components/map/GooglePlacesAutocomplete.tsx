
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { MapCoordinates } from './types';
import { Search, X, Loader2 } from 'lucide-react';

// Definir la interfaz para las props del componente
interface GooglePlacesAutocompleteProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected?: (place: MapCoordinates) => void;
  className?: string;
  apiKey: string;
  label?: string;
  id?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  placeholder = 'Buscar dirección',
  value,
  onChange,
  onPlaceSelected,
  className = '',
  apiKey,
  label,
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar el script de la API de Google Places
  useEffect(() => {
    if (!apiKey) {
      console.error('Google API key is missing');
      return;
    }
    
    if (window.google?.maps?.places) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('Google Places API loaded successfully');
    };
    script.onerror = () => {
      console.error('Error loading Google Places API');
      toast({
        title: 'Error',
        description: 'No se pudo cargar la API de Google Places',
        variant: 'destructive'
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      // No eliminamos el script para evitar recargas innecesarias
      // ya que podría ser usado por otros componentes
    };
  }, [apiKey]);

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return;
    
    try {
      const options: google.maps.places.AutocompleteOptions = {
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        strictBounds: false,
        componentRestrictions: { country: 'es' }
      };
      
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      
      // Configurar el área preferente cerca de Tenerife
      const tenerifeBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(28.00, -16.92), // Esquina suroeste
        new google.maps.LatLng(28.59, -16.10)  // Esquina noreste
      );
      
      autocompleteRef.current.setBounds(tenerifeBounds);
      
      // Añadir listener para cuando se selecciona un lugar
      const placeChangedListener = autocompleteRef.current.addListener('place_changed', () => {
        setIsLoading(true);
        const place = autocompleteRef.current?.getPlace();
        
        if (!place || !place.geometry || !place.geometry.location) {
          toast({
            title: 'Lugar no encontrado',
            description: 'No se ha podido obtener información sobre este lugar',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        // Obtener las coordenadas y la dirección formateada
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        
        console.log('Lugar seleccionado:', { lat, lng, address });
        
        // Llamar a la función de callback con las coordenadas
        if (onPlaceSelected) {
          onPlaceSelected({
            lat,
            lng,
            address
          });
        }
        
        // Actualizar el valor del input con la dirección formateada
        onChange(address);
        setIsLoading(false);
      });
      
      return () => {
        // Limpiar listener cuando el componente se desmonte
        if (placeChangedListener) {
          google.maps.event.removeListener(placeChangedListener);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
      toast({
        title: 'Error',
        description: 'No se pudo inicializar el autocompletado de direcciones',
        variant: 'destructive'
      });
    }
  }, [scriptLoaded, onChange, onPlaceSelected]);

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id || "google-places-input"} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        
        <Input
          id={id || "google-places-input"}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 w-full"
        />
        
        {isLoading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 size={16} className="animate-spin text-gray-400" />
          </div>
        ) : value ? (
          <button 
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default GooglePlacesAutocomplete;
