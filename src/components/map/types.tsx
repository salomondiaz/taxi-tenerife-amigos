
import React from 'react';

export const API_KEY_STORAGE_KEY = 'google_maps_api_key';

export type MapSelectionMode = 'origin' | 'destination' | null;

export type TrafficLevel = 'low' | 'moderate' | 'high' | 'very_high' | null;

export interface MapCoordinates {
  lat: number;
  lng: number;
  address?: string;
}

export interface MapDriverPosition {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface MapProps {
  origin?: MapCoordinates | null;
  destination?: MapCoordinates | null;
  routeGeometry?: any;
  onOriginChange?: (coordinates: MapCoordinates) => void;
  onDestinationChange?: (coordinates: MapCoordinates) => void;
  allowMapSelection?: boolean;
  showRoute?: boolean;
  routeColor?: string;
  className?: string;
  useHomeAsDestination?: () => void;
  alwaysShowHomeMarker?: boolean;
  allowHomeEditing?: boolean;
  showSelectMarkers?: boolean;
  showDriverPosition?: boolean;
  driverPosition?: MapDriverPosition;
  selectionMode?: MapSelectionMode;
}

export interface Ride {
  id: string;
  origin: MapCoordinates;
  destination: MapCoordinates;
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  requestTime: Date;
  distance?: number;
  price?: number;
  paymentMethodId?: string;
  driver?: {
    id: string;
    name: string;
    rating: number;
    vehicle?: {
      make: string;
      model: string;
      licensePlate: string;
      color: string;
    };
    profilePicture?: string;
  };
  createdAt: string;
}
