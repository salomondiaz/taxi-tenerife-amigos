
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, Edit, Plus, Trash } from "lucide-react";
import { useFavoriteLocations, FavoriteLocation } from "@/hooks/useFavoriteLocations";
import { toast } from "@/hooks/use-toast";

interface HomesSelectorProps {
  onSelectHome?: (home: FavoriteLocation) => void;
  allowEditing?: boolean;
  showAddNew?: boolean;
}

const HomesSelector: React.FC<HomesSelectorProps> = ({
  onSelectHome,
  allowEditing = true,
  showAddNew = true
}) => {
  const navigate = useNavigate();
  const { favoriteLocations, removeFavoriteLocation } = useFavoriteLocations();
  
  // Filtrar solo ubicaciones de tipo 'home'
  const homes = favoriteLocations.filter(loc => loc.type === 'home');
  
  // Función para navegar a la solicitud con casa seleccionada
  const handleSelectHomeForRide = (home: FavoriteLocation) => {
    if (onSelectHome) {
      onSelectHome(home);
    } else {
      navigate("/solicitar", { 
        state: { 
          useHomeAsOrigin: true,
          selectedHomeId: home.id
        } 
      });
    }
  };
  
  const handleRemoveHome = (event: React.MouseEvent, homeId: string) => {
    event.stopPropagation();
    
    if (homes.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debes tener al menos una ubicación de casa",
        variant: "destructive"
      });
      return;
    }
    
    removeFavoriteLocation(homeId);
    toast({
      title: "Casa eliminada",
      description: "La ubicación ha sido eliminada de tus casas"
    });
  };
  
  const handleAddNewHome = () => {
    navigate("/solicitar", { 
      state: { setHomeLocation: true } 
    });
  };

  return (
    <div className="space-y-3">
      {homes.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No tienes casas guardadas
        </div>
      ) : (
        homes.map((home) => (
          <div 
            key={home.id}
            onClick={() => handleSelectHomeForRide(home)}
            className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <HomeIcon className="text-tenerife-blue mt-1" size={18} />
                <div>
                  <p className="font-medium">{home.name || "Mi Casa"}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {home.coordinates.address || `${home.coordinates.lat.toFixed(6)}, ${home.coordinates.lng.toFixed(6)}`}
                  </p>
                </div>
              </div>
              
              {allowEditing && (
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => handleRemoveHome(e, home.id)}
                  >
                    <Trash size={14} className="text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
      
      {showAddNew && (
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed border-blue-200"
          onClick={handleAddNewHome}
        >
          <Plus size={16} className="mr-2" />
          Agregar nueva casa
        </Button>
      )}
    </div>
  );
};

export default HomesSelector;
