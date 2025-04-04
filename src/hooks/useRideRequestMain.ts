
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
      
      const { data, error } = await supabase.from("rides").insert([
        {
          origin,
          destination,
          distance,
          duration,
          price,
          scheduled_at: scheduledDate ? scheduledDate.toISOString() : null,
          status: "pending",
          user_id: userId,
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

// Ensure the saveRideToSupabase function accepts a Date for scheduledDate, not a string
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
    
    const { data, error } = await supabase.from("rides").insert([
      {
        origin,
        destination,
        distance,
        duration,
        price,
        scheduled_at: scheduledDate ? scheduledDate.toISOString() : null,
        status: "pending",
        user_id: userId,
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
