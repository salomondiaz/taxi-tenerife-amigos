
# Map Components Quickstart Guide

This guide helps you get started with our map components system after the recent refactoring.

## Basic Usage

### 1. Displaying a Simple Map

```tsx
import Map from '@/components/Map';

function SimpleMap() {
  return (
    <div className="h-[500px]">
      <Map />
    </div>
  );
}
```

### 2. Map with Origin and Destination

```tsx
import Map from '@/components/Map';
import { useState } from 'react';
import { MapCoordinates } from '@/components/map/types';

function RouteMap() {
  const [origin, setOrigin] = useState<MapCoordinates | null>(null);
  const [destination, setDestination] = useState<MapCoordinates | null>(null);
  
  return (
    <div className="h-[500px]">
      <Map
        origin={origin || undefined}
        destination={destination || undefined}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        allowMapSelection={true}
        showRoute={true}
      />
    </div>
  );
}
```

### 3. Map with Home Location

```tsx
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useState } from 'react';
import { MapCoordinates } from '@/components/map/types';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';
import { toast } from '@/hooks/use-toast';

function HomeLocationMap() {
  const [origin, setOrigin] = useState<MapCoordinates | null>(null);
  const { saveHomeLocation } = useHomeLocationStorage();
  
  const handleSaveHome = () => {
    if (!origin) {
      toast({
        title: "No origin selected",
        description: "Please select an origin point first",
        variant: "destructive"
      });
      return;
    }
    
    saveHomeLocation(origin);
    toast({
      title: "Home location saved",
      description: "Your home location has been saved successfully"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="h-[400px]">
        <Map
          origin={origin || undefined}
          onOriginChange={setOrigin}
          allowMapSelection={true}
          alwaysShowHomeMarker={true}
        />
      </div>
      
      <Button onClick={handleSaveHome} className="flex items-center gap-2">
        <Home size={16} />
        Save as Home
      </Button>
    </div>
  );
}
```

### 4. Complete Ride Planning Example

```tsx
import { useState, useCallback } from 'react';
import MapViewSection from '@/components/ride/MapViewSection';
import { MapCoordinates } from '@/components/map/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

function RidePlanner() {
  const [origin, setOrigin] = useState<MapCoordinates | null>(null);
  const [destination, setDestination] = useState<MapCoordinates | null>(null);
  const [routeGeometry, setRouteGeometry] = useState(null);
  
  const handleOriginChange = useCallback((coords: MapCoordinates) => {
    setOrigin(coords);
    setRouteGeometry(null); // Reset route when origin changes
  }, []);
  
  const handleDestinationChange = useCallback((coords: MapCoordinates) => {
    setDestination(coords);
    setRouteGeometry(null); // Reset route when destination changes
  }, []);
  
  const calculateRoute = useCallback(() => {
    if (!origin || !destination) {
      toast({
        title: "Missing locations",
        description: "Please select both origin and destination",
        variant: "destructive"
      });
      return;
    }
    
    // Sample geometry - in a real app, call a routing service API
    const sampleGeometry = {
      type: "LineString",
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat]
      ]
    };
    
    setRouteGeometry(sampleGeometry);
    toast({
      title: "Route calculated",
      description: "Route has been successfully calculated"
    });
  }, [origin, destination]);
  
  return (
    <div className="space-y-4">
      <MapViewSection
        useManualSelection={true}
        originCoords={origin}
        destinationCoords={destination}
        routeGeometry={routeGeometry}
        handleOriginChange={handleOriginChange}
        handleDestinationChange={handleDestinationChange}
        alwaysShowHomeMarker={true}
      />
      
      <div className="flex justify-center">
        <Button 
          onClick={calculateRoute}
          disabled={!origin || !destination}
          className="bg-tenerife-blue hover:bg-tenerife-blue/90"
        >
          Calculate Route
        </Button>
      </div>
    </div>
  );
}
```

## Common Tasks

### Working with Home Location

```tsx
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

function MyComponent() {
  const { 
    loadHomeLocation, 
    saveHomeLocation, 
    updateHomeLocation 
  } = useHomeLocationStorage();
  
  // Load home location
  const homeCoordinates = loadHomeLocation();
  
  // Save new home location
  const saveAsHome = (coords) => {
    saveHomeLocation(coords);
  };
  
  // Update existing home location
  const updateHome = (coords) => {
    updateHomeLocation(coords);
  };
}
```

### Map Interactions

```tsx
import { useHomeMapInteraction } from '@/components/map/hooks/useHomeMapInteraction';

function MyComponent() {
  const { 
    useHomeAsOrigin,
    isHomeLocation 
  } = useHomeMapInteraction(mapRef.current, homeLocation, handleOriginChange);
  
  // Check if a location is the home location
  const checkIsHome = (coords) => {
    return isHomeLocation(coords);
  };
  
  // Use home as origin point
  const goHome = () => {
    useHomeAsOrigin();
  };
}
```

### Google Places Autocomplete

```tsx
import GooglePlacesAutocomplete from '@/components/map/GooglePlacesAutocomplete';

function LocationInput() {
  const [address, setAddress] = useState('');
  
  const handlePlaceSelected = (coords) => {
    console.log('Selected place:', coords);
    // Do something with the coordinates
  };
  
  return (
    <GooglePlacesAutocomplete
      label="Search location"
      placeholder="Enter an address"
      value={address}
      onChange={setAddress}
      onPlaceSelected={handlePlaceSelected}
      apiKey={GOOGLE_MAPS_API_KEY}
      className="w-full"
    />
  );
}
```

## Tips and Best Practices

1. **Always provide a fixed height** for the container holding the Map component
2. **Use the `alwaysShowHomeMarker` prop** for consistent home location display
3. **Implement click handlers** using `onOriginChange` and `onDestinationChange`
4. **Use toast notifications** for map interaction feedback
5. **Enable map selection** with `allowMapSelection={true}`
6. **Reset route data** when origin or destination changes

## Debugging Tips

If you encounter issues:

1. **Check console logs** for detailed error messages
2. **Verify API keys** are correctly configured
3. **Inspect marker state** using React DevTools
4. **Look for map initialization errors** when components mount
5. **Verify coordinates** are within expected bounds

## Architecture Overview

Our map system is divided into:

- **Components**: React UI components
- **Hooks**: React hooks for state and logic
- **Services**: Pure utility functions
- **Types**: TypeScript type definitions

For more details, see the full [Map Components Architecture Documentation](./MapComponentsDocumentation.md).
