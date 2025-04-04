import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useRideRequestMain = () => {
  const supabase = useSupabaseClient();

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
      const { data, error } = await supabase.from("rides").insert([
        {
          origin,
          destination,
          distance,
          duration,
          price,
          scheduled_at: scheduledDate ? scheduledDate.toISOString() : null,
          status: "pending",
          user_id: (await supabase.auth.getUser()).data?.user?.id,
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
    const supabase = useSupabaseClient();
    const { data, error } = await supabase.from("rides").insert([
      {
        origin,
        destination,
        distance,
        duration,
        price,
        scheduled_at: scheduledDate ? scheduledDate.toISOString() : null,
        status: "pending",
        user_id: (await supabase.auth.getUser()).data?.user?.id,
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
