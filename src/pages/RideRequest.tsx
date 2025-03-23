
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, MapPin, Navigation, Clock, Car } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import Map, { MapCoordinates } from "@/components/Map";
import { geocodeAddress } from "@/components/map/MapboxUtils";
import { API_KEY_STORAGE_KEY } from "@/components/map/types";

// Función para geocodificar direcciones usando Mapbox específicamente para Tenerife
const geocodeAddressForRequest = async (address: string): Promise<MapCoordinates | null> => {
  const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (!apiKey) return null;
  
  const result = await geocodeAddress(address, apiKey);
  return result;
};

const RideRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testMode, setCurrentRide } = useAppContext();
  
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originCoords, setOriginCoords] = useState<MapCoordinates | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<MapCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);
  const [useManualSelection, setUseManualSelection] = useState(true); // Activado por defecto

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

  // Manejar cambios en el origen desde el mapa
  const handleOriginChange = (coords: MapCoordinates) => {
    setOriginCoords(coords);
    if (coords.address) {
      setOrigin(coords.address);
    }
    console.log("Nuevo origen desde el mapa:", coords);
  };

  // Manejar cambios en el destino desde el mapa
  const handleDestinationChange = (coords: MapCoordinates) => {
    setDestinationCoords(coords);
    if (coords.address) {
      setDestination(coords.address);
    }
    console.log("Nuevo destino desde el mapa:", coords);
  };

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
    
    // Si ya tenemos coordenadas del mapa, las usamos directamente
    let finalOriginCoords = originCoords;
    let finalDestinationCoords = destinationCoords;
    
    // Si no tenemos coordenadas, geocodificamos las direcciones
    if (!finalOriginCoords) {
      const originResult = await geocodeAddressForRequest(origin);
      if (!originResult) {
        toast({
          title: "Error de geocodificación",
          description: "No se pudo encontrar el origen en Tenerife. Intenta ser más específico o usar la selección manual.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      finalOriginCoords = originResult;
      setOriginCoords(originResult);
    }
    
    if (!finalDestinationCoords) {
      const destinationResult = await geocodeAddressForRequest(destination);
      if (!destinationResult) {
        toast({
          title: "Error de geocodificación",
          description: "No se pudo encontrar el destino en Tenerife. Intenta ser más específico o usar la selección manual.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      finalDestinationCoords = destinationResult;
      setDestinationCoords(destinationResult);
    }
    
    console.log("Origin coordinates:", finalOriginCoords);
    console.log("Destination coordinates:", finalDestinationCoords);

    // Calcular distancia entre puntos (fórmula haversine)
    const R = 6371; // Radio de la Tierra en km
    const dLat = (finalDestinationCoords.lat - finalOriginCoords.lat) * Math.PI / 180;
    const dLon = (finalDestinationCoords.lng - finalOriginCoords.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(finalOriginCoords.lat * Math.PI / 180) * Math.cos(finalDestinationCoords.lat * Math.PI / 180) * 
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

  // Alternar entre entrada manual y selección en el mapa
  const toggleSelectionMode = () => {
    setUseManualSelection(!useManualSelection);
    if (useManualSelection) {
      toast({
        title: "Modo de selección en el mapa desactivado",
        description: "Ahora debes introducir las direcciones manualmente",
      });
    } else {
      toast({
        title: "Modo de selección en el mapa activado",
        description: "Ahora puedes hacer clic en el mapa para seleccionar origen y destino",
      });
    }
  };

  // Manejar ubicación actual
  const handleUseCurrentLocation = async () => {
    try {
      if (navigator.geolocation) {
        toast({
          title: "Obteniendo ubicación",
          description: "Por favor, espere mientras obtenemos su ubicación actual...",
        });
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            setOriginCoords(coords);
            
            // Intentar obtener la dirección
            const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
            if (apiKey) {
              fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${apiKey}&limit=1&language=es`
              )
                .then(response => response.json())
                .then(data => {
                  if (data.features && data.features.length > 0) {
                    const address = data.features[0].place_name;
                    setOrigin(address);
                  } else {
                    setOrigin("Ubicación actual");
                  }
                })
                .catch(error => {
                  console.error("Error al obtener dirección:", error);
                  setOrigin("Ubicación actual");
                });
            } else {
              setOrigin("Ubicación actual");
            }
            
            toast({
              title: "Ubicación actual establecida",
              description: "Se ha establecido su ubicación actual como punto de origen",
            });
          },
          (error) => {
            console.error("Error al obtener ubicación:", error);
            toast({
              title: "Error de ubicación",
              description: "No pudimos acceder a su ubicación. Por favor, asegúrese de haber concedido permisos de ubicación.",
              variant: "destructive",
            });
          }
        );
      } else {
        toast({
          title: "Error de ubicación",
          description: "Su navegador no soporta geolocalización",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al usar ubicación actual:", error);
      toast({
        title: "Error de ubicación",
        description: "Ocurrió un error al intentar obtener su ubicación actual",
        variant: "destructive",
      });
    }
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
        
        {/* Controles de selección de mapas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">¿Cómo quieres indicar las ubicaciones?</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              variant={useManualSelection ? "default" : "outline"}
              className={`w-full flex items-center justify-center ${useManualSelection ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
              onClick={() => setUseManualSelection(true)}
            >
              <MapPin size={18} className="mr-2" />
              Seleccionar en el mapa
            </Button>
            
            <Button
              variant={!useManualSelection ? "default" : "outline"}
              className={`w-full flex items-center justify-center ${!useManualSelection ? "bg-tenerife-blue hover:bg-tenerife-blue/90" : ""}`}
              onClick={() => setUseManualSelection(false)}
            >
              <Navigation size={18} className="mr-2" />
              Introducir direcciones
            </Button>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleUseCurrentLocation}
            >
              <span className="flex h-2 w-2 mr-2 rounded-full bg-blue-500 animate-pulse" />
              Usar mi ubicación
            </Button>
          </div>
          
          {!useManualSelection && (
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
                    placeholder="¿Dónde te recogemos? (especifica 'Tenerife' en la dirección)"
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
                    placeholder="¿A dónde vas? (especifica 'Tenerife' en la dirección)"
                    className="w-full"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mapa siempre visible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {useManualSelection 
              ? "Selecciona los puntos en el mapa" 
              : "Vista previa del recorrido"}
          </h2>
          
          <div className="h-72 mb-3">
            <Map 
              origin={originCoords || undefined}
              destination={destinationCoords || undefined}
              className="h-full"
              onOriginChange={handleOriginChange}
              onDestinationChange={handleDestinationChange}
              allowMapSelection={useManualSelection}
            />
          </div>
          
          {useManualSelection && (
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Instrucciones:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Usa los botones en el mapa para seleccionar origen o destino</li>
                <li>Haz clic en el mapa en la ubicación deseada</li>
                <li>Puedes arrastrar los marcadores para ajustar la posición</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Botón para calcular precio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <Button 
            variant="default"
            className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
            onClick={calculateEstimates}
            disabled={isLoading || (!origin && !originCoords) || (!destination && !destinationCoords)}
          >
            Calcular precio
          </Button>
        </div>

        {/* Detalles del viaje estimado */}
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
          
          <div className="mt-3 text-sm text-gray-700 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="font-medium mb-1">Sugerencias para mejorar la precisión:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Incluye "Tenerife" en la dirección (por ejemplo: "Plaza del Charco, Puerto de la Cruz, Tenerife")</li>
              <li>Usa nombres oficiales para lugares y calles</li>
              <li>Si tienes problemas, utiliza la función "Seleccionar en mapa"</li>
              <li>Puedes arrastrar los marcadores para ajustar las ubicaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RideRequest;
