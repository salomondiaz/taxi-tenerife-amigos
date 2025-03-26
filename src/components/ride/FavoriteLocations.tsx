
import React, { useState } from "react";
import { Home, Briefcase, Star, Plus, X, MapPin, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteLocation, FavoriteLocationType, useFavoriteLocations } from "@/hooks/useFavoriteLocations";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FavoriteLocationsProps {
  origin?: MapCoordinates;
  currentCoordinates?: MapCoordinates;
  onSelectLocation: (location: MapCoordinates, address?: string) => void;
}

const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  origin,
  currentCoordinates,
  onSelectLocation
}) => {
  const { favoriteLocations, saveFavoriteLocation, editFavoriteLocation, removeFavoriteLocation } = useFavoriteLocations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationType, setNewLocationType] = useState<FavoriteLocationType>("favorite");
  const [editingLocation, setEditingLocation] = useState<FavoriteLocation | null>(null);

  // Function to get the appropriate icon for a location type
  const getLocationIcon = (type: FavoriteLocationType) => {
    switch (type) {
      case 'home':
        return <Home size={18} className="mr-2" />;
      case 'work':
        return <Briefcase size={18} className="mr-2" />;
      case 'favorite':
      default:
        return <Star size={18} className="mr-2" />;
    }
  };

  // Handle adding a new favorite location
  const handleAddFavorite = () => {
    if (!currentCoordinates) {
      toast({
        title: "No hay ubicación seleccionada",
        description: "Por favor, selecciona primero un origen en el mapa",
        variant: "destructive"
      });
      return;
    }

    if (!newLocationName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor, introduce un nombre para esta ubicación",
        variant: "destructive"
      });
      return;
    }

    const success = saveFavoriteLocation({
      name: newLocationName,
      coordinates: currentCoordinates,
      type: newLocationType,
      icon: newLocationType === 'home' ? '🏠' : newLocationType === 'work' ? '💼' : '⭐'
    });

    if (success) {
      toast({
        title: "Ubicación guardada",
        description: `${newLocationName} ha sido guardada como favorito`
      });
      setIsAddDialogOpen(false);
      setNewLocationName("");
    }
  };

  // Handle editing a favorite location
  const handleEditFavorite = () => {
    if (!editingLocation) return;

    const success = editFavoriteLocation(editingLocation.id, {
      name: editingLocation.name,
      type: editingLocation.type,
      icon: editingLocation.type === 'home' ? '🏠' : editingLocation.type === 'work' ? '💼' : '⭐'
    });

    if (success) {
      toast({
        title: "Ubicación actualizada",
        description: `${editingLocation.name} ha sido actualizada`
      });
      setIsEditDialogOpen(false);
      setEditingLocation(null);
    }
  };

  // Handle selecting a favorite location
  const handleSelectFavorite = (location: FavoriteLocation) => {
    onSelectLocation(location.coordinates, location.coordinates.address);
    toast({
      title: "Ubicación seleccionada",
      description: `${location.name} ha sido establecida como punto de origen`
    });
  };

  // Handle initiating edit of a favorite location
  const handleStartEdit = (location: FavoriteLocation, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting when removing
    setEditingLocation({...location});
    setIsEditDialogOpen(true);
  };

  // Handle removing a favorite location
  const handleRemoveFavorite = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting when removing
    
    const success = removeFavoriteLocation(id);
    if (success) {
      toast({
        title: "Ubicación eliminada",
        description: `${name} ha sido eliminada de tus favoritos`
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Ubicaciones favoritas</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              disabled={!currentCoordinates}
            >
              <Plus size={16} className="mr-1" /> Añadir actual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Guardar ubicación actual</DialogTitle>
              <DialogDescription>
                Guarda tu ubicación actual como favorita para acceder rápidamente en el futuro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="Ej: Mi casa, Oficina, etc."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={newLocationType}
                  onValueChange={(value) => setNewLocationType(value as FavoriteLocationType)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tipo de ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Casa 🏠</SelectItem>
                    <SelectItem value="work">Trabajo 💼</SelectItem>
                    <SelectItem value="favorite">Favorito ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {currentCoordinates?.address && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Dirección</Label>
                  <div className="col-span-3 text-sm text-gray-500 truncate">
                    {currentCoordinates.address}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddFavorite}>Guardar ubicación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar ubicación favorita</DialogTitle>
            <DialogDescription>
              Modifica los detalles de esta ubicación favorita.
            </DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-name"
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation({...editingLocation, name: e.target.value})}
                  placeholder="Ej: Mi casa, Oficina, etc."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Tipo
                </Label>
                <Select
                  value={editingLocation.type}
                  onValueChange={(value) => setEditingLocation({...editingLocation, type: value as FavoriteLocationType})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tipo de ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Casa 🏠</SelectItem>
                    <SelectItem value="work">Trabajo 💼</SelectItem>
                    <SelectItem value="favorite">Favorito ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingLocation.coordinates?.address && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Dirección</Label>
                  <div className="col-span-3 text-sm text-gray-500 truncate">
                    {editingLocation.coordinates.address}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditFavorite}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {favoriteLocations.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <MapPin className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>No tienes ubicaciones guardadas</p>
          <p className="text-sm">Añade ubicaciones para acceder rápidamente a ellas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {favoriteLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => handleSelectFavorite(location)}
              className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center truncate">
                {getLocationIcon(location.type)}
                <div className="truncate">
                  <div className="font-medium">{location.name}</div>
                  {location.coordinates.address && (
                    <div className="text-xs text-gray-500 truncate">{location.coordinates.address}</div>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                  onClick={(e) => handleStartEdit(location, e)}
                >
                  <Edit size={16} />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-70 hover:opacity-100"
                  onClick={(e) => handleRemoveFavorite(location.id, location.name, e)}
                >
                  <X size={16} />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteLocations;
