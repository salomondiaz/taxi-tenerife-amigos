
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, CalendarIcon, Car, Clock, Calendar, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { GOOGLE_MAPS_API_KEY } from "@/components/Map";
import GooglePlacesAutocomplete from "@/components/map/GooglePlacesAutocomplete";
import { MapCoordinates } from "@/components/map/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const QuickRideRequest: React.FC = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [showScheduleControls, setShowScheduleControls] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  
  const handleRequestSpecificRide = () => {
    if (pickup && destination) {
      navigate("/request-ride", { 
        state: { 
          origin: pickup,
          destination: destination,
          scheduledTime: showScheduleControls ? scheduledTime : undefined
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
  
  const handleScheduleRide = () => {
    setShowScheduleControls(true);
  };
  
  const handleCancelSchedule = () => {
    setShowScheduleControls(false);
    setScheduledTime("");
  };
  
  const navigateToHomeLocations = () => {
    navigate("/mis-casas");
  };
  
  const formatScheduledTime = () => {
    if (!scheduledTime) return "";
    
    try {
      const date = new Date(scheduledTime);
      return format(date, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return scheduledTime;
    }
  };

  return (
    <section className="py-6">
      <div className="container px-4 mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="text-tenerife-blue" size={20} />
              Solicitar un viaje
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              className="text-tenerife-blue border-tenerife-blue"
              onClick={navigateToHomeLocations}
            >
              <Home className="mr-2" size={16} />
              Gestionar mis casas
            </Button>
          </div>
          
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
            
            {showScheduleControls ? (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2 items-start">
                  <div className="mt-0.5">
                    <Calendar size={18} className="text-tenerife-blue" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y hora para programar el viaje
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tenerife-blue"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-6" 
                    onClick={handleCancelSchedule}
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                {scheduledTime && (
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 flex items-center">
                    <Clock size={16} className="mr-2 shrink-0" />
                    <span>Viaje programado para: <strong>{formatScheduledTime()}</strong></span>
                  </div>
                )}
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    variant="default"
                    size="default"
                    className="flex-1 bg-tenerife-blue hover:bg-tenerife-blue/90"
                    onClick={handleRequestSpecificRide}
                    disabled={!scheduledTime}
                  >
                    <Calendar size={18} className="mr-2" />
                    Programar viaje
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="outline"
                  size="default"
                  className="flex-1"
                  onClick={handleScheduleRide}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickRideRequest;
