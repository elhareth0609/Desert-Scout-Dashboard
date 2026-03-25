
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Map as MapIcon, Layers, Maximize, Compass } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function MapPanel() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "desert-aerial");

  return (
    <Card className="relative overflow-hidden bg-neutral-900 aspect-[16/10] border-primary/20 shadow-xl">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="bg-background/80 backdrop-blur-md p-2 rounded-md shadow-lg border border-border/50">
          <MapIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-md shadow-lg border border-border/50 text-[10px] font-mono text-foreground uppercase tracking-wider">
          EL OUED - SECTOR B7
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button className="bg-background/80 backdrop-blur-md p-2 rounded-md shadow-lg border border-border/50 hover:bg-background transition-colors">
          <Layers className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="bg-background/80 backdrop-blur-md p-2 rounded-md shadow-lg border border-border/50 hover:bg-background transition-colors">
          <Maximize className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-background/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-border/50">
          <Compass className="w-6 h-6 text-accent animate-pulse" />
        </div>
      </div>

      {mapImage && (
        <div className="absolute inset-0 grayscale contrast-125 opacity-40">
           <Image
            src={mapImage.imageUrl}
            alt={mapImage.description}
            fill
            className="object-cover"
            data-ai-hint={mapImage.imageHint}
          />
        </div>
      )}

      {/* Mock Map Grid */}
      <div className="absolute inset-0 z-10 grid grid-cols-8 grid-rows-6 opacity-20 pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-primary/50" />
        ))}
      </div>

      {/* Drone Indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent animate-ping" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-2 border-white shadow-2xl" />
          <div className="absolute -top-12 -left-12 w-24 h-24 border-l-2 border-t-2 border-accent/40 rounded-tl-xl" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-background/80 backdrop-blur-md px-3 py-2 rounded-md shadow-lg border border-border/50 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-mono text-muted-foreground">CURRENT POSITION</span>
          </div>
          <div className="text-xs font-mono font-bold text-foreground">33° 22' 03" N / 6° 51' 05" E</div>
        </div>
      </div>
    </Card>
  );
}
