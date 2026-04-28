
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
  Crosshair,
  Search,
  MapPin,
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
  const [zoom, setZoom] = useState(16);
  const [selectedMarker, setSelectedMarker] = useState<Detection | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "",
  });
  
  // El Oued, Algeria coordinates - Sector B-12
  const droneLocation = { lat: 33.504435, lng: 6.912352 };

  // Detection positions around the drone location
  const detections: Detection[] = [
    { id: "1", label: "Human Trace", confidence: 0.78, latitude: 33.504435, longitude: 6.912352, timestamp: new Date(Date.now() - 900000).toISOString() }, // قدم يمنى
    { id: "2", label: "Human Trace", confidence: 0.80, latitude: 33.504438, longitude: 6.912355, timestamp: new Date(Date.now() - 750000).toISOString() }, // قدم يسرى - متجاورة
    { id: "3", label: "Human Trace", confidence: 0.82, latitude: 33.504443, longitude: 6.912360, timestamp: new Date(Date.now() - 600000).toISOString() }, // قدم يمنى
    { id: "4", label: "Human Trace", confidence: 0.75, latitude: 33.504446, longitude: 6.912363, timestamp: new Date(Date.now() - 450000).toISOString() }, // قدم يسرى - متجاورة
    { id: "5", label: "Human Trace", confidence: 0.79, latitude: 33.504451, longitude: 6.912368, timestamp: new Date(Date.now() - 300000).toISOString() }, // قدم يمنى
    { id: "6", label: "Human Trace", confidence: 0.71, latitude: 33.504454, longitude: 6.912371, timestamp: new Date(Date.now() - 200000).toISOString() }, // قدم يسرى - متجاورة
    { id: "7", label: "Human Trace", confidence: 0.74, latitude: 33.504459, longitude: 6.912376, timestamp: new Date(Date.now() - 100000).toISOString() }, // قدم يمنى
    { id: "8", label: "Human Trace", confidence: 0.71, latitude: 33.504462, longitude: 6.912379, timestamp: new Date(Date.now() - 30000).toISOString() },  // قدم يسرى - متجاورة
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
  }), []);

  // Marker icon generator function
  const getMarkerIcon = (confidence: number) => {
    if (!isLoaded) return undefined;
    
    const color = confidence > 0.85 ? "#ef4444" : confidence > 0.75 ? "#f97316" : "#eab308";
    
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

  const hasApiKey = !!apiKey;

  if (!hasApiKey) {
    return (
      <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl">
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col gap-4 items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <div className="text-center">
            <p className="text-sm font-semibold mb-2">Google Maps API Key Required</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs">
              Add your Google Maps API key to .env.local:
            </p>
            <code className="text-xs bg-background/50 px-3 py-2 rounded border border-primary/20 block my-3">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
            </code>
            <p className="text-xs text-muted-foreground">
              Get one at: console.cloud.google.com
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Loading Map...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={droneLocation}
        zoom={zoom}
        options={mapOptions}
      >
        {/* Drone/Current Position Marker */}
        <Marker
          position={droneLocation}
          title="Drone Position"
          icon={droneMarkerIcon}
        />

        {/* Detection Markers */}
        {detections.map((detection) => (
          <Marker
            key={detection.id}
            position={{ lat: detection.latitude, lng: detection.longitude }}
            title={detection.label}
            icon={getMarkerIcon(detection.confidence)}
            onClick={() => setSelectedMarker(detection)}
          />
        ))}

        {/* Info Window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="bg-background text-foreground p-3 rounded border border-primary/20 text-xs font-mono space-y-1">
              <div className="font-bold text-primary uppercase">{selectedMarker.label}</div>
              <div>CONFIDENCE: {(selectedMarker.confidence * 100).toFixed(1)}%</div>
              <div>LAT: {selectedMarker.latitude.toFixed(6)}</div>
              <div>LON: {selectedMarker.longitude.toFixed(6)}</div>
              <div className="text-muted-foreground text-[10px]">
                {new Date(selectedMarker.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start gap-4 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="bg-background/90 backdrop-blur-xl p-2 rounded-lg border border-primary/20 shadow-2xl">
              <MapIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-background/90 backdrop-blur-xl px-4 py-2 rounded-lg border border-primary/20 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Operation Sector</span>
                <span className="text-xs font-mono font-bold">ALGERIA // EL OUED B-12</span>
              </div>
            </div>
          </div>
          
          <div className="relative w-64 mt-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search coordinates..." 
              className="pl-10 bg-background/80 backdrop-blur-md border-primary/20 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="flex flex-col bg-background/90 backdrop-blur-xl rounded-lg border border-primary/20 shadow-2xl overflow-hidden">
          <button 
            onClick={() => setZoom(z => Math.min(22, z+1))} 
            className="p-2.5 hover:bg-primary/20 transition-colors border-b border-primary/10"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(1, z-1))} 
            className="p-2.5 hover:bg-primary/20 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-4 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-xl px-4 py-2.5 rounded-lg shadow-2xl border border-primary/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Position Hub</span>
          </div>
          <div className="text-sm font-mono font-bold flex flex-col">
            <span>LAT: {droneLocation.lat.toFixed(4)}</span>
            <span>LON: {droneLocation.lng.toFixed(4)}</span>
          </div>
        </div>
        
        <div className="bg-background/90 backdrop-blur-xl px-4 py-2.5 rounded-lg shadow-2xl border border-primary/20 hidden sm:flex flex-col justify-center">
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Zoom Level</div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-muted rounded-full" />
            <span className="text-[10px] font-mono font-bold">{zoom}</span>
          </div>
        </div>
      </div>

      {/* Detection Counter */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-xl px-4 py-2.5 rounded-lg shadow-2xl border border-primary/20 space-y-1 text-center">
          <div className="text-[10px] font-bold text-accent uppercase tracking-widest">Active Detections</div>
          <div className="text-lg font-bold text-accent">{detections.length}</div>
        </div>
      </div>

      {/* Navigation Compass */}
      <div className="absolute bottom-24 right-6 z-20 pointer-events-none">
        <div className="bg-background/90 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-primary/20 flex items-center justify-center">
          <Compass className="w-8 h-8 text-accent animate-[pulse_2s_infinite]" />
          <div className="absolute -top-2 bg-primary px-1 text-[8px] font-bold text-background rounded">N</div>
        </div>
      </div>
    </Card>
  );
}
