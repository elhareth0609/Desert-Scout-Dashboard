
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TelemetryPanel } from "@/components/dashboard/TelemetryPanel";
import { MapPanel } from "@/components/dashboard/MapPanel";
import { DetectionLogs, LogEntry } from "@/components/dashboard/DetectionLogs";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { Navbar } from "@/components/dashboard/Navbar";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  // Simulated logs for AI Insights component
  const mockLogs: LogEntry[] = [
    { id: "1", detectedType: "Camel", confidence: 0.94, latitude: 33.3678, longitude: 6.8512, timestamp: "2024-05-20T14:30:00.000Z" },
    { id: "2", detectedType: "Vehicle Tracks", confidence: 0.82, latitude: 33.3682, longitude: 6.8521, timestamp: "2024-05-20T14:25:00.000Z" },
    { id: "3", detectedType: "Human Activity", confidence: 0.76, latitude: 33.3665, longitude: 6.8505, timestamp: "2024-05-20T14:15:00.000Z" },
  ];

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto w-full">
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
