
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { 
  Map as MapIcon, 
  Layers, 
  Maximize, 
  Compass, 
  Plus, 
  Minus, 
  Navigation,
  Search,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Detection {
  id: string;
  label: string;
  confidence: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export function MapPanel() {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [selectedMarker, setSelectedMarker] = useState<Detection | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });
  
  // Guemar, El Oued, Algeria coordinates
  const guemarLocation = { lat: 33.4947, lng: 6.7974 };

  // Detection positions around Guemar
  const detections: Detection[] = [
    { id: "1", label: "Human Trace", confidence: 0.78, latitude: 33.4957, longitude: 6.7984, timestamp: new Date(Date.now() - 900000).toISOString() },
    { id: "2", label: "Camel Activity", confidence: 0.92, latitude: 33.4930, longitude: 6.7950, timestamp: new Date(Date.now() - 750000).toISOString() },
    { id: "3", label: "Vehicle Tracks", confidence: 0.85, latitude: 33.4980, longitude: 6.8020, timestamp: new Date(Date.now() - 600000).toISOString() },
  ];

  const mapContainerStyle = useMemo(() => ({
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
  }), []);

  const mapOptions = useMemo(() => ({
    mapTypeId: "satellite" as const,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: true,
    zoomControl: false,
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#242f3e" }],
      },
    ],
  }), []);

  const getMarkerIcon = (confidence: number) => {
    if (!isLoaded) return undefined;
    const color = confidence > 0.85 ? "#ef4444" : "#eab308";
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: "#ffffff",
      strokeWeight: 1.5,
    };
  };

  const droneMarkerIcon = useMemo(() => {
    if (!isLoaded) return undefined;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "hsl(var(--accent))",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  }, [isLoaded]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="aspect-[16/10] bg-neutral-900 rounded-lg animate-pulse" />;

  if (!apiKey) {
    return (
      <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl">
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col gap-4 items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <div className="text-center">
            <p className="text-sm font-semibold mb-2">Google Maps API Key Required</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs">Add key to .env.local</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!isLoaded) return <Card className="relative bg-neutral-900 aspect-[16/10]" />;

  return (
    <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={guemarLocation}
        zoom={zoom}
        options={mapOptions}
      >
        <Marker position={guemarLocation} title="Guemar Base" icon={droneMarkerIcon} />
        {detections.map((d) => (
          <Marker
            key={d.id}
            position={{ lat: d.latitude, lng: d.longitude }}
            icon={getMarkerIcon(d.confidence)}
            onClick={() => setSelectedMarker(d)}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="bg-background text-foreground p-3 rounded text-xs font-mono">
              <div className="font-bold text-primary uppercase">{selectedMarker.label}</div>
              <div>CONF: {(selectedMarker.confidence * 100).toFixed(0)}%</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-lg border border-primary/20 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Zone: Guemar</span>
            <span className="text-xs font-mono font-bold">ALGERIA // EL OUED</span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-background/90 backdrop-blur-xl rounded-lg border border-primary/20 shadow-2xl">
          <button onClick={() => setZoom(z => z + 1)} className="p-2 border-b border-primary/10"><Plus className="w-4 h-4" /></button>
          <button onClick={() => setZoom(z => z - 1)} className="p-2"><Minus className="w-4 h-4" /></button>
        </div>
      </div>
    </Card>
  );
}
