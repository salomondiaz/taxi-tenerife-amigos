
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const GOOGLE_API_KEY_STORAGE_KEY = 'google_maps_api_key';

export function useGoogleMapKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Cargar la clave API desde localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setIsValidKey(true);
    } else {
      // Clave API proporcionada por el usuario
      const defaultKey = 'AIzaSyCbfe8aqbD8YBmCZzNA1wkJrtLFeznyMLI';
      setApiKey(defaultKey);
      localStorage.setItem(GOOGLE_API_KEY_STORAGE_KEY, defaultKey);
      setIsValidKey(true);
    }
  }, []);

  // Guardar clave API
  const saveApiKey = (key: string) => {
    if (!key) {
      toast({
        title: "Clave API vacía",
        description: "Por favor, introduce una clave API válida",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(GOOGLE_API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setIsValidKey(true);
    setShowKeyInput(false);
    
    toast({
      title: "Clave API guardada",
      description: "Tu clave API de Google Maps ha sido guardada",
    });
    
    // Recargar la página para aplicar la nueva clave
    window.location.reload();
  };

  return {
    apiKey,
    setApiKey: (key: string) => {
      setApiKey(key);
    },
    isValidKey,
    showKeyInput,
    setShowKeyInput,
    saveApiKey,
  };
}
