
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, MapPin, Car, Phone, Star, User, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Map from "@/components/Map";

const RIDE_HISTORY_KEY = 'ride_history';

const RideTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRide, setCurrentRide } = useAppContext();
  
  const [rideStatus, setRideStatus] = useState<"pending" | "accepted" | "ongoing" | "completed" | "cancelled">(
    currentRide?.status || "pending"
  );
  const [driver, setDriver] = useState<any>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [driverPosition, setDriverPosition] = useState<{lat: number, lng: number, heading?: number, speed?: number, timestamp?: number} | null>(null);

  useEffect(() => {
    if (!currentRide) {
      toast({
        title: "No hay viaje activo",
        description: "Regresando a la página de inicio",
        variant: "destructive",
      });
      setTimeout(() => navigate("/home"), 2000);
      return;
    }
    
    setRideStatus(currentRide.status || "pending");
    
    if (currentRide.status === "pending") {
      const timer = setTimeout(() => {
        // Asignar un conductor de prueba
        const testDriver = {
          id: "driver-1",
          name: "Carlos Rodríguez",
          phone: "+34 612 345 678",
          licenseNumber: "TX-123456",
          vehicle: {
            make: "Toyota",
            model: "Prius",
            licensePlate: "3456-BCM",
            color: "Blanco",
          },
          rating: 4.8,
          isAvailable: true,
          profilePicture: null,
          isTestDriver: true,
        };
        
        setDriver(testDriver);
        setEstimatedArrival(5);
        setRideStatus("accepted");
        
        // Actualizar el ride en el contexto
        if (currentRide && setCurrentRide) {
          setCurrentRide({
            ...currentRide,
            status: "accepted",
            driver: testDriver,
          });
        }
        
        // Simular posición inicial del conductor
        if (currentRide && currentRide.origin) {
          const initialPosition = {
            lat: currentRide.origin.lat - 0.01,
            lng: currentRide.origin.lng + 0.005,
            heading: 45,
            speed: 40,
            timestamp: Date.now()
          };
          setDriverPosition(initialPosition);
        }
        
        toast({
          title: "¡Conductor encontrado!",
          description: "Carlos llegará en 5 minutos",
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentRide, navigate, setCurrentRide]);

  // Estado del viaje
  useEffect(() => {
    // No continuar si no hay viaje activo
    if (!currentRide) return;

    if (rideStatus === "accepted") {
      const timer = setTimeout(() => {
        setRideStatus("ongoing");
        
        if (currentRide && setCurrentRide) {
          setCurrentRide({
            ...currentRide,
            status: "ongoing",
          });
        }
        
        toast({
          title: "¡El viaje ha comenzado!",
          description: "Estás en camino a tu destino",
        });
      }, 8000);
      
      return () => clearTimeout(timer);
    }
    
    if (rideStatus === "ongoing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setRideStatus("completed");
            
            if (currentRide && setCurrentRide) {
              setCurrentRide({
                ...currentRide,
                status: "completed",
              });
            }
            
            toast({
              title: "¡Viaje completado!",
              description: "Has llegado a tu destino",
            });
            return 100;
          }
          return newProgress;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [rideStatus, currentRide, setCurrentRide]);
  
  // Funciones de utilidad
  const getStatusText = () => {
    switch (rideStatus) {
      case "pending":
        return "Buscando conductor...";
      case "accepted":
        return "Conductor en camino";
      case "ongoing":
        return "En ruta a tu destino";
      case "completed":
        return "Viaje completado";
      case "cancelled":
        return "Viaje cancelado";
      default:
        return "Estado desconocido";
    }
  };
  
  const getStatusColor = () => {
    switch (rideStatus) {
      case "pending":
        return "bg-yellow-500";
      case "accepted":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-green-700";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const saveRideToHistory = () => {
    if (!currentRide) return;
    
    try {
      // Get existing history
      const historyJSON = localStorage.getItem(RIDE_HISTORY_KEY);
      let history = [];
      
      if (historyJSON) {
        history = JSON.parse(historyJSON);
      }
      
      // Add current ride to history
      const historyItem = {
        id: currentRide.id,
        origin: currentRide.origin,
        destination: currentRide.destination,
        requestTime: currentRide.requestTime,
        status: rideStatus,
        driver: driver,
        price: currentRide.price,
        distance: currentRide.distance,
        rating: null // User can rate later
      };
      
      // Add to beginning of array
      history.unshift(historyItem);
      
      // Save back to local storage
      localStorage.setItem(RIDE_HISTORY_KEY, JSON.stringify(history));
      
      console.log("Ride saved to history:", historyItem);
    } catch (error) {
      console.error("Error saving ride to history:", error);
    }
  };
  
  const handleCancelRide = () => {
    if (rideStatus === "completed") {
      // Save completed ride to history
      saveRideToHistory();
      
      navigate("/home");
      return;
    }
    
    if (window.confirm("¿Estás seguro de que quieres cancelar este viaje?")) {
      setRideStatus("cancelled");
      
      if (currentRide && setCurrentRide) {
        setCurrentRide({
          ...currentRide,
          status: "cancelled",
        });
      }
      
      // Save cancelled ride to history
      saveRideToHistory();
      
      toast({
        title: "Viaje cancelado",
        description: "Tu viaje ha sido cancelado",
      });
      
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    }
  };

  const handleViewDriverProfile = () => {
    if (driver) {
      navigate(`/driver/${driver.id}`);
    }
  };

  const handleRateDriver = () => {
    if (currentRide) {
      // Save completed ride to history before rating
      saveRideToHistory();
      navigate(`/rate-driver/${currentRide.id}`);
    }
  };

  // Si no hay viaje activo, mostrar mensaje y redireccionar
  if (!currentRide) {
    return (
      <MainLayout requireAuth>
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No hay viaje activo</h2>
            <p className="text-gray-600 mb-4">Redirigiendo a la página principal...</p>
            <Button onClick={() => navigate("/home")}>
              Ir al inicio
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen pb-24">
        <div className="relative">
          {/* Mapa para el seguimiento */}
          <div className="h-[40vh] w-full">
            {currentRide && (
              <Map
                origin={currentRide.origin}
                destination={currentRide.destination}
                showDriverPosition={rideStatus === "accepted" || rideStatus === "ongoing"}
                driverPosition={driverPosition}
                showRoute={true}
                className="h-full"
              />
            )}
          </div>
          
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md"
            aria-label="Volver a la página de inicio"
          >
            <ArrowLeft size={20} className="text-tenerife-blue" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Seguimiento de viaje</h1>
            <Badge variant="outline" className={`${getStatusColor()} text-white`}>
              {getStatusText()}
            </Badge>
          </div>
          
          {currentRide && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">              
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Origen</p>
                      <p className="font-medium">{currentRide.origin.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Destino</p>
                      <p className="font-medium">{currentRide.destination?.address}</p>
                    </div>
                  </div>
                </div>
                
                {currentRide.price && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700">Precio estimado:</p>
                    <p className="text-xl font-bold text-tenerife-blue">{currentRide.price.toFixed(2)} €</p>
                  </div>
                )}
              </div>
              
              {rideStatus !== "pending" && driver && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Información del conductor</h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleViewDriverProfile}
                      className="text-tenerife-blue"
                    >
                      Ver perfil
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      {driver.profilePicture ? (
                        <img src={driver.profilePicture} alt="Conductor" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={28} className="text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-lg">{driver.name}</p>
                      <div className="flex items-center text-amber-500">
                        <Star size={16} className="fill-amber-500 mr-1" />
                        <span>{driver.rating}</span>
                      </div>
                    </div>
                    
                    <div className="ml-auto">
                      <Button 
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => alert(`Llamando a ${driver.phone}`)}
                      >
                        <Phone size={20} className="text-tenerife-blue" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">Vehículo:</p>
                      <p className="font-medium">{driver.vehicle.make} {driver.vehicle.model}</p>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">Color:</p>
                      <p className="font-medium">{driver.vehicle.color}</p>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className="text-gray-600">Matrícula:</p>
                      <p className="font-medium">{driver.vehicle.licensePlate}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {rideStatus === "accepted" && estimatedArrival && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-3 justify-center">
                    <Clock size={20} className="text-tenerife-blue" />
                    <p className="text-lg font-medium">
                      Llegada estimada en {estimatedArrival} minutos
                    </p>
                  </div>
                </div>
              )}
              
              {rideStatus === "ongoing" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <h3 className="text-md font-medium mb-2">Progreso del viaje</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-tenerife-blue h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Origen</span>
                    <span className="text-sm text-gray-500">Destino</span>
                  </div>
                </div>
              )}
              
              {rideStatus === "completed" && (
                <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">¡Viaje completado!</h3>
                  <p className="text-gray-600 mb-4">Has llegado a tu destino</p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={handleRateDriver}
                    >
                      <Star size={18} className="mr-2" />
                      Valorar viaje
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="fixed bottom-20 left-0 right-0 p-4">
                <div className="container max-w-md mx-auto">
                  <Button
                    variant={rideStatus === "completed" ? "default" : "destructive"}
                    className="w-full"
                    onClick={handleCancelRide}
                  >
                    {rideStatus === "completed" ? "Finalizar" : "Cancelar viaje"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RideTracking;
