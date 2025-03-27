import { MapCoordinates } from '../types';

interface UseDriverSimulationProps {
  testMode: boolean;
  showDriverPosition: boolean;
  origin?: MapCoordinates;
  destination?: MapCoordinates;
  driverPosition?: {
    lat: number;
    lng: number;
  };
}

export const useDriverSimulation = ({
  testMode,
  showDriverPosition,
  origin,
  destination,
  driverPosition
}: UseDriverSimulationProps): void => {
  // This is now just a placeholder
  // We're using MapDisplay directly and no longer need this simulation logic
};
