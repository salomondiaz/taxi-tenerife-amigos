
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, MapPin } from "lucide-react";

interface HomeLocationSectionProps {
  homeLocation: any | null;
}

const HomeLocationSection: React.FC<HomeLocationSectionProps> = ({ homeLocation }) => {
  const navigate = useNavigate();
  
  const handleSetHomeLocation = () => {
    navigate("/request-ride", { state: { setHomeLocation: true } });
  };

  return (
    <section className="mb-8">
      <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-800 flex items-center gap-2">
          <HomeIcon className="text-tenerife-blue" size={24} />
          Mi Casa
        </h2>
        
        {homeLocation ? (
          <div>
            <p className="text-blue-700 mb-2">
              {homeLocation.coordinates.address || `${homeLocation.coordinates.lat.toFixed(6)}, ${homeLocation.coordinates.lng.toFixed(6)}`}
            </p>
            <div className="flex gap-3 mt-4">
              <Button
                variant="default"
                className="flex-1 bg-tenerife-blue"
                onClick={() => navigate("/request-ride", { 
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
