
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin, Search, ArrowLeft } from "lucide-react";
import { MapCoordinates } from "@/components/map/types";
import Map from "@/components/Map";
import { toast } from "@/hooks/use-toast";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import { useNavigate } from "react-router-dom";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";

const HomeLocationSettings: React.FC = () => {
  const navigate = useNavigate();
  const { loadHomeLocation, saveHomeLocation, resetHomeLocation } = useHomeLocationStorage();
  
  const [address, setAddress] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<MapCoordinates | null>(null);
  const [isEditingMap, setIsEditingMap] = useState<boolean>(false);

  // Load initial home location
  useEffect(() => {
    const homeLocation = loadHomeLocation();
    if (homeLocation) {
      setSelectedLocation(homeLocation);
      setAddress(homeLocation.address || "");
    }
  }, [loadHomeLocation]);

  // Handle map location selection
  const handleLocationSelect = (coordinates: MapCoordinates) => {
    setSelectedLocation(coordinates);
    if (coordinates.address) {
      setAddress(coordinates.address);
    }
  };

  // Search for location by address
  const searchAddress = () => {
    if (!address.trim()) {
      toast({
        title: "Dirección vacía",
        description: "Por favor, introduce una dirección para buscar",
        variant: "destructive"
      });
      return;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          const newLocation: MapCoordinates = {
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          };
          
          setSelectedLocation(newLocation);
          toast({
            title: "Ubicación encontrada",
            description: results[0].formatted_address
          });
        } else {
          toast({
            title: "No se encontró la dirección",
            description: "Intenta ser más específico o selecciona la ubicación en el mapa",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error("Error searching address:", error);
      toast({
        title: "Error de búsqueda",
        description: "No se pudo buscar la dirección",
        variant: "destructive"
      });
    }
  };

  // Save home location
  const handleSaveLocation = () => {
    if (!selectedLocation) {
      toast({
        title: "Sin ubicación",
        description: "Primero debes seleccionar una ubicación",
        variant: "destructive"
      });
      return;
    }

    // Make sure we have an address
    const locationToSave: MapCoordinates = {
      ...selectedLocation,
      address: address || selectedLocation.address || "Mi Casa"
    };

    if (saveHomeLocation(locationToSave)) {
      toast({
        title: "Casa guardada",
        description: "La ubicación de tu casa ha sido guardada correctamente"
      });
    }
  };

  // Reset home location to default
  const handleResetLocation = () => {
    if (resetHomeLocation()) {
      toast({
        title: "Casa restablecida",
        description: "La ubicación de tu casa ha sido restablecida a la ubicación predeterminada"
      });
      
      // Update the local state with the default location
      const defaultLocation = loadHomeLocation();
      setSelectedLocation(defaultLocation);
      setAddress(defaultLocation?.address || "");
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-6 w-6 text-blue-600" />
              Configuración de Mi Casa
            </CardTitle>
            <CardDescription>
              Configura la ubicación de tu casa para usarla rápidamente al solicitar viajes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Address search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <div className="flex space-x-2">
                <Input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Introduce tu dirección"
                  className="flex-1"
                />
                <Button onClick={searchAddress} variant="secondary">
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
              <p className="text-xs text-gray-500">Introduce una dirección o selecciona un punto en el mapa</p>
            </div>
            
            {/* Map view */}
            <div className="h-[400px] border rounded-md overflow-hidden relative">
              <Map 
                origin={selectedLocation || undefined}
                onOriginChange={handleLocationSelect}
                allowMapSelection={true}
                allowHomeEditing={true}
                showSelectMarkers={true}
                selectionMode="origin"
              />
              
              {/* Map overlay with instructions */}
              <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md max-w-xs">
                <h3 className="text-sm font-medium mb-1">Instrucciones:</h3>
                <p className="text-xs text-gray-600">
                  Haz clic en el mapa para seleccionar tu ubicación o arrastra el marcador para ajustarla.
                </p>
              </div>
            </div>
            
            {/* Current location display */}
            {selectedLocation && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800 mb-1">Ubicación seleccionada:</p>
                <p className="text-sm">{selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-3 justify-end">
              <Button variant="outline" onClick={handleResetLocation}>
                Restablecer ubicación predeterminada
              </Button>
              <Button onClick={handleSaveLocation} disabled={!selectedLocation}>
                <Home className="mr-2 h-4 w-4" />
                Guardar como Mi Casa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HomeLocationSettings;
