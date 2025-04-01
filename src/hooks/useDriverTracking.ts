
import { useState, useEffect } from 'react';
import { MapCoordinates, MapDriverPosition } from '@/components/map/types';
import { supabase } from '@/integrations/supabase/client';

interface UseDriverTrackingProps {
  rideId?: string;
}

interface DriverStatus {
  isAssigned: boolean;
  isPickingUp: boolean;
  hasPickedUp: boolean;
  isCompleted: boolean;
}

export function useDriverTracking({ rideId }: UseDriverTrackingProps) {
  const [driverPosition, setDriverPosition] = useState<MapDriverPosition | null>(null);
  const [driverStatus, setDriverStatus] = useState<DriverStatus>({
    isAssigned: false,
    isPickingUp: false,
    hasPickedUp: false,
    isCompleted: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!rideId) return;

    setIsLoading(true);
    
    // Fetch initial driver data
    const fetchDriverData = async () => {
      try {
        // Example: In a real app, you'd get this from your API/Supabase
        const { data, error } = await supabase
          .from('rides')
          .select('status, driver_id, driver_location, pickup_status')
          .eq('id', rideId)
          .single();
          
        if (error) throw error;
        
        if (data && data.driver_id) {
          setDriverStatus({
            isAssigned: true,
            isPickingUp: data.status === 'accepted',
            hasPickedUp: data.pickup_status === 'picked_up',
            isCompleted: data.status === 'completed',
          });
          
          if (data.driver_location) {
            setDriverPosition({
              lat: data.driver_location.lat,
              lng: data.driver_location.lng,
              heading: data.driver_location.heading,
              timestamp: new Date().getTime()
            });
          }
        }
      } catch (err) {
        console.error('Error fetching driver data:', err);
        setError('Unable to fetch driver information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDriverData();
    
    // Subscribe to real-time updates for driver location
    const channel = supabase
      .channel(`ride_updates:${rideId}`)
      .on('broadcast', { event: 'driver_update' }, (payload) => {
        try {
          const { location, status, pickup_status } = payload.payload;
          
          if (location) {
            setDriverPosition({
              lat: location.lat,
              lng: location.lng,
              heading: location.heading,
              timestamp: new Date().getTime()
            });
          }
          
          if (status || pickup_status) {
            setDriverStatus({
              isAssigned: true,
              isPickingUp: status === 'accepted',
              hasPickedUp: pickup_status === 'picked_up',
              isCompleted: status === 'completed',
            });
          }
        } catch (err) {
          console.error('Error processing driver update:', err);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);
  
  return { driverPosition, driverStatus, error, isLoading };
}
