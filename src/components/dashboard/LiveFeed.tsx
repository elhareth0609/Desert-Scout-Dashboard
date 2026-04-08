
"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scan, Eye, Radio } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function LiveFeed() {
  const [detections, setDetections] = useState([
    { id: 1, label: "human trace", confidence: 0.78, x: 64.5, y: 73, w: 8.5, h: 19 },
    { id: 2, label: "human trace", confidence: 0.80, x: 47, y: 77, w: 9.3, h: 16 },
    { id: 3, label: "human trace", confidence: 0.82, x: 27.8, y: 68, w: 11.4, h: 12 },  
    { id: 4, label: "human trace", confidence: 0.75, x: 47.5, y: 61, w: 9.4, h: 10.5 },
    { id: 5, label: "human trace", confidence: 0.79, x: 26.2, y: 52.8, w: 5.5, h: 9 }, 
    { id: 6, label: "human trace", confidence: 0.71, x: 47.8, y: 43.8, w: 4.4, h: 10.5 },
    { id: 7, label: "human trace", confidence: 0.74, x: 16.8, y: 42.8, w: 6.3, h: 7 }, 
    { id: 8, label: "human trace", confidence: 0.71, x: 39, y: 37, w: 5.5, h: 7.5 }, 
  ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDetections((prev) =>
  //       prev.map((d) => ({
  //         ...d,
  //         x: Math.max(0, Math.min(80, d.x + (Math.random() - 0.5) * 2)),
  //         y: Math.max(0, Math.min(80, d.y + (Math.random() - 0.5) * 2)),
  //       }))
  //     );
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const cameraImage = PlaceHolderImages.find((img) => img.id === "detection-before");

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
            <foreignObject x={d.x} y={d.y - 6} width="20" height="6">
              <div className="bg-accent text-background text-[2px] font-bold uppercase whitespace-nowrap">
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
