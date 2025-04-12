
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, MapPin, HomeIcon, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useFavoriteLocations, FavoriteLocation } from "@/hooks/useFavoriteLocations";

interface HomesSelectorProps {
  onSelectHome?: (home: FavoriteLocation) => void;
  allowEditing?: boolean;
  showAddNew?: boolean;
}

const HomesSelector: React.FC<HomesSelectorProps> = ({
  onSelectHome,
  allowEditing = true,
  showAddNew = true,
}) => {
  const navigate = useNavigate();
  const { favoriteLocations, removeFavoriteLocation, editFavoriteLocation } = useFavoriteLocations();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentHome, setCurrentHome] = useState<FavoriteLocation | null>(null);
  const [homeName, setHomeName] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Filtrar solo las ubicaciones de tipo 'home'
  const homes = favoriteLocations.filter(loc => loc.type === 'home');

  const handleAddNewHome = () => {
    navigate("/solicitar", { state: { setHomeLocation: true } });
  };

  const handleEditHome = (home: FavoriteLocation) => {
    setCurrentHome(home);
    setHomeName(home.name);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentHome) return;
    
    if (!homeName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor introduce un nombre para esta casa",
        variant: "destructive"
      });
      return;
    }
    
    editFavoriteLocation(currentHome.id, {
      name: homeName.trim()
    });
    
    toast({
      title: "Casa actualizada",
      description: "El nombre de tu casa ha sido actualizado"
    });
    
    setEditDialogOpen(false);
  };

  const handleDeleteHome = (home: FavoriteLocation) => {
    setCurrentHome(home);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!currentHome) return;
    
    removeFavoriteLocation(currentHome.id);
    
    toast({
      title: "Casa eliminada",
      description: "La ubicación ha sido eliminada de tus casas"
    });
    
    setConfirmDeleteOpen(false);
  };

  const handleUseHome = (home: FavoriteLocation) => {
    if (onSelectHome) {
      onSelectHome(home);
    } else {
      navigate("/solicitar", { 
        state: { useHomeAsOrigin: true, selectedHomeId: home.id } 
      });
    }
  };

  // Si no hay casas guardadas
  if (homes.length === 0) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <HomeIcon className="mx-auto text-blue-500 mb-2" size={24} />
        <p className="text-blue-700 mb-3">No tienes casas guardadas</p>
        {showAddNew && (
          <Button 
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
            onClick={handleAddNewHome}
          >
            <Plus size={16} className="mr-2" />
            Agregar una casa
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {homes.map(home => (
        <div 
          key={home.id}
          className="bg-white rounded-lg border border-gray-200 p-3 flex items-center"
        >
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <HomeIcon className="text-blue-500" size={18} />
          </div>
          
          <div className="flex-grow">
            <h3 className="font-medium">{home.name}</h3>
            <p className="text-xs text-gray-600 truncate">
              {home.coordinates.address || `${home.coordinates.lat}, ${home.coordinates.lng}`}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => handleUseHome(home)}
            >
              <MapPin size={16} className="mr-1" />
              Usar
            </Button>
            
            {allowEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditHome(home)}
                  className="h-8 w-8"
                >
                  <Edit size={16} className="text-gray-500" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteHome(home)}
                  className="h-8 w-8"
                >
                  <Trash size={16} className="text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
      
      {showAddNew && (
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={handleAddNewHome}
        >
          <Plus size={16} className="mr-2" />
          Agregar otra casa
        </Button>
      )}
      
      {/* Diálogo para editar nombre */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar casa</DialogTitle>
            <DialogDescription>
              Cambia el nombre de esta ubicación
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="home-name">Nombre</Label>
            <Input
              id="home-name"
              value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              placeholder="Ej: Casa, Apartamento, Casa de playa..."
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar casa</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta ubicación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomesSelector;
