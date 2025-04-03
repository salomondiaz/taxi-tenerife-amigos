
import React from "react";
import RequestHeader from "./header/RequestHeader";
import RideRequestMain from "./RideRequestMain";
import RecentRidesSection from "./RecentRidesSection";

const RideRequestContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <RequestHeader />
      <div className="px-4 py-3 bg-blue-50 rounded-lg mb-4 max-w-4xl mx-auto">
        <h3 className="text-blue-800 font-medium text-sm mb-1">Cómo usar el mapa:</h3>
        <p className="text-blue-700 text-sm">
          1️⃣ <strong>Primer clic</strong> en el mapa: Marca tu <strong className="text-blue-600">punto de origen</strong> (azul)<br/>
          2️⃣ <strong>Segundo clic</strong> en el mapa: Marca tu <strong className="text-red-600">destino</strong> (rojo)<br/>
          3️⃣ O usa los botones "Usar mi ubicación" y "Casa como destino" para selección automática
        </p>
      </div>
      <RideRequestMain />
      <RecentRidesSection />
    </div>
  );
};

export default RideRequestContent;
