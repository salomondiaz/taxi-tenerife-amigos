
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "react-router-dom";
import { useHomeLocationStorage } from "@/hooks/useHomeLocationStorage";
import HomeLocationSetup from "@/components/ride/HomeLocationSetup";

const HomeLocationSettings = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { resetHomeLocation } = useHomeLocationStorage();
  
  const handleReset = () => {
    resetHomeLocation();
    toast({
      title: "Casa reiniciada",
      description: "Tu ubicación de casa ha sido reiniciada al valor predeterminado.",
    });
  };
  
  const handleBack = () => {
    router.push('/ajustes');
  };
  
  return (
    <MainLayout requireAuth={false}>
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ubicación de Casa</h1>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleBack}>
              Volver a ajustes
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Restablecer a predeterminado
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-1">
          <HomeLocationSetup setOrigin={() => {}} />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeLocationSettings;
