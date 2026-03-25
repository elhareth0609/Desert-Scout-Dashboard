
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, Eye, Radio } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function LiveFeed() {
  const [detections, setDetections] = useState([
    { id: 1, label: "Camel", confidence: 0.92, x: 20, y: 30, w: 15, h: 20 },
    { id: 2, label: "Vehicle Tracks", confidence: 0.78, x: 55, y: 60, w: 25, h: 10 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) =>
        prev.map((d) => ({
          ...d,
          x: Math.max(0, Math.min(80, d.x + (Math.random() - 0.5) * 2)),
          y: Math.max(0, Math.min(80, d.y + (Math.random() - 0.5) * 2)),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cameraImage = PlaceHolderImages.find((img) => img.id === "drone-camera-view");

  return (
    <Card className="relative overflow-hidden bg-black aspect-video border-primary/20 shadow-2xl">
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
          <Radio className="w-3 h-3" />
          LIVE
        </Badge>
        <Badge variant="secondary" className="bg-black/50 text-white border-none backdrop-blur-sm">
          CAM 01 - RPi4
        </Badge>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] text-accent font-mono">1080P | 30FPS</div>
          <div className="text-[10px] text-white/70 font-mono">SIGNAL: 94%</div>
        </div>
      </div>

      {cameraImage && (
        <Image
          src={cameraImage.imageUrl}
          alt={cameraImage.description}
          fill
          className="object-cover opacity-80"
          data-ai-hint={cameraImage.imageHint}
        />
      )}

      {/* SVG Overlay for bounding boxes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {detections.map((d) => (
          <g key={d.id} style={{ transition: "all 0.5s ease-out" }}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="0.5"
              className="animate-pulse"
            />
            <foreignObject x={d.x} y={d.y - 6} width="30" height="6">
              <div className="bg-accent text-background text-[3px] font-bold px-1 uppercase whitespace-nowrap">
                {d.label} {(d.confidence * 100).toFixed(0)}%
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 z-20">
        <div className="flex gap-4 text-white/50">
          <div className="flex items-center gap-1">
            <Scan className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-tighter">AI Processing</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-accent" />
            <span className="text-xs font-mono uppercase tracking-tighter">Active Tracking</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
