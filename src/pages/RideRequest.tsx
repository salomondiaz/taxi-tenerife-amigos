import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, MapPin, Navigation, Clock, Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import Map from "@/components/Map";

// Función para geocodificar direcciones usando Mapbox específicamente para Tenerife
const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
  const apiKey = localStorage.getItem('mapbox_api_key');
  if (!apiKey) return null;
  
  try {
    // Añadir "Tenerife, Spain" como contexto para mejorar la precisión
    const searchQuery = `${address}, Tenerife, Spain`;
    
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${apiKey}&limit=1&country=es&proximity=-16.5,28.4`
    );
    
    const data = await response.json();
    console.log("Geocoding result:", data);
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

const RideRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testMode, setCurrentRide } = useAppContext();
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originCoords, setOriginCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Establecer destino si viene de la página de inicio
  useEffect(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination);
      // Si tenemos un destino predefinido, establecemos un origen de ejemplo
      if (!origin) {
        setOrigin("Tu ubicación actual");
      }
    }
  }, [location.state, origin]);

  // Función para calcular estimaciones
  const calculateEstimates = async () => {
    if (!origin || !destination) {
      toast({
        title: "Información incompleta",
        description: "Por favor, introduce origen y destino",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Geocodificar las direcciones para obtener coordenadas
    const originResult = await geocodeAddress(origin);
    const destinationResult = await geocodeAddress(destination);
    
    if (!originResult || !destinationResult) {
      toast({
        title: "Error de geocodificación",
        description: "No se pudieron encontrar las coordenadas para las direcciones proporcionadas en Tenerife",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    console.log("Origin coordinates:", originResult);
    console.log("Destination coordinates:", destinationResult);
    
    setOriginCoords(originResult);
    setDestinationCoords(destinationResult);

    // Calcular distancia entre puntos (fórmula haversine)
    const R = 6371; // Radio de la Tierra en km
    const dLat = (destinationResult.lat - originResult.lat) * Math.PI / 180;
    const dLon = (destinationResult.lng - originResult.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originResult.lat * Math.PI / 180) * Math.cos(destinationResult.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Calcular tiempo estimado (3 minutos por km + algo aleatorio para variabilidad)
    const time = Math.floor(distance * 3 + Math.random() * 5);
    
    // Calcular precio (tarifa base de 3€ + 1.5€ por km)
    const price = distance * 1.5 + 3;

    setEstimatedDistance(parseFloat(distance.toFixed(1)));
    setEstimatedTime(time);
    setEstimatedPrice(parseFloat(price.toFixed(2)));
    setIsLoading(false);
    setShowMap(true);
  };

  // Procesar la solicitud de viaje
  const handleRequestRide = () => {
    if (!origin || !destination || !estimatedPrice || !originCoords || !destinationCoords) {
      toast({
        title: "Información incompleta",
        description: "Por favor, calcula primero el precio estimado",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulación de solicitud de viaje
    setTimeout(() => {
      // Crear un nuevo viaje
      const newRide = {
        id: `ride-${Date.now()}`,
        origin: {
          address: origin,
          lat: originCoords.lat,
          lng: originCoords.lng,
        },
        destination: {
          address: destination,
          lat: destinationCoords.lat,
          lng: destinationCoords.lng,
        },
        status: "pending" as "pending" | "accepted" | "ongoing" | "completed" | "cancelled",
        requestTime: new Date(),
        price: estimatedPrice,
        distance: estimatedDistance,
      };

      // Actualizar el contexto con el nuevo viaje
      setCurrentRide(newRide);

      toast({
        title: "¡Viaje solicitado!",
        description: "Buscando conductores disponibles...",
      });

      setIsLoading(false);
      navigate("/tracking");
    }, 1500);
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-4">Solicitar un taxi</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  Punto de recogida
                </label>
                <Input
                  id="origin"
                  type="text"
                  placeholder="¿Dónde te recogemos?"
                  className="w-full"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="mt-2">
                <Navigation size={18} className="text-gray-400" />
              </div>
              <div className="flex-1">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destino
                </label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="¿A dónde vas?"
                  className="w-full"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                variant="default"
                className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
                onClick={calculateEstimates}
                disabled={isLoading || !origin || !destination}
              >
                Calcular precio
              </Button>
            </div>
          </div>
        </div>
        
        {showMap && originCoords && destinationCoords && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 h-64">
            <Map 
              origin={{
                lat: originCoords.lat,
                lng: originCoords.lng,
                address: origin
              }}
              destination={{
                lat: destinationCoords.lat,
                lng: destinationCoords.lng,
                address: destination
              }}
              className="h-full"
            />
          </div>
        )}

        {estimatedPrice !== null && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Detalles estimados</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Tiempo estimado:</span>
                </div>
                <span className="font-medium">{estimatedTime} minutos</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Navigation size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">Distancia:</span>
                </div>
                <span className="font-medium">{estimatedDistance} km</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Precio estimado:</span>
                <span className="text-xl font-bold text-tenerife-blue">{estimatedPrice.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="default"
                className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
                onClick={handleRequestRide}
                disabled={isLoading}
              >
                <Car size={18} className="mr-2" />
                Solicitar taxi ahora
              </Button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            El precio final puede variar según el tráfico y la ruta exacta tomada por el conductor.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RideRequest;

