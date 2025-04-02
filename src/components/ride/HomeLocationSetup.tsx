
import React, { useState } from "react";
import { MapCoordinates } from "@/components/map/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Search } from "lucide-react";
import Map from "@/components/Map";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import RequestHeader from "@/components/ride/header/RequestHeader";
import { useHomeLocationSetup } from "@/hooks/useHomeLocationSetup";
import { useGeocodingService } from "@/hooks/useGeocodingService";
import { Input } from "@/components/ui/input";
import { geocodeAddress } from "@/components/map/services/GeocodingService";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";

interface HomeLocationSetupProps {
  setOrigin: (value: string) => void;
}

const HomeLocationSetup: React.FC<HomeLocationSetupProps> = ({ setOrigin }) => {
  const { isLoading, setIsLoading, geocodeLocations } = useGeocodingService();
  const { saveHomeLocation } = useHomeLocationStorage();
  
  const {
    originCoords,
    setOriginCoords,
    homeAddress,
    setHomeAddress,
    handleOriginChange,
    handlePlaceSelected,
    handleSaveHomeLocation
  } = useHomeLocationSetup(true);

  // Función para buscar dirección manualmente
  const handleManualSearch = async () => {
    if (!homeAddress) {
      toast({
        title: "Dirección vacía",
        description: "Por favor, introduce una dirección",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Usar geocodificación directa para buscar la dirección
    geocodeAddress(homeAddress, (coords) => {
      if (coords) {
        setOriginCoords(coords);
        setOrigin(coords.address || homeAddress);
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
      setIsLoading(false);
    });
  };

  // Función mejorada para guardar la ubicación de casa
  const saveHomeLocationWithStorage = () => {
    if (!originCoords) {
      toast({
        title: "No hay ubicación seleccionada",
        description: "Por favor, selecciona una ubicación en el mapa primero",
        variant: "destructive"
      });
      return;
    }

    // Primero intentamos guardar usando el hook de favoritos
    const success = handleSaveHomeLocation();
    
    // También guardamos en localStorage para acceso rápido
    if (saveHomeLocation(originCoords)) {
      toast({
        title: "Casa guardada",
        description: "Tu ubicación ha sido guardada como Casa correctamente"
      });
    }
  };

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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Búsqueda con autocompletado
              </label>
              <GooglePlacesAutocomplete
                label=""
                placeholder="Escribe para buscar direcciones"
                value={homeAddress}
                onChange={setHomeAddress}
                onPlaceSelected={handlePlaceSelected}
                apiKey={GOOGLE_MAPS_API_KEY}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-500 text-sm">o</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Introduce una dirección manualmente
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Calle Principal 123, Puerto de la Cruz, Tenerife"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  variant="outline" 
                  onClick={handleManualSearch}
                  disabled={isLoading}
                >
                  <Search size={16} className="mr-2" />
                  Buscar
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Escribe la dirección completa incluyendo calle, número, ciudad
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-72 mb-6 border rounded-lg overflow-hidden">
          <Map 
            origin={originCoords || undefined}
            className="h-full"
            onOriginChange={handleOriginChange}
            allowMapSelection={true}
            allowHomeEditing={true}
            showSelectMarkers={true}
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
            onClick={saveHomeLocationWithStorage}
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
