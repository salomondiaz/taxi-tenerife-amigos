
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, MapPin, Navigation } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const RideHistoryPage = () => {
  // Mock ride history data
  const rides = [
    {
      id: "ride-123",
      date: new Date(2023, 5, 15, 14, 30),
      origin: "Aeropuerto Tenerife Norte",
      destination: "Hotel Botánico, Puerto de la Cruz",
      distance: 24.5,
      price: 32.5,
      status: "completed",
    },
    {
      id: "ride-124",
      date: new Date(2023, 5, 10, 10, 15),
      origin: "Playa de las Américas",
      destination: "Teide National Park",
      distance: 63.2,
      price: 75.8,
      status: "completed",
    },
    {
      id: "ride-125",
      date: new Date(2023, 5, 5, 19, 45),
      origin: "Santa Cruz de Tenerife",
      destination: "La Laguna",
      distance: 9.7,
      price: 14.5,
      status: "cancelled",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Clock className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Historial de viajes</h1>
        </div>

        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id} className={ride.status === "cancelled" ? "opacity-70" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span>Viaje #{ride.id.split("-")[1]}</span>
                  <span className="text-lg font-bold text-green-700">{ride.price.toFixed(2)} €</span>
                </CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    {format(ride.date, "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{format(ride.date, "HH:mm", { locale: es })}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-blue-500 mr-2 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Punto de recogida</p>
                      <p className="text-sm text-gray-600">{ride.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Navigation className="h-4 w-4 text-red-500 mr-2 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Destino</p>
                      <p className="text-sm text-gray-600">{ride.destination}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Distancia: </span>
                    <span className="font-medium">{ride.distance.toFixed(1)} km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default RideHistoryPage;
