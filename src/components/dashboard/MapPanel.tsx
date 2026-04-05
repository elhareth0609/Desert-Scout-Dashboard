
"use client";

import React, { useState, useEffect } from "react";
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
  MapPin
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MapPanel() {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(12);
  const mapImage = PlaceHolderImages.find((img) => img.id === "tactical-map-base");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="aspect-[16/10] bg-neutral-900 rounded-lg animate-pulse" />;

  return (
    <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-2xl group">
      {/* Map Background */}
      {mapImage && (
        <div className="absolute inset-0 transition-transform duration-1000 ease-out scale-105 group-hover:scale-100">
           <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            className="object-cover opacity-60 contrast-125 saturate-50 brightness-75"
            data-ai-hint={mapImage.imageHint}
          />
          {/* Tactical Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
        </div>
      )}

      {/* Interface Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Digital Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-10">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-primary/30" />
          ))}
        </div>
        
        {/* Scan Line Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/10 animate-[scan_4s_linear_infinite]" />
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
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

        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <div className="flex flex-col bg-background/90 backdrop-blur-xl rounded-lg border border-primary/20 shadow-2xl overflow-hidden">
          <button onClick={() => setZoom(z => Math.min(20, z+1))} className="p-2.5 hover:bg-primary/20 transition-colors border-b border-primary/10">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(1, z-1))} className="p-2.5 hover:bg-primary/20 transition-colors">
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/10">
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Drone Indicator & Flight Path */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          {/* Compass Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-primary/5 rounded-full" />
          
          {/* Drone Icon */}
          <div className="relative z-30">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 animate-pulse flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-primary opacity-50" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-accent rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,184,0,0.8)]" />
            </div>
          </div>

          {/* Detections Markers */}
          <div className="absolute -top-12 -left-20 group/marker cursor-help">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
            <div className="hidden group-hover:block absolute top-4 left-4 bg-background/90 backdrop-blur-md p-2 rounded border border-red-500/50 text-[8px] font-mono whitespace-nowrap">
              <div className="text-red-400 font-bold uppercase">Target: CAMEL_04</div>
              <div>CONF: 94.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Compass */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="bg-background/90 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-primary/20 flex items-center justify-center">
          <Compass className="w-8 h-8 text-accent animate-[pulse_2s_infinite]" />
          <div className="absolute -top-2 bg-primary px-1 text-[8px] font-bold text-background rounded">N</div>
        </div>
      </div>

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex gap-4">
        <div className="bg-background/90 backdrop-blur-xl px-4 py-2.5 rounded-lg shadow-2xl border border-primary/20 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Position Hub</span>
          </div>
          <div className="text-sm font-mono font-bold flex flex-col">
            <span>LAT: 33° 22' 03" N</span>
            <span>LON: 06° 51' 05" E</span>
          </div>
        </div>
        
        <div className="bg-background/90 backdrop-blur-xl px-4 py-2.5 rounded-lg shadow-2xl border border-primary/20 hidden sm:flex flex-col justify-center">
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Scale</div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full w-1/2" />
            </div>
            <span className="text-[10px] font-mono font-bold">500m</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </Card>
  );
}
