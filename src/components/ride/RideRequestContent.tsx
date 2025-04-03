
import React from "react";
import RequestHeader from "./header/RequestHeader";
import RideRequestMain from "./RideRequestMain";
import RecentRidesSection from "./RecentRidesSection";

const RideRequestContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <RequestHeader />
      <div className="px-4 py-3 bg-blue-50 rounded-lg mb-4 max-w-4xl mx-auto">
        <h3 className="text-blue-800 font-medium text-sm mb-1">Instrucciones:</h3>
        <p className="text-blue-700 text-sm">
          1️⃣ Haz clic en el botón "<strong>Seleccionar origen</strong>" (azul) y luego en el mapa para marcar el punto de partida<br/>
          2️⃣ Haz clic en el botón "<strong>Seleccionar destino</strong>" (rojo) y luego en el mapa para marcar hacia dónde quieres ir<br/>
          3️⃣ Verifica la información del viaje y selecciona tu método de pago preferido
        </p>
      </div>
      <RideRequestMain />
      <RecentRidesSection />
    </div>
  );
};

export default RideRequestContent;
