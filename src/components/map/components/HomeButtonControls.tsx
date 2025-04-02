
import React from 'react';
import { Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HomeButtonControlsProps {
  allowHomeEditing?: boolean;
  handleSaveHomeLocation: () => boolean;
}

const HomeButtonControls: React.FC<HomeButtonControlsProps> = ({
  allowHomeEditing = false,
  handleSaveHomeLocation
}) => {
  if (!allowHomeEditing) return null;
  
  const onSaveHome = () => {
    if (handleSaveHomeLocation()) {
      toast({
        title: "Casa guardada",
        description: "Se ha guardado tu casa correctamente"
      });
    } else {
      toast({
        title: "No hay origen seleccionado",
        description: "Primero selecciona una ubicación",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="absolute top-20 right-4 z-10 bg-white p-3 rounded-lg shadow-md">
      <button
        onClick={onSaveHome}
        className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        <Home className="mr-2" size={16} />
        Guardar como Casa
      </button>
    </div>
  );
};

export default HomeButtonControls;
