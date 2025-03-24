
import { useState, useEffect } from 'react';
import { API_KEY_STORAGE_KEY } from '../types';

export function useMapApiKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Cargar API key al montar
  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setShowKeyInput(false);
    } else {
      setShowKeyInput(true);
    }
  }, []);

  const handleApiKeySubmit = () => {
    setShowKeyInput(false);
  };

  return {
    apiKey,
    setApiKey,
    showKeyInput,
    setShowKeyInput,
    handleApiKeySubmit
  };
}
