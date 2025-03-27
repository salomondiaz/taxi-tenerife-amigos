
import React, { useState } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";
import MapComponent from "@/components/Map";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import RequestHeader from "@/components/ride/header/RequestHeader";
import { useHomeLocationSetup } from "@/hooks/useHomeLocationSetup";
import { useGeocodingService } from "@/hooks/useGeocodingService";

interface HomeLocationSetupProps {
  setOrigin: (value: string) => void;
}

const HomeLocationSetup: React.FC<HomeLocationSetupProps> = ({ setOrigin }) => {
  const { isLoading, setIsLoading, geocodeLocations } = useGeocodingService();
  
  const {
    originCoords,
    setOriginCoords,
    homeAddress,
    setHomeAddress,
    handleOriginChange,
    handlePlaceSelected,
    handleSaveHomeLocation
  } = useHomeLocationSetup(true);

  return (
    <div className="min-h-screen p-6">
      <RequestHeader />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Home className="mr-2 text-tenerife-blue" size={24} />
          Configurar Mi Casa
        </h2>
        
        <p className="text-gray-600 mb-6">
          Selecciona la ubicación de tu casa en el mapa o introduce la dirección manualmente.
        </p>
        
        <div className="mb-6">
          <GooglePlacesAutocomplete
            label="Dirección de tu casa"
            placeholder="Ej: Calle Principal 123, Puerto de la Cruz, Tenerife"
            value={homeAddress}
            onChange={setHomeAddress}
            onPlaceSelected={handlePlaceSelected}
            apiKey={GOOGLE_MAPS_API_KEY}
            className="w-full mb-4"
          />
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={async () => {
              if (!homeAddress) {
                toast({
                  title: "Dirección vacía",
                  description: "Por favor, introduce una dirección",
                  variant: "destructive"
                });
                return;
              }
              
              setIsLoading(true);
              try {
                const result = await geocodeLocations(homeAddress, "", null, null);
                if (result.success && result.finalOriginCoords) {
                  setOriginCoords(result.finalOriginCoords);
                  setOrigin(result.finalOriginCoords.address || homeAddress);
                  toast({
                    title: "Dirección encontrada",
                    description: "Verifica en el mapa si la ubicación es correcta"
                  });
                } else {
                  toast({
                    title: "Dirección no encontrada",
                    description: "No pudimos localizar esa dirección. Intenta ser más específico",
                    variant: "destructive"
                  });
                }
              } catch (error) {
                console.error("Error geocoding address:", error);
                toast({
                  title: "Error de búsqueda",
                  description: "No pudimos procesar la dirección",
                  variant: "destructive"
                });
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <MapPin size={16} className="mr-2" />
            Buscar dirección
          </Button>
        </div>
        
        <div className="h-72 mb-6 border rounded-lg overflow-hidden">
          <MapComponent 
            origin={originCoords || undefined}
            className="h-full"
            onOriginChange={handleOriginChange}
            allowMapSelection={true}
            allowHomeEditing={true}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveHomeLocation}
            className="bg-tenerife-blue hover:bg-tenerife-blue/90"
            disabled={!originCoords}
          >
            <Home size={16} className="mr-2" />
            Guardar Mi Casa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeLocationSetup;
