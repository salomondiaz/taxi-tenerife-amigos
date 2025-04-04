
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Clock, MapPin, ArrowRight } from "lucide-react";

const RideHistoryPage = () => {
  const mockRides = [
    {
      id: "ride-1",
      date: "10/03/2025",
      origin: "Calle Principal 123",
      destination: "Centro Comercial",
      price: "15.50",
      status: "completed"
    },
    {
      id: "ride-2",
      date: "05/03/2025",
      origin: "Oficina Central",
      destination: "Aeropuerto",
      price: "22.75",
      status: "completed"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Clock className="mr-2" /> Historial de viajes
        </h1>
        
        <div className="bg-white rounded-lg shadow">
          {mockRides.length > 0 ? (
            <div className="divide-y">
              {mockRides.map((ride) => (
                <div key={ride.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{ride.date}</span>
                    <span className="font-bold">{ride.price} €</span>
                  </div>
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-2">
                      <MapPin size={16} className="text-blue-500" />
                      <div className="h-6 border-l border-dashed border-gray-300"></div>
                      <MapPin size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm">{ride.origin}</p>
                      <p className="text-sm font-medium mt-3">{ride.destination}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay viajes en tu historial.
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RideHistoryPage;
