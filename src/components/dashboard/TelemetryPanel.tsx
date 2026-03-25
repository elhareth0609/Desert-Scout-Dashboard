
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navigation, Wind, Thermometer, Battery, MapPin, Gauge } from "lucide-react";

export function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState({
    lat: 33.3675,
    lon: 6.8514,
    alt: 124.5,
    speed: 42.8,
    heading: 184,
    battery: 88,
    voltage: 15.4,
    uptime: "00:14:22",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        lat: prev.lat + (Math.random() - 0.5) * 0.0001,
        lon: prev.lon + (Math.random() - 0.5) * 0.0001,
        alt: Math.max(120, prev.alt + (Math.random() - 0.5) * 0.5),
        speed: Math.max(35, prev.speed + (Math.random() - 0.5) * 1.2),
        heading: (prev.heading + 1) % 360,
        battery: Math.max(0, prev.battery - (Math.random() > 0.9 ? 1 : 0)),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TelemetryItem = ({ icon: Icon, label, value, unit, color = "primary" }: any) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md bg-${color}/10`}>
          <Icon className={`w-4 h-4 text-${color}`} />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-mono font-bold">{value}</span>
        <span className="text-[10px] text-muted-foreground font-mono uppercase">{unit}</span>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/30 backdrop-blur-md border-primary/10 h-full">
      <CardHeader className="pb-2 border-b border-border/10">
        <CardTitle className="text-sm font-headline uppercase tracking-[0.2em] flex items-center justify-between">
          <span>Flight Telemetry</span>
          <span className="text-accent text-[10px] animate-pulse">● SYNCED</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <TelemetryItem icon={MapPin} label="Lat" value={telemetry.lat.toFixed(5)} unit="" />
          <TelemetryItem icon={MapPin} label="Lon" value={telemetry.lon.toFixed(5)} unit="" />
        </div>
        <TelemetryItem icon={Gauge} label="Altitude" value={telemetry.alt.toFixed(1)} unit="m" color="accent" />
        <TelemetryItem icon={Wind} label="Grd Speed" value={telemetry.speed.toFixed(1)} unit="km/h" color="accent" />
        <TelemetryItem icon={Navigation} label="Heading" value={telemetry.heading} unit="deg" />
        <div className="grid grid-cols-2 gap-3">
          <TelemetryItem 
            icon={Battery} 
            label="Battery" 
            value={telemetry.battery} 
            unit="%" 
            color={telemetry.battery < 20 ? "destructive" : "accent"} 
          />
          <TelemetryItem icon={Thermometer} label="Voltage" value={telemetry.voltage} unit="V" />
        </div>
        <div className="mt-4 p-4 border-t border-border/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase">Flight Time</span>
            <span className="text-xl font-mono text-primary font-bold">{telemetry.uptime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
