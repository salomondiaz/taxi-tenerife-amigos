
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { API_KEY_STORAGE_KEY } from './types';

interface MapApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSubmit: () => void;
  testMode: boolean;
  onSkip?: () => void;
}

const MapApiKeyInput: React.FC<MapApiKeyInputProps> = ({ 
  apiKey, 
  onApiKeyChange, 
  onSubmit, 
  testMode, 
  onSkip 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Clave API requerida",
        description: "Por favor, introduce una clave API válida",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
      
      toast({
        title: "Clave API guardada",
        description: "El mapa se cargará con tu clave API",
      });
    }, 1000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Configuración del mapa</h3>
      <p className="text-sm text-gray-600 mb-4">
        Para ver el mapa, introduce tu clave API pública de Mapbox. 
        Puedes obtener una clave en <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-tenerife-blue hover:underline">mapbox.com</a>.
      </p>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Introduce tu clave API de Mapbox"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <Button 
          onClick={handleApiKeySubmit}
          disabled={isLoading}
          className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
        >
          {isLoading ? "Verificando..." : "Guardar clave API"}
        </Button>
        {testMode && (
          <Button 
            variant="outline"
            onClick={onSkip}
            className="w-full"
          >
            Usar mapa de prueba
          </Button>
        )}
      </div>
    </Card>
  );
};

export default MapApiKeyInput;
