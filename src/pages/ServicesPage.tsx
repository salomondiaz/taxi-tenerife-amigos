
import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const ServicesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Traslados Urbanos</h2>
            <p className="text-gray-700">
              Servicio de taxi rápido y eficiente dentro de la ciudad.
              Disponible 24/7 para tus necesidades de transporte local.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Traslados al Aeropuerto</h2>
            <p className="text-gray-700">
              Servicio puntual de recogida y entrega en el aeropuerto de Tenerife Norte
              y Tenerife Sur. Monitorización de vuelos para ajustarnos a retrasos.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Excursiones Turísticas</h2>
            <p className="text-gray-700">
              Visita los principales atractivos de Tenerife con nuestro servicio de
              taxi turístico. Tours personalizados con conductores que conocen la isla.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Servicio Corporativo</h2>
            <p className="text-gray-700">
              Soluciones de transporte para empresas. Cuentas corporativas disponibles
              con facturación mensual y reportes detallados.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Viajes Programados</h2>
            <p className="text-gray-700">
              Programa tus viajes con anticipación. Ideal para citas médicas,
              conexiones de transporte y eventos importantes.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-3">Servicios Accesibles</h2>
            <p className="text-gray-700">
              Vehículos adaptados para pasajeros con movilidad reducida.
              Servicio especializado y atención personalizada.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
