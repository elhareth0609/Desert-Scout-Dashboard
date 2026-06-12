
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Navigation, Wind, Thermometer, Battery, MapPin, Gauge, ToggleLeft, ToggleRight } from "lucide-react";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { TelemetryData, DEFAULT_TELEMETRY, EMPTY_TELEMETRY } from "@/lib/mock-telemetry";

export function TelemetryPanel() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [useRealData, setUseRealData] = useState(false);
  const [simulatedTelemetry, setSimulatedTelemetry] = useState<TelemetryData>(DEFAULT_TELEMETRY);

  const activeFlightId = "FL-CURRENT-001";

  // Firebase real-time telemetry listener
  const telemetryRef = useMemoFirebase(() =>
    user && firestore ? doc(firestore, `users/${user.uid}/flightLogs`, activeFlightId) : null,
    [user, firestore]
  );

  const { data: firebaseTelemetry, isLoading: isTelemetryLoading } = useDoc<TelemetryData>(telemetryRef);

  // Simulated telemetry updates
  useEffect(() => {
    if (useRealData) return; // Don't simulate when using real data

    const interval = setInterval(() => {
      setSimulatedTelemetry((prev) => ({
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
  }, [useRealData]);

  // Determine which telemetry to display
  const activeTelemetry = useRealData
    ? (firebaseTelemetry as any) || EMPTY_TELEMETRY
    : simulatedTelemetry;

  const TelemetryItem = ({ icon: Icon, label, value, unit, color = "primary" }: any) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md bg-${color}/10`}>
          <Icon className={`w-4 h-4 text-${color}`} />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-mono font-bold">
          {value === "-" ? "-" : typeof value === "number" ? value.toFixed(value < 100 ? 1 : 0) : value}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono uppercase">{unit}</span>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/30 backdrop-blur-md border-primary/10 h-full">
      <CardHeader className="pb-2 border-b border-border/10">
        <CardTitle className="text-sm font-headline uppercase tracking-[0.2em] flex items-center justify-between">
          <span>Flight Telemetry</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseRealData(!useRealData)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
              title={useRealData ? "Switch to Simulated Data" : "Switch to Real Data"}
            >
              {useRealData ? (
                <ToggleRight className="w-3 h-3 text-accent" />
              ) : (
                <ToggleLeft className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-[9px] font-mono uppercase">{useRealData ? "REAL" : "SIM"}</span>
            </button>
            <span className={`text-[10px] animate-pulse ${useRealData ? "text-accent" : "text-primary"}`}>
              ● {useRealData ? "FIREBASE" : "SYNCED"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <TelemetryItem 
            icon={MapPin} 
            label="Lat" 
            value={typeof activeTelemetry.lat === "string" ? activeTelemetry.lat : (activeTelemetry.lat?.toFixed?.(5) ?? "-")} 
            unit="" 
          />
          <TelemetryItem 
            icon={MapPin} 
            label="Lon" 
            value={typeof activeTelemetry.lon === "string" ? activeTelemetry.lon : (activeTelemetry.lon?.toFixed?.(5) ?? "-")} 
            unit="" 
          />
        </div>
        <TelemetryItem 
          icon={Gauge} 
          label="Altitude" 
          value={typeof activeTelemetry.alt === "string" ? activeTelemetry.alt : (activeTelemetry.alt?.toFixed?.(1) ?? "-")} 
          unit="m" 
          color="accent" 
        />
        <TelemetryItem 
          icon={Wind} 
          label="Grd Speed" 
          value={typeof activeTelemetry.speed === "string" ? activeTelemetry.speed : (activeTelemetry.speed?.toFixed?.(1) ?? "-")} 
          unit="km/h" 
          color="accent" 
        />
        <TelemetryItem 
          icon={Navigation} 
          label="Heading" 
          value={typeof activeTelemetry.heading === "string" ? activeTelemetry.heading : (activeTelemetry.heading ?? "-")} 
          unit="deg" 
        />
        <div className="grid grid-cols-2 gap-3">
          <TelemetryItem 
            icon={Battery} 
            label="Battery" 
            value={typeof activeTelemetry.battery === "string" ? activeTelemetry.battery : (activeTelemetry.battery ?? "-")}
            unit="%" 
            color={typeof activeTelemetry.battery === "string" ? "primary" : (activeTelemetry.battery ?? 100) < 20 ? "destructive" : "accent"} 
          />
          <TelemetryItem 
            icon={Thermometer} 
            label="Voltage" 
            value={typeof activeTelemetry.voltage === "string" ? activeTelemetry.voltage : (activeTelemetry.voltage?.toFixed?.(1) ?? "-")}
            unit="V" 
          />
        </div>
        <div className="mt-4 p-4 border-t border-border/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase">Flight Time</span>
            <span className="text-xl font-mono text-primary font-bold">
              {typeof activeTelemetry?.uptime === "string" ? activeTelemetry.uptime : "-"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
