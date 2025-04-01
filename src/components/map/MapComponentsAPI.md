
# Map Components API Reference

This document provides a quick reference for the main components and hooks in our map implementation.

## Core Components

### `Map`

```tsx
import Map from '@/components/Map';

<Map
  origin={originCoordinates}
  destination={destinationCoordinates}
  routeGeometry={routeData}
  onOriginChange={handleOriginChange}
  onDestinationChange={handleDestinationChange}
  allowMapSelection={true}
  showDriverPosition={false}
  driverPosition={driverCoordinates}
  interactive={true}
  showRoute={true}
  allowHomeEditing={false}
  useHomeAsDestination={() => {}}
  alwaysShowHomeMarker={true}
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `origin` | `MapCoordinates` | Starting point coordinates |
| `destination` | `MapCoordinates` | Ending point coordinates |
| `routeGeometry` | `any` | Route geometry from directions API |
| `onOriginChange` | `(coords: MapCoordinates) => void` | Called when origin changes |
| `onDestinationChange` | `(coords: MapCoordinates) => void` | Called when destination changes |
| `allowMapSelection` | `boolean` | Enable map point selection |
| `showDriverPosition` | `boolean` | Show driver marker on map |
| `driverPosition` | `MapDriverPosition` | Driver coordinates and heading |
| `interactive` | `boolean` | Enable map interaction (zoom, pan) |
| `showRoute` | `boolean` | Show route between points |
| `allowHomeEditing` | `boolean` | Enable home location editing |
| `useHomeAsDestination` | `() => void` | Callback to set home as destination |
| `alwaysShowHomeMarker` | `boolean` | Always show home marker |

## Map Viewer Components

### `MapViewer`

```tsx
import MapViewer from '@/components/ride/MapViewer';

<MapViewer
  useManualSelection={true}
  originCoords={originCoordinates}
  destinationCoords={destinationCoordinates}
  routeGeometry={routeData}
  handleOriginChange={setOrigin}
  handleDestinationChange={setDestination}
  saveRideToSupabase={saveRide}
  useHomeAsDestination={goHome}
  onMapClick={handleMapClick}
  alwaysShowHomeMarker={true}
/>
```

## Key Hooks

### `useHomeLocation`

```tsx
import { useHomeLocation } from '@/components/map/hooks/useHomeLocation';

const { 
  homeLocation,
  showHomeMarker,
  isHomeLocation,
  saveHomeLocation,
  useHomeAsOrigin,
  updateHomeLocation
} = useHomeLocation(map, origin, onOriginChange);
```

### `useHomeLocationStorage`

```tsx
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

const { 
  loadHomeLocation,
  saveHomeLocation,
  updateHomeLocation
} = useHomeLocationStorage();
```

### `useHomeMapInteraction`

```tsx
import { useHomeMapInteraction } from '@/components/map/hooks/useHomeMapInteraction';

const {
  useHomeAsOrigin,
  isHomeLocation
} = useHomeMapInteraction(map, homeLocation, onOriginChange);
```

## Core Types

### `MapCoordinates`

```tsx
type MapCoordinates = {
  lat: number;
  lng: number;
  address?: string;
};
```

### `MapDriverPosition`

```tsx
type MapDriverPosition = {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
};
```

### `MapSelectionMode`

```tsx
type MapSelectionMode = 'none' | 'origin' | 'destination' | 'edit-home';
```

## Services API

### Home Location Services

```tsx
import { zoomToHomeLocation } from '@/components/map/services/MapRoutingService';

// Zoom map to home location
zoomToHomeLocation(mapInstance, homeCoordinates);
```

### Map Position Services

```tsx
import { 
  saveLastMapPosition, 
  loadLastMapPosition 
} from '@/components/map/services/MapRoutingService';

// Save current map position
saveLastMapPosition(mapInstance);

// Restore last saved map position
loadLastMapPosition(mapInstance);
```

### Map Bounds Services

```tsx
import { 
  fitMapToBounds, 
  isWithinTenerifeBounds 
} from '@/components/map/services/MapRoutingService';

// Fit map to show both origin and destination
fitMapToBounds(mapInstance, originCoords, destinationCoords);

// Check if coordinates are within Tenerife
const isValid = isWithinTenerifeBounds(coordinates);
```

## Integration Examples

### Basic Map with Selection

```tsx
import Map from '@/components/Map';
import { MapCoordinates } from '@/components/map/types';

function MapSelector() {
  const [origin, setOrigin] = useState<MapCoordinates | null>(null);
  const [destination, setDestination] = useState<MapCoordinates | null>(null);
  
  return (
    <Map
      origin={origin}
      destination={destination}
      onOriginChange={setOrigin}
      onDestinationChange={setDestination}
      allowMapSelection={true}
      showRoute={true}
      alwaysShowHomeMarker={true}
    />
  );
}
```

### Map with Home Location

```tsx
import Map from '@/components/Map';
import { useHomeLocationStorage } from '@/hooks/useHomeLocationStorage';

function HomeMap() {
  const [origin, setOrigin] = useState<MapCoordinates | null>(null);
  const { loadHomeLocation, saveHomeLocation } = useHomeLocationStorage();
  const homeLocation = loadHomeLocation();
  
  const handleSaveHome = () => {
    if (origin) {
      saveHomeLocation(origin);
    }
  };
  
  return (
    <>
      <Map
        origin={origin}
        onOriginChange={setOrigin}
        allowMapSelection={true}
        allowHomeEditing={true}
        alwaysShowHomeMarker={true}
      />
      <button onClick={handleSaveHome}>Save as Home</button>
    </>
  );
}
```
