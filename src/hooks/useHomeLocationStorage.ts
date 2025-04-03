
import { useState, useCallback, useEffect } from 'react';
import { MapCoordinates } from '@/components/map/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const HOME_LOCATION_KEY = 'user_home_location';

export const useHomeLocationStorage = () => {
  // State to track if home location is available
  const [hasHomeLocation, setHasHomeLocation] = useState<boolean>(false);
  const [homeLocation, setHomeLocationState] = useState<MapCoordinates | null>(null);

  // Load home location on mount
  useEffect(() => {
    const location = loadHomeLocation();
    setHasHomeLocation(!!location);
    setHomeLocationState(location);
  }, []);

  // Save home location to localStorage and optionally to Supabase if user is logged in
  const saveHomeLocation = useCallback(async (location: MapCoordinates) => {
    try {
      if (!location) {
        console.error('Attempted to save undefined home location');
        return false;
      }
      
      console.log('Saving home location:', location);
      
      // Save to localStorage first for immediate availability
      localStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(location));
      setHasHomeLocation(true);
      setHomeLocationState(location);
      
      // Try to save to Supabase if user is logged in
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profile) {
            // Update profile with home location
            await supabase
              .from('profiles')
              .update({
                home_location: location
              })
              .eq('id', user.id);
          } else {
            // Create profile with home location
            await supabase
              .from('profiles')
              .insert({
                id: user.id,
                home_location: location
              });
          }
          
          console.log('Home location saved to Supabase');
        }
      } catch (error) {
        // If Supabase save fails, we still have the local storage copy
        console.error('Failed to save home location to Supabase:', error);
      }
      
      toast({
        title: "Casa guardada",
        description: "Tu ubicación ha sido guardada como tu casa"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving home location:', error);
      
      toast({
        title: "Error",
        description: "No se pudo guardar la ubicación de casa",
        variant: "destructive"
      });
      
      return false;
    }
  }, []);

  // Load home location from localStorage
  const loadHomeLocation = useCallback((): MapCoordinates | null => {
    try {
      const storedLocation = localStorage.getItem(HOME_LOCATION_KEY);
      if (!storedLocation) return null;
      
      const parsedLocation = JSON.parse(storedLocation) as MapCoordinates;
      console.log('Loaded home location:', parsedLocation);
      return parsedLocation;
    } catch (error) {
      console.error('Error loading home location:', error);
      return null;
    }
  }, []);

  // Clear home location from localStorage
  const clearHomeLocation = useCallback(() => {
    try {
      localStorage.removeItem(HOME_LOCATION_KEY);
      setHasHomeLocation(false);
      setHomeLocationState(null);
      
      toast({
        title: "Casa eliminada",
        description: "Tu ubicación de casa ha sido eliminada"
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing home location:', error);
      return false;
    }
  }, []);

  // Update home location (alias for saveHomeLocation)
  const updateHomeLocation = useCallback((location: MapCoordinates) => {
    return saveHomeLocation(location);
  }, [saveHomeLocation]);

  // Helper to use home location as origin - fixed to prevent flickering
  const useHomeAddress = useCallback((setOrigin: (address: string) => void, handleOriginChange: (coordinates: MapCoordinates) => void) => {
    const home = loadHomeLocation();
    if (home) {
      // Set origin address first to avoid UI jumps
      setOrigin(home.address || "Mi Casa");
      
      // Short timeout to prevent state updates too close together
      setTimeout(() => {
        handleOriginChange(home);
      }, 50);
      
      toast({
        title: "Casa seleccionada como origen",
        description: "Tu ubicación de casa ha sido establecida como punto de origen."
      });
      
      return true;
    } else {
      toast({
        title: "No hay casa guardada",
        description: "Primero debes guardar una ubicación como casa.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [loadHomeLocation]);

  return {
    hasHomeLocation,
    homeLocation,
    saveHomeLocation,
    loadHomeLocation,
    clearHomeLocation,
    updateHomeLocation,
    useHomeAddress
  };
};
