
# Map Components Architecture Documentation

## Overview

This document provides a comprehensive guide to our map implementation architecture. After refactoring, the codebase is now modular, with clear separation of concerns between components, hooks, services, and utilities.

## Component Structure

### Core Components

- **`Map.tsx`**: Main wrapper component that renders either `MapDisplay` (Mapbox) or `GoogleMapDisplay` (Google Maps) based on configuration.
- **`MapDisplay.tsx`**: Mapbox implementation that handles map initialization and rendering.
- **`GoogleMapDisplay.tsx`**: Google Maps implementation with similar functionality to MapDisplay.
- **`MapContainer.tsx`**: Renders the container element for the map with appropriate styling.
- **`MapContents.tsx`**: Renders markers, controls, and other map overlays.

### Marker Components

- **`MapMarkers.tsx`**: Container component that manages all markers displayed on the map.
- **`OriginMarker.tsx`**: Renders the origin marker for routes.
- **`DestinationMarker.tsx`**: Renders the destination marker for routes.
- **`HomeMarker.tsx`**: Renders the home location marker, including edit functionality.
- **`DriverMarker.tsx`**: Renders the driver's position marker for ride tracking.

### Control Components

- **`MapSelectionControls.tsx`**: Renders controls for map selection modes.
- **`HomeLocationControls.tsx`**: Renders buttons for home location functionality.
- **`MapControls.tsx`**: Factory for creating map controls dynamically.
- **`SelectionControls.js`**: Utility functions for creating selection controls.

## Hooks Architecture

### Map Initialization Hooks

- **`useMapInitialization.ts`**: Main hook for initializing the Mapbox map and related features.
- **`useGoogleMapInitialization.tsx`**: Equivalent for Google Maps initialization.

### Location-related Hooks

- **`useHomeLocation.ts`**: Main hook that integrates home location storage and interactions.
- **`useHomeLocationStorage.ts`**: Manages persistence of home location data.
- **`useHomeMapInteraction.ts`**: Handles map interactions related to home location.
- **`useHomeMarkerEdit.ts`**: Manages the edit mode for home location markers.

### Marker-related Hooks

- **`useMapMarkers.ts`**: Manages Mapbox markers for origin, destination, etc.
- **`useGoogleMapMarkers.tsx`**: Equivalent for Google Maps markers.
- **`useGoogleMapDriverMarker.tsx`**: Specifically for driver position markers.

### Other Map Feature Hooks

- **`useMapView.ts`**: Manages map view positioning, zoom levels, etc.
- **`useMapGeocoding.ts`**: Handles geocoding operations.
- **`useMapSelection.ts`**: Manages selection mode for picking points on the map.
- **`useGoogleMapSelection.tsx`**: Google Maps equivalent for selection.
- **`useGoogleMapRouting.tsx`**: Handles route calculation and display.
- **`useCurrentLocation.ts`**: Accesses user's current location via browser API.
- **`useMapCursor.ts`**: Manages cursor styling based on map mode.

## Services Architecture

Our services are grouped by functionality:

### Location Services

- **`HomeLocationService.ts`**: Functions for handling home location operations.
- **`MapPositionService.ts`**: Functions for saving/loading map positions.
- **`MapBoundsService.ts`**: Functions for managing map bounds and view constraints.

### Geocoding Services

- **`GeocodingService.ts`**: Google Maps geocoding utilities.
- **`GoogleGeocodingService.ts`**: Additional Google Maps geocoding functions.
- **`MapboxService.ts`**: Mapbox-specific geocoding and utility functions.

### Routing Services

- **`MapRoutingService.ts`**: Entry point for routing functions.
- **`RouteDrawingService.ts`**: Functions for visualizing routes on the map.

### Marker Services

- **`MapMarkerService.ts`**: Functions for creating and managing map markers.

## Core Type Definitions

All component and hook interfaces are defined in `types.ts`, which includes:

- `MapCoordinates`: Core type for geographical coordinates with optional address.
- `MapDriverPosition`: Extended coordinates type for driver tracking.
- `MapSelectionMode`: Union type for different map selection modes.
- `MapProps`: Props interface for the main Map component.

## Integration Points

### Integration with Ride Components

- **`MapViewer.tsx`**: Used in ride context for route planning.
- **`MapViewSection.tsx`**: UI container for MapViewer with additional controls.
- **`EnhancedLocationSelector.tsx`**: UI for selecting locations with autocomplete.

### Integration with Home Location Setup

- **`HomeLocationSetup.tsx`**: Dedicated screen for configuring home location.

## Best Practices for Development

1. **Adding a new map feature**:
   - Create dedicated hook(s) in the `hooks` directory
   - Create service functions in the `services` directory
   - Add UI components in the `components` directory
   - Update types in `types.ts` if needed

2. **Extending marker functionality**:
   - Add a new marker component in the `markers` directory
   - Update `MapMarkers.tsx` to include your new marker
   - Create hooks for marker-specific logic if needed

3. **Adding a new control**:
   - Create a new component in the `controls` directory
   - Add it to `MapContents.tsx` or other appropriate container

4. **Switching between map providers**:
   - Update the rendering logic in `Map.tsx`
   - Ensure equivalent hooks exist for both Mapbox and Google Maps

## Flow of Execution

1. The Map component is rendered with props like `origin`, `destination`, etc.
2. Based on configuration, either GoogleMapDisplay or MapDisplay is rendered.
3. The display component initializes the map and sets up event listeners.
4. Markers are added based on coordinates provided in props.
5. User interactions (clicks, drags) are captured and processed.
6. Callbacks are triggered for changes to origin, destination, etc.

## Home Location Architecture

Home location functionality is now split into three parts:

1. **Storage** (`useHomeLocationStorage.ts`):
   - Handles saving/loading home location data
   - Compatible with both local storage and favorites system

2. **Map Interaction** (`useHomeMapInteraction.ts`):
   - Handles map-specific functionality
   - Sets home as origin, checks if a location is home, etc.

3. **Core Integration** (`useHomeLocation.ts`):
   - Ties storage and interaction together
   - Provides a clean API for components

## Future Improvements

- Consider implementing a state management solution for complex map state
- Add unit tests for hooks and services
- Create visual regression tests for map components
- Optimize marker rendering for better performance with many markers
- Add support for offline map caching
