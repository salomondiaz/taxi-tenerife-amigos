
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Calendar, Navigation, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const RIDE_HISTORY_KEY = 'ride_history';

type TripHistoryItem = {
  id: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  requestTime: Date;
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  driver?: {
    name: string;
    rating: number;
  };
  price: number | null;
  distance: number | null;
  rating?: number;
};

const TravelHistory: React.FC = () => {
  const navigate = useNavigate();
  const { testMode } = useAppContext();
  const [trips, setTrips] = useState<TripHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrips = () => {
      setIsLoading(true);
      
      try {
        const historyJSON = localStorage.getItem(RIDE_HISTORY_KEY);
        
        if (historyJSON) {
          const rawHistory = JSON.parse(historyJSON);
          const parsedHistory = rawHistory.map((trip: any) => ({
            ...trip,
            requestTime: new Date(trip.requestTime)
          }));
          
          console.log("Loaded trip history:", parsedHistory);
          setTrips(parsedHistory);
        } else {
          console.log("No trip history found, loading example trips");
          
          const exampleTrips: TripHistoryItem[] = [
            {
              id: "trip-001",
              origin: {
                address: "Av. Tres de Mayo, Santa Cruz de Tenerife",
                lat: 28.4689,
                lng: -16.2519,
              },
              destination: {
                address: "Playa de Las Teresitas, Santa Cruz de Tenerife",
                lat: 28.5058,
                lng: -16.1856,
              },
              requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 días atrás
              status: "completed",
              driver: {
                name: "Carlos Rodríguez",
                rating: 4.8,
              },
              price: 12.5,
              distance: 8.2,
              rating: 5,
            },
            {
              id: "trip-002",
              origin: {
                address: "Plaza de España, Santa Cruz de Tenerife",
                lat: 28.4675,
                lng: -16.2487,
              },
              destination: {
                address: "Mercado Nuestra Señora de África, Santa Cruz de Tenerife",
                lat: 28.4641,
                lng: -16.2494,
              },
              requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 días atrás
              status: "completed",
              driver: {
                name: "Ana Martínez",
                rating: 4.6,
              },
              price: 6.8,
              distance: 2.5,
              rating: 4,
            },
            {
              id: "trip-003",
              origin: {
                address: "Calle La Marina, Santa Cruz de Tenerife",
                lat: 28.4677,
                lng: -16.2498,
              },
              destination: {
                address: "Auditorio de Tenerife, Santa Cruz de Tenerife",
                lat: 28.4575,
                lng: -16.2511,
              },
              requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 días atrás
              status: "cancelled",
              price: 7.5,
              distance: 3.1,
            },
            {
              id: "trip-004",
              origin: {
                address: "Aeropuerto Tenerife Norte, La Laguna",
                lat: 28.4827,
                lng: -16.3414,
              },
              destination: {
                address: "Hotel Mencey, Santa Cruz de Tenerife",
                lat: 28.4693,
                lng: -16.2512,
              },
              requestTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 días atrás
              status: "completed",
              driver: {
                name: "David López",
                rating: 4.9,
              },
              price: 22.5,
              distance: 13.8,
              rating: 5,
            },
          ];
          
          setTrips(exampleTrips);
        }
      } catch (error) {
        console.error("Error loading trip history:", error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrips();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptado";
      case "ongoing":
        return "En curso";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      case "accepted":
        return "bg-blue-500";
      case "ongoing":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Helper function to safely format price
  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined) return "0.00";
    return price.toFixed(2);
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6 pb-24">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Historial de viajes</h1>
          <Badge variant="outline" className="bg-tenerife-blue text-white">
            {trips.length} viajes
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="w-full bg-gray-50 animate-pulse">
                <CardContent className="p-6 h-[150px]"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <Card key={trip.id} className="w-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <Calendar size={18} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          {formatDistanceToNow(new Date(trip.requestTime), { 
                            addSuffix: true,
                            locale: es
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className={`${getStatusColor(trip.status)} text-white`}>
                        {getStatusText(trip.status)}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Origen</p>
                          <p className="text-sm font-medium">{trip.origin.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Navigation size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Destino</p>
                          <p className="text-sm font-medium">{trip.destination.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-500 mr-1" />
                          <span className="text-sm">{trip.distance ? `${trip.distance} km` : "Distancia no disponible"}</span>
                        </div>
                        {trip.rating && (
                          <div className="flex items-center">
                            <span className="text-sm text-amber-500">★</span>
                            <span className="text-sm ml-1">{trip.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-tenerife-blue">{formatPrice(trip.price)} €</p>
                    </div>
                    
                    {trip.status === "completed" && (
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/request-ride`, { 
                            state: { 
                              destination: trip.destination.address 
                            } 
                          })}
                        >
                          Repetir viaje
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No tienes viajes en tu historial</p>
                <Button onClick={() => navigate('/request-ride')}>
                  Solicitar tu primer viaje
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TravelHistory;
