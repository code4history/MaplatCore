// This example shows how to use @maplat/core in a Deno environment
// Note: MaplatCore is a browser-only library and requires DOM APIs

// Example 1: Using with Fresh framework
// File: islands/MaplatViewer.tsx

/*
import { MaplatApp } from "@maplat/core";
import { useEffect, useRef } from "preact/hooks";

export default function MaplatViewer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<MaplatApp | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize MaplatApp
    const app = new MaplatApp({
      appid: "ueda_castle",
      div: mapRef.current,
    });
    
    appRef.current = app;
    
    // Wait for the map to be ready
    app.waitReady.then(() => {
      console.log("Map is ready!");
      
      // Example: Add a marker
      app.addPoiLayer([{
        id: "castle",
        name: "Ueda Castle",
        lat: 36.4041,
        lng: 138.2443,
        icon: "castle_icon"
      }]);
    });
    
    // Cleanup
    return () => {
      if (appRef.current) {
        appRef.current.destroy();
      }
    };
  }, []);
  
  return (
    <div 
      ref={mapRef} 
      style={{ width: "100%", height: "600px" }}
    />
  );
}
*/

// Example 2: Type definitions for your application
// You can import types directly:

import type { MaplatApp, MapOptions } from "@maplat/core";

const mapConfig: MapOptions = {
  appid: "sample_map",
  div: "map-container",
  lang: "ja",
  zoom: 16,
  // Optional: Use MapLibre instead of default
  mapboxgl: undefined, // Don't use Mapbox
  maplibregl: "will-be-provided-by-browser", // Use MapLibre
};

// Example 3: Creating a custom map application class
/*
import { MaplatApp } from "@maplat/core";

export class MyHistoricalMapApp {
  private app: MaplatApp;
  
  constructor(containerId: string) {
    // Note: This will only work in browser environment
    this.app = new MaplatApp({
      appid: "my_historical_map",
      div: containerId,
    });
  }
  
  async loadMap(mapId: string) {
    await this.app.waitReady;
    await this.app.changeMap(mapId);
  }
  
  destroy() {
    this.app.destroy();
  }
}
*/

// Important Notes:
// 1. This library only works in browser environments
// 2. You need to provide mapboxgl or maplibregl objects when initializing
// 3. OpenLayers is a required peer dependency
// 4. Use with Fresh, Aleph.js, or other Deno web frameworks that support client-side code