
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAppContext } from "@/context/AppContext";
import RideRequestContent from "@/components/ride/RideRequestContent";
import { toast } from "@/hooks/use-toast";

const RideRequest = () => {
  const { testMode } = useAppContext();
  
  // Mostrar un mensaje instructivo cuando se carga la página
  React.useEffect(() => {
    toast({
      title: "¿A dónde quieres ir?",
      description: "Selecciona un origen y un destino en el mapa o usa la barra de búsqueda",
    });
  }, []);
  
  return (
    <MainLayout requireAuth>
      <RideRequestContent />
    </MainLayout>
  );
};

export default RideRequest;
