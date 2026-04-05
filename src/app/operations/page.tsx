
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/dashboard/Navbar";
import { useUser } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Activity, Wifi, Radio, Cpu, BatteryFull } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OperationsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">Active Operations</h2>
            <p className="text-muted-foreground text-sm">Real-time mission management and drone control status.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Play className="w-4 h-4 mr-2" />
            New Mission
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mission Card 1 */}
          <Card className="bg-card/50 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
               <Badge variant="destructive" className="animate-pulse">Active</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Alpha-01 Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-2 bg-secondary/30 rounded flex items-center gap-2">
                  <Wifi className="w-3 h-3 text-primary" />
                  <span>94% Signal</span>
                </div>
                <div className="p-2 bg-secondary/30 rounded flex items-center gap-2">
                  <BatteryFull className="w-3 h-3 text-accent" />
                  <span>88% Power</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <span>Progress</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-secondary/50 h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[72%]" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-[10px] uppercase font-bold tracking-widest">
                  View Feed
                </Button>
                <Button variant="destructive" size="sm" className="px-3">
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "AI Core", status: "Active", val: "OK" },
                { label: "Datalink", status: "Steady", val: "STABLE" },
                { label: "Sensor Array", status: "Nominal", val: "99%" },
                { label: "Storage", status: "Recording", val: "4.2 TB" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary/10 rounded border border-border/10">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-accent">{item.status}</span>
                    <Badge variant="outline" className="text-[10px] py-0">{item.val}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

           {/* Comms */}
           <Card className="bg-card/50 border-primary/10 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Network Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 h-[180px] overflow-y-auto custom-scrollbar pr-2">
                {[
                  "GCS Link Established",
                  "MAVLink Handshake Complete",
                  "AI Module: Camel Detection initialized",
                  "Telemetry streaming on UDP 14550",
                  "Video Feed secure at AES-256",
                  "Operator 01 Session Active",
                ].map((log, idx) => (
                  <div key={idx} className="text-[9px] font-mono border-l-2 border-primary/30 pl-2 py-1 bg-primary/5">
                    <span className="text-muted-foreground mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
