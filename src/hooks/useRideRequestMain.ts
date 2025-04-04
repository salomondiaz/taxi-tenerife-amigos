
import { supabase } from "@/integrations/supabase/client";

export const useRideRequestMain = () => {
  // Function to save ride request to Supabase
  const saveRideToSupabase = async (
    origin: string,
    destination: string,
    distance: number,
    duration: number,
    price: number,
    scheduledDate: Date | null = null
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || 'anonymous';
      
      const { data, error } = await supabase.from("viajes").insert([
        {
          origen: origin,
          destino: destination,
          origen_lat: 0, // Since these aren't provided in the params, we're using placeholders
          origen_lng: 0,
          destino_lat: 0,
          destino_lng: 0,
          precio_estimado: price,
          hora_programada: scheduledDate ? scheduledDate.toISOString() : null,
          estado: "pendiente",
          usuario: userId,
        },
      ]);

      if (error) {
        console.error("Error saving ride:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error saving ride:", error);
      throw error;
    }
  };

  return { saveRideToSupabase };
};

// Standalone function for direct imports
export const saveRideToSupabase = async (
  origin: string,
  destination: string,
  distance: number,
  duration: number,
  price: number,
  scheduledDate: Date | null = null
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || 'anonymous';
    
    const { data, error } = await supabase.from("viajes").insert([
      {
        origen: origin,
        destino: destination,
        origen_lat: 0, // Since these aren't provided in the params, we're using placeholders
        origen_lng: 0,
        destino_lat: 0,
        destino_lng: 0,
        precio_estimado: price,
        hora_programada: scheduledDate ? scheduledDate.toISOString() : null,
        estado: "pendiente",
        usuario: userId,
      },
    ]);

    if (error) {
      console.error("Error saving ride:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error saving ride:", error);
    throw error;
  }
};
