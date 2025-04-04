
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Clock, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActiveRidePage = () => {
  const { id } = useParams();
  
  // Mock data for an active ride
  const rideData = {
    id: id || "unknown",
    status: "active",
    driverName: "Carlos Rodríguez",
    driverRating: 4.8,
    vehicleModel: "Toyota Prius",
    vehiclePlate: "1234 ABC",
    estimatedArrival: 7, // minutes
    origin: "Playa de las Teresitas, Santa Cruz",
    destination: "Centro Comercial Meridiano, Santa Cruz",
    distance: 8.5,
    estimatedTime: 15, // minutes
    price: 12.50
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Viaje en curso</h1>
          <p className="text-gray-600">ID: {rideData.id}</p>
        </div>

        {/* Map placeholder - in a real app this would be a live map */}
        <div className="bg-blue-100 h-64 rounded-lg mb-6 flex items-center justify-center">
          <p className="text-blue-700">Mapa de seguimiento en vivo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del conductor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">{rideData.driverName}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{rideData.driverRating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                    <Phone size={18} />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full h-10 w-10 p-0">
                    <MessageSquare size={18} />
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Vehículo</p>
                <p>{rideData.vehicleModel} - {rideData.vehiclePlate}</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-md flex items-center">
                <Clock className="text-yellow-700 h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium text-yellow-700">
                    Llegada en {rideData.estimatedArrival} minutos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalles del viaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Punto de recogida</p>
                    <p className="text-sm text-gray-600">{rideData.origin}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Navigation className="h-5 w-5 text-red-500 mr-2 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Destino</p>
                    <p className="text-sm text-gray-600">{rideData.destination}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">Distancia</p>
                  <p className="font-medium">{rideData.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tiempo est.</p>
                  <p className="font-medium">{rideData.estimatedTime} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium">{rideData.price.toFixed(2)} €</p>
                </div>
              </div>
              
              <Button variant="destructive" className="w-full">
                Cancelar viaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ActiveRidePage;
