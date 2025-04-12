
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, MapPin, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useFavoriteLocations } from "@/hooks/useFavoriteLocations";
import HomesSelector from "./HomesSelector";

interface HomeLocationSectionProps {
  homeLocation: any | null;
}

const HomeLocationSection: React.FC<HomeLocationSectionProps> = ({ homeLocation }) => {
  const navigate = useNavigate();
  const { favoriteLocations, getLocationsByType } = useFavoriteLocations();
  const [showAllHomes, setShowAllHomes] = useState(false);
  
  // Obtener todas las casas
  const homes = getLocationsByType('home');
  const hasMultipleHomes = homes.length > 1;
  const primaryHome = homes.length > 0 ? homes[0] : null;
  
  const handleSetHomeLocation = () => {
    navigate("/solicitar", { state: { setHomeLocation: true } });
  };
  
  const handleToggleAllHomes = () => {
    setShowAllHomes(prev => !prev);
  };

  return (
    <section className="mb-8">
      <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <HomeIcon className="text-tenerife-blue" size={24} />
            Mi Casa
          </h2>
          
          {hasMultipleHomes && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleToggleAllHomes}
              className="text-blue-600"
            >
              {showAllHomes ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  Menos
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Ver todas ({homes.length})
                </>
              )}
            </Button>
          )}
        </div>
        
        {primaryHome ? (
          <div>
            {!showAllHomes && (
              <div className="mb-4">
                <p className="text-blue-700 mb-2">
                  {primaryHome.coordinates.address || `${primaryHome.coordinates.lat.toFixed(6)}, ${primaryHome.coordinates.lng.toFixed(6)}`}
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="default"
                    className="flex-1 bg-tenerife-blue"
                    onClick={() => navigate("/solicitar", { 
                      state: { useHomeAsOrigin: true } 
                    })}
                  >
                    <MapPin size={16} className="mr-2" />
                    Viajar desde casa
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSetHomeLocation}
                  >
                    <HomeIcon size={16} className="mr-2" />
                    Cambiar ubicación
                  </Button>
                </div>
              </div>
            )}
            
            {showAllHomes && (
              <div className="mt-3">
                <HomesSelector />
              </div>
            )}
            
            {!showAllHomes && hasMultipleHomes && (
              <div className="mt-3 border-t border-blue-100 pt-3">
                <Button 
                  variant="ghost" 
                  className="w-full text-blue-600"
                  onClick={handleToggleAllHomes}
                >
                  <ChevronDown size={16} className="mr-2" />
                  Ver todas mis casas ({homes.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-blue-700 mb-4">
              No has guardado la ubicación de tu casa. Configúrala para acceder más rápido a ella.
            </p>
            <Button
              variant="default"
              className="w-full bg-tenerife-blue"
              onClick={handleSetHomeLocation}
            >
              <HomeIcon size={16} className="mr-2" />
              Configurar Mi Casa
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeLocationSection;
