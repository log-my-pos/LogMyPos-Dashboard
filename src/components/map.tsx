"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

export function AppMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        container: mapContainer.current,
        style: "mapbox://styles/julianmaggio/cmoijn6tp002201sfdm0nab23",
        center: [0, 0],
        zoom: 2,
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");

      return () => map.remove();
    }
  }, []);

  return <div style={{width: "100vw", height: "100vh"}} ref={mapContainer} />;
}
