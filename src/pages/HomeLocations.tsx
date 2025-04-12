
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useFavoriteLocations, FavoriteLocation } from "@/hooks/useFavoriteLocations";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Home, Plus, MapPin, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapCoordinates } from "@/components/map/types";

// Define form schema for home locations
const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const HomeLocations = () => {
  const navigate = useNavigate();
  const { 
    favoriteLocations, 
    addFavoriteLocation, 
    removeFavoriteLocation, 
    updateFavoriteLocation 
  } = useFavoriteLocations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<FavoriteLocation | null>(null);
  
  // Get only home locations
  const homeLocations = favoriteLocations.filter(loc => loc.type === 'home');
  
  // Form for adding/editing homes
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      notes: "",
    },
  });
  
  const handleAddNew = () => {
    form.reset({
      name: "",
      address: "",
      notes: "",
    });
    setIsAddDialogOpen(true);
  };
  
  const handleEdit = (location: FavoriteLocation) => {
    setSelectedLocation(location);
    form.reset({
      name: location.name || "",
      address: location.coordinates.address || "",
      notes: location.notes || "",
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (homeLocations.length <= 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debes tener al menos una ubicación de casa",
        variant: "destructive"
      });
      return;
    }
    
    removeFavoriteLocation(id);
    toast({
      title: "Casa eliminada",
      description: "La ubicación ha sido eliminada de tus casas"
    });
  };
  
  const onAddSubmit = (data: FormValues) => {
    // Create mock coordinates since we're not using a map selector here
    const mockCoordinates: MapCoordinates = {
      lat: 28.4683,
      lng: -16.2546,
      address: data.address,
    };
    
    const id = addFavoriteLocation(mockCoordinates, "home", data.name);
    
    // Add notes if provided
    if (data.notes) {
      updateFavoriteLocation(id, { notes: data.notes });
    }
    
    setIsAddDialogOpen(false);
    toast({
      title: "Casa agregada",
      description: "Tu nueva ubicación de casa ha sido guardada"
    });
  };
  
  const onEditSubmit = (data: FormValues) => {
    if (!selectedLocation) return;
    
    // Update the location details
    const updatedCoordinates: MapCoordinates = {
      ...selectedLocation.coordinates,
      address: data.address,
    };
    
    updateFavoriteLocation(selectedLocation.id, {
      name: data.name,
      coordinates: updatedCoordinates,
      notes: data.notes,
    });
    
    setIsEditDialogOpen(false);
    toast({
      title: "Casa actualizada",
      description: "La información de tu casa ha sido actualizada"
    });
  };
  
  const handleSelectOnMap = () => {
    navigate("/solicitar", { state: { setHomeLocation: true } });
  };

  return (
    <MainLayout requireAuth>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mis Casas</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleSelectOnMap}
              className="flex items-center"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Seleccionar en el mapa
            </Button>
            <Button 
              onClick={handleAddNew}
              className="flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar nueva casa
            </Button>
          </div>
        </div>
        
        {homeLocations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No tienes casas guardadas</h3>
            <p className="text-gray-500 mb-4">Agrega tu primera casa para una mejor experiencia</p>
            <Button onClick={handleAddNew}>Agregar mi casa</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeLocations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg border p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Home className="text-tenerife-blue mt-1" size={24} />
                    <div>
                      <h3 className="font-medium text-lg">{location.name || "Mi Casa"}</h3>
                      <p className="text-gray-600">
                        {location.coordinates.address || `${location.coordinates.lat.toFixed(6)}, ${location.coordinates.lng.toFixed(6)}`}
                      </p>
                      {location.notes && (
                        <p className="text-gray-500 text-sm mt-2">{location.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(location)}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                      onClick={() => handleDelete(location.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Home Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar nueva casa</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de tu casa para guardarla.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Mi Casa, Casa de Playa" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Calle Principal 123, Tenerife" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas adicionales (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Edificio verde, piso 2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Home Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar casa</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de tu casa.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Mi Casa, Casa de Playa" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Calle Principal 123, Tenerife" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas adicionales (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Edificio verde, piso 2" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Actualizar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default HomeLocations;
