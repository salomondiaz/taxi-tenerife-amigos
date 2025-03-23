import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Star, Clock, CalendarIcon, Car, Navigation } from "lucide-react";
import Input from "@/components/ui/input";

const Home = () => {
  const navigate = useNavigate();
  const { user, testMode } = useAppContext();
  const [recentRides, setRecentRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (testMode) {
        setRecentRides([
          {
            id: "ride-1",
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            origin: "Plaza del Charco, Puerto de la Cruz",
            destination: "Loro Parque, Puerto de la Cruz",
            price: 5.75,
            distance: 2.3,
            duration: 8,
            rating: 5,
            driver: {
              name: "Carlos M.",
              rating: 4.8,
              vehicle: "Toyota Prius",
              licensePlate: "1234-ABC",
            },
          },
          {
            id: "ride-2",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            origin: "Hotel Botánico, Puerto de la Cruz",
            destination: "Playa Jardín, Puerto de la Cruz",
            price: 4.50,
            distance: 1.8,
            duration: 6,
            rating: 4,
            driver: {
              name: "Ana L.",
              rating: 4.9,
              vehicle: "Hyundai Ioniq",
              licensePlate: "5678-DEF",
            },
          },
          {
            id: "ride-3",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            origin: "La Orotava Centro",
            destination: "Puerto de la Cruz",
            price: 8.25,
            distance: 4.5,
            duration: 12,
            rating: 5,
            driver: {
              name: "Miguel R.",
              rating: 4.7,
              vehicle: "Dacia Lodgy",
              licensePlate: "9012-GHI",
            },
          },
        ]);
      } else {
        setRecentRides([]);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [testMode]);

  const handleRequestRide = () => {
    navigate("/request-ride");
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + " €";
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen pb-16">
        <div className="bg-tenerife-blue text-white px-6 pt-12 pb-6 rounded-b-3xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</h1>
              <p className="text-white/80 text-sm mt-1">¿A dónde quieres ir hoy?</p>
            </div>
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Foto de perfil" 
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleRequestRide}
            variant="default" 
            className="w-full bg-white text-tenerife-blue hover:bg-gray-100 transition-colors shadow-lg"
          >
            <MapPin size={20} />
            Solicitar un taxi
          </Button>
        </div>
        
        <div className="px-6 py-8">
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
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                        Punto de recogida
                      </label>
                      <Input 
                        id="pickup"
                        type="text"
                        placeholder="¿Dónde te recogemos?"
                        className="w-full"
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
                    >
                      <Car size={18} className="mr-2" />
                      Solicitar ahora
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Viajes recientes</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-xl"></div>
                ))}
              </div>
            ) : recentRides.length > 0 ? (
              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm mr-2">
                            {formatDate(ride.date)}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {formatTime(ride.date)}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-800 mt-1">{ride.destination}</h3>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(ride.price)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>{ride.duration} min</span>
                        <span className="mx-2">•</span>
                        <span>{ride.distance} km</span>
                      </div>
                      
                      <div className="flex items-center text-amber-500">
                        <Star size={16} className="mr-1 fill-amber-500" />
                        <span>{ride.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-gray-400" />
                </div>
                <h3 className="text-gray-700 font-medium mb-2">No hay viajes recientes</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Solicita tu primer viaje para verlo aquí
                </p>
                <Button 
                  onClick={handleRequestRide}
                  variant="ghost" 
                  size="md"
                >
                  Solicitar ahora
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Destinos populares</h2>
            
            <div className="space-y-3">
              {[
                { name: "Loro Parque", address: "Puerto de la Cruz", icon: "🐬" },
                { name: "Playa Jardín", address: "Puerto de la Cruz", icon: "🏖️" },
                { name: "Drago Milenario", address: "Icod de los Vinos", icon: "🌳" },
                { name: "La Orotava Centro", address: "La Orotava", icon: "🏛️" },
              ].map((destination, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate("/request-ride", { 
                      state: { destination: destination.name } 
                    });
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-lg">{destination.icon}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">{destination.name}</h3>
                      <p className="text-sm text-gray-500">{destination.address}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
