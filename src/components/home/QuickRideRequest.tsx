
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, CalendarIcon, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";
import { MapCoordinates } from "@/components/map/types";

const QuickRideRequest: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const handleRequestSpecificRide = () => {
    if (pickup && destination) {
      navigate("/request-ride", { 
        state: { 
          origin: pickup,
          destination: destination 
        } 
      });
    } else if (!pickup) {
      toast({
        title: "Información incompleta",
        description: "Por favor, indica el punto de recogida",
        variant: "destructive"
      });
    } else if (!destination) {
      toast({
        title: "Información incompleta",
        description: "Por favor, indica el destino",
        variant: "destructive"
      });
    }
  };
  
  const handlePickupSelected = (coordinates: MapCoordinates) => {
    setPickup(coordinates.address || "");
  };
  
  const handleDestinationSelected = (coordinates: MapCoordinates) => {
    setDestination(coordinates.address || "");
  };

  return (
    <section className="py-6">
      <div className="container px-4 mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <MapPin className="text-tenerife-blue" size={20} />
            Solicitar un viaje
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <MapPin size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <GooglePlacesAutocomplete
                  label="Punto de recogida"
                  placeholder="¿Dónde te recogemos?"
                  value={pickup}
                  onChange={setPickup}
                  onPlaceSelected={handlePickupSelected}
                  apiKey={GOOGLE_MAPS_API_KEY}
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <Navigation size={18} className="text-red-500" />
              </div>
              <div className="flex-1">
                <GooglePlacesAutocomplete
                  label="Destino"
                  placeholder="¿A dónde vas?"
                  value={destination}
                  onChange={setDestination}
                  onPlaceSelected={handleDestinationSelected}
                  apiKey={GOOGLE_MAPS_API_KEY}
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline"
                size="default"
                className="flex-1"
              >
                <CalendarIcon size={18} className="mr-2" />
                Programar
              </Button>
              <Button 
                variant="default"
                size="default"
                className="flex-1 bg-tenerife-blue hover:bg-tenerife-blue/90"
                onClick={handleRequestSpecificRide}
              >
                <Car size={18} className="mr-2" />
                Solicitar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickRideRequest;
