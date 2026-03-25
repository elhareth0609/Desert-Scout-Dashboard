
"use client";

import React, { useState } from "react";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TelemetryPanel } from "@/components/dashboard/TelemetryPanel";
import { MapPanel } from "@/components/dashboard/MapPanel";
import { DetectionLogs, LogEntry } from "@/components/dashboard/DetectionLogs";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { Shield, Settings, Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  // Simulated logs for AI Insights component
  const mockLogs: LogEntry[] = [
    { id: "1", detectedType: "Camel", confidence: 0.94, latitude: 33.3678, longitude: 6.8512, timestamp: new Date(Date.now() - 120000).toISOString() },
    { id: "2", detectedType: "Vehicle Tracks", confidence: 0.82, latitude: 33.3682, longitude: 6.8521, timestamp: new Date(Date.now() - 450000).toISOString() },
    { id: "3", detectedType: "Human Activity", confidence: 0.76, latitude: 33.3665, longitude: 6.8505, timestamp: new Date(Date.now() - 1200000).toISOString() },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <h1 className="font-headline font-bold text-xl tracking-tighter uppercase">
              Desert Scout <span className="text-accent">OS</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-widest text-primary">Dashboard</Button>
            <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Operations</Button>
            <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Archive</Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="h-8 w-px bg-border/50 mx-2" />
          <div className="flex items-center gap-3 bg-secondary/30 pl-3 pr-1 py-1 rounded-full border border-border/50">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Operator 01</span>
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-background" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
        
        {/* Left Column: Feeds & Maps */}
        <div className="lg:col-span-8 space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Live Surveillance Feed</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-accent uppercase">Encrypted Stream</span>
              </div>
            </div>
            <LiveFeed />
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Tactical Positioning</h2>
            <MapPanel />
          </section>
        </div>

        {/* Right Column: Telemetry & Logs */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <section className="shrink-0">
            <TelemetryPanel />
          </section>

          <section className="flex-1 min-h-0 flex flex-col gap-6">
            <div className="flex-1 min-h-[400px]">
              <DetectionLogs onSelectLog={setSelectedLog} />
            </div>
            <div className="shrink-0">
              <AIInsights logs={mockLogs} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-10 bg-card border-t border-border/50 px-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>FC Connection: MAVLINK/UART</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>GCS Link: STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>AI CORE: ACTIVE</span>
          </div>
        </div>
        <div>
          EL OUED OPERATIONS HUB // 33° 21' N 6° 52' E
        </div>
      </footer>
    </div>
  );
}
