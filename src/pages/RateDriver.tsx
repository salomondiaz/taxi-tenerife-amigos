
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Star, Send, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

type DriverRating = {
  driverId: string;
  tripId: string;
  driverName: string;
  driverImage?: string;
  tripDate: Date;
  origin: string;
  destination: string;
  rating: number;
  comment: string;
};

const RateDriver: React.FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { setCurrentRide } = useAppContext();
  
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tripDetails, setTripDetails] = useState<{
    driverId: string;
    driverName: string;
    origin: string;
    destination: string;
    date: Date;
  } | null>(null);

  useEffect(() => {
    // Simulación de carga de detalles del viaje
    const fetchTripDetails = () => {
      setTimeout(() => {
        setTripDetails({
          driverId: "driver-1",
          driverName: "Carlos Rodríguez",
          origin: "Av. Tres de Mayo, Santa Cruz de Tenerife",
          destination: "Playa de Las Teresitas, Santa Cruz de Tenerife",
          date: new Date(),
        });
      }, 1000);
    };
    
    fetchTripDetails();
  }, [tripId]);

  const handleMouseOver = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSetRating = (index: number) => {
    setRating(index);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Valoración requerida",
        description: "Por favor, indica una valoración con estrellas",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulación de envío de valoración
    setTimeout(() => {
      const ratingData: DriverRating = {
        driverId: tripDetails?.driverId || "unknown",
        tripId: tripId || "unknown",
        driverName: tripDetails?.driverName || "Unknown Driver",
        tripDate: tripDetails?.date || new Date(),
        origin: tripDetails?.origin || "",
        destination: tripDetails?.destination || "",
        rating,
        comment,
      };

      // En una app real, aquí enviaríamos los datos a una API
      console.log("Rating submitted:", ratingData);

      setIsSubmitting(false);
      
      // Resetear el viaje actual
      setCurrentRide(null);
      
      toast({
        title: "¡Gracias por tu valoración!",
        description: "Tu opinión nos ayuda a mejorar el servicio",
      });
      
      navigate("/home");
    }, 1500);
  };

  const renderStar = (index: number) => {
    const filled = (hoverRating || rating) >= index;
    
    return (
      <Star
        key={index}
        size={36}
        className={`cursor-pointer transition-colors ${
          filled ? "text-amber-500 fill-amber-500" : "text-gray-300"
        }`}
        onMouseOver={() => handleMouseOver(index)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleSetRating(index)}
      />
    );
  };

  const starLabels = [
    "Muy malo",
    "Malo",
    "Regular",
    "Bueno",
    "Excelente"
  ];

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6 pb-24">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold mb-6">Valorar al conductor</h1>

        {tripDetails ? (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={28} className="text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{tripDetails.driverName}</h2>
                    <p className="text-sm text-gray-600">
                      {tripDetails.origin} → {tripDetails.destination}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="text-lg font-medium mb-6">¿Cómo calificarías a tu conductor?</h3>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(index => renderStar(index))}
              </div>
              
              {(hoverRating || rating) > 0 && (
                <p className="text-sm font-medium mb-8 text-tenerife-blue">
                  {starLabels[(hoverRating || rating) - 1]}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Déjanos un comentario sobre tu experiencia (opcional)
              </label>
              <Textarea
                id="comment"
                placeholder="¿Qué te ha parecido el servicio?"
                className="w-full"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-tenerife-blue hover:bg-tenerife-blue/90"
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Enviar valoración
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RateDriver;
