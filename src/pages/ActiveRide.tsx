
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MapPin, Navigation, Phone, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const ActiveRidePage = () => {
  const { id } = useParams();
  
  // Mock ride data - in a real app, you would fetch this from your backend
  const rideDetails = {
    id: id || "unknown",
    driverName: "Carlos Rodríguez",
    driverRating: 4.8,
    carModel: "Toyota Corolla",
    licensePlate: "5678 ABC",
    estimatedArrival: "5 min",
    origin: "Calle Principal 123",
    destination: "Centro Comercial La Plaza",
    price: "18.50",
    status: "en ruta"
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg mb-6 p-4">
          <h1 className="text-xl font-bold mb-2">Tu viaje está {rideDetails.status}</h1>
          <p className="text-gray-500 mb-4">ID del viaje: {rideDetails.id}</p>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="font-bold text-blue-600">CR</span>
              </div>
              <div>
                <h3 className="font-medium">{rideDetails.driverName}</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm">{rideDetails.driverRating}</span>
                </div>
              </div>
              <div className="ml-auto">
                <p className="text-sm text-gray-600">{rideDetails.carModel}</p>
                <p className="text-sm font-medium">{rideDetails.licensePlate}</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <Phone size={16} className="mr-2" /> Llamar
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare size={16} className="mr-2" /> Mensaje
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-blue-600" />
              <span>Llegada estimada: <strong>{rideDetails.estimatedArrival}</strong></span>
            </div>
            
            <div className="flex items-start mt-4">
              <div className="flex flex-col items-center mr-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="h-10 border-l border-dashed border-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="flex flex-col space-y-6 flex-1">
                <div>
                  <p className="text-sm text-gray-500">Origen</p>
                  <p className="font-medium">{rideDetails.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destino</p>
                  <p className="font-medium">{rideDetails.destination}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <span className="font-medium">Precio final:</span>
            <span className="text-xl font-bold">{rideDetails.price}€</span>
          </div>
        </div>
        
        <Button variant="default" className="w-full">
          Cancelar viaje
        </Button>
      </div>
    </MainLayout>
  );
};

export default ActiveRidePage;
