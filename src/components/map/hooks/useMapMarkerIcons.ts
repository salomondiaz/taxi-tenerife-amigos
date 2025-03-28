
// Utility functions to generate map marker icons

/**
 * Generates an SVG marker for the origin point
 */
export const getOriginMarkerSvg = (): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" fill="#1E88E5" stroke="#ffffff" stroke-width="1"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#1E88E5"/>
    </svg>
  `;
};

/**
 * Generates an SVG marker for the destination point
 */
export const getDestinationMarkerSvg = (): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path d="M12 22s-8-4.5-8-11.8a8 8 0 0 1 16 0c0 7.3-8 11.8-8 11.8z" fill="#E53935" stroke="#ffffff" stroke-width="1"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#E53935"/>
    </svg>
  `;
};

/**
 * Generates an SVG marker for the home location
 */
export const getHomeMarkerSvg = (): string => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#4CAF50" stroke="#ffffff" stroke-width="1"/>
      <polyline points="9 22 9 12 15 12 15 22" fill="#ffffff" stroke="#4CAF50"/>
    </svg>
  `;
};

/**
 * Creates a Google Maps icon object for the given SVG
 */
export const createMarkerIcon = (svgContent: string): google.maps.Icon => {
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgContent),
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40)
  };
};
