
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Star, Phone, Shield, Award, ThumbsUp, Clock, MapPin, Car } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

type Driver = {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  rating: number;
  reviews: number;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
    year: number;
  };
  experience: number;
  languages: string[];
  trips: number;
  badges: {
    name: string;
    icon: string;
    description: string;
  }[];
  recentReviews: {
    author: string;
    date: Date;
    rating: number;
    comment: string;
  }[];
};

const DriverProfile: React.FC = () => {
  const navigate = useNavigate();
  const { driverId } = useParams<{ driverId: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = () => {
      setIsLoading(true);
      
      // Simulación de carga de datos del conductor
      setTimeout(() => {
        const driverData: Driver = {
          id: driverId || "driver-1",
          name: "Carlos Rodríguez",
          phone: "+34 612 345 678",
          rating: 4.8,
          reviews: 342,
          vehicle: {
            make: "Toyota",
            model: "Prius",
            licensePlate: "3456-BCM",
            color: "Blanco",
            year: 2019,
          },
          experience: 5,
          languages: ["Español", "Inglés"],
          trips: 1254,
          badges: [
            {
              name: "Conductor excelente",
              icon: "award",
              description: "Mantiene una calificación por encima de 4.7",
            },
            {
              name: "Viajes puntuales",
              icon: "clock",
              description: "Llega a tiempo a los puntos de recogida",
            },
            {
              name: "Ruta eficiente",
              icon: "map-pin",
              description: "Elige las rutas más rápidas y eficientes",
            },
          ],
          recentReviews: [
            {
              author: "María G.",
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
              rating: 5,
              comment: "Muy puntual y amable. El coche estaba muy limpio.",
            },
            {
              author: "Juan P.",
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
              rating: 4,
              comment: "Buen conductor, conoce bien las rutas de la isla.",
            },
            {
              author: "Laura M.",
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
              rating: 5,
              comment: "Excelente servicio, muy recomendable.",
            },
          ],
        };
        
        setDriver(driverData);
        setIsLoading(false);
      }, 1500);
    };
    
    fetchDriverData();
  }, [driverId]);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award size={18} />;
      case "clock":
        return <Clock size={18} />;
      case "map-pin":
        return <MapPin size={18} />;
      default:
        return <ThumbsUp size={18} />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
        />
      ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  if (isLoading) {
    return (
      <MainLayout requireAuth>
        <div className="min-h-screen p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!driver) {
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
          
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No se ha encontrado el conductor</h2>
            <p className="text-gray-600 mt-2">El perfil del conductor que buscas no está disponible</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6 pb-24 space-y-6">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold">Perfil del conductor</h1>

        <Card className="overflow-hidden">
          <div className="bg-tenerife-blue h-24"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white absolute -top-10 overflow-hidden">
              {driver.profilePicture ? (
                <img
                  src={driver.profilePicture}
                  alt={driver.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                  {driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
            </div>
            
            <div className="pt-14">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{driver.name}</h2>
                  <div className="flex items-center mt-1">
                    <div className="flex">{getRatingStars(driver.rating)}</div>
                    <span className="ml-2 text-sm">
                      ({driver.rating.toFixed(1)}) · {driver.reviews} reseñas
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Phone size={16} className="mr-1" />
                  Contactar
                </Button>
              </div>
              
              <div className="flex gap-2 mt-3">
                {driver.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-tenerife-blue">{driver.trips}</p>
                  <p className="text-xs text-gray-600">Viajes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-tenerife-blue">{driver.experience}</p>
                  <p className="text-xs text-gray-600">Años de experiencia</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-tenerife-blue">{driver.badges.length}</p>
                  <p className="text-xs text-gray-600">Insignias</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Car size={20} className="mr-2" />
              Información del vehículo
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehículo:</span>
                <span className="font-medium">
                  {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <span className="font-medium">{driver.vehicle.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matrícula:</span>
                <span className="font-medium">{driver.vehicle.licensePlate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield size={20} className="mr-2" />
              Insignias
            </h3>
            
            <div className="space-y-4">
              {driver.badges.map((badge) => (
                <div key={badge.name} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="p-1 rounded-full bg-blue-100 text-tenerife-blue">
                      {getBadgeIcon(badge.icon)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{badge.name}</p>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star size={20} className="mr-2" />
              Reseñas recientes
            </h3>
            
            <div className="space-y-4">
              {driver.recentReviews.map((review, index) => (
                <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{review.author}</p>
                    <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                  </div>
                  <div className="flex mb-2">
                    {getRatingStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                toast({
                  title: "Proximamente",
                  description: "Esta función estará disponible próximamente",
                });
              }}
            >
              Ver todas las reseñas
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DriverProfile;
