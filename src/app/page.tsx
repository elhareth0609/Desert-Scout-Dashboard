
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { TelemetryPanel } from "@/components/dashboard/TelemetryPanel";
import { MapPanel } from "@/components/dashboard/MapPanel";
import { DetectionLogs, LogEntry } from "@/components/dashboard/DetectionLogs";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { Navbar } from "@/components/dashboard/Navbar";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // For the dashboard, we'll assume we're looking at the most recent "Current" flight
  // In a real app, this ID would be dynamic or stored in user profile
  const activeFlightId = "FL-CURRENT-001";

  const detectionsRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/flightLogs/${activeFlightId}/detectionEvents`) : null,
    [user, firestore, activeFlightId]
  );

  const detectionsQuery = useMemoFirebase(() => 
    detectionsRef ? query(detectionsRef, orderBy("timestamp", "desc"), limit(10)) : null,
    [detectionsRef]
  );

  const { data: firestoreLogs, isLoading: isLogsLoading } = useCollection<LogEntry>(detectionsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const handleSeedData = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      // 1. Create a Flight Log
      const flightRef = doc(firestore, `users/${user.uid}/flightLogs`, activeFlightId);
      setDocumentNonBlocking(flightRef, {
        id: activeFlightId,
        startTime: new Date().toISOString(),
        status: "ongoing",
        description: "Active surveillance mission in Sector B-12"
      }, { merge: true });

      // 2. Add some Detection Events
      const mockDetections = [
        { detectedObjectType: "Camel", confidenceScore: 0.94, latitude: 33.3678, longitude: 6.8512, timestamp: new Date().toISOString(), altitudeMeters: 120, boundingBox: [100, 100, 200, 200], flightLogId: activeFlightId },
        { detectedObjectType: "Vehicle Tracks", confidenceScore: 0.82, latitude: 33.3682, longitude: 6.8521, timestamp: new Date(Date.now() - 300000).toISOString(), altitudeMeters: 125, boundingBox: [150, 150, 250, 250], flightLogId: activeFlightId },
        { detectedObjectType: "Human Activity", confidenceScore: 0.76, latitude: 33.3665, longitude: 6.8505, timestamp: new Date(Date.now() - 600000).toISOString(), altitudeMeters: 118, boundingBox: [50, 50, 100, 100], flightLogId: activeFlightId },
      ];

      for (const detection of mockDetections) {
        addDocumentNonBlocking(detectionsRef!, detection);
      }
    } finally {
      setTimeout(() => setIsSeeding(false), 1000);
    }
  };

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
        {/* Left Column: Vision and Navigation */}
        <div className="lg:col-span-8 space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Tactical Surveillance Feed</h2>
              <div className="flex items-center gap-4">
                {(!firestoreLogs || firestoreLogs.length === 0) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[9px] uppercase tracking-widest border-primary/30 hover:bg-primary/10"
                    onClick={handleSeedData}
                    disabled={isSeeding}
                  >
                    {isSeeding ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Database className="w-3 h-3 mr-2" />}
                    Seed Tactical Data
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">AES-256 Encrypted</span>
                </div>
              </div>
            </div>
            <LiveFeed />
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Digital Positioning System</h2>
            <MapPanel />
          </section>
        </div>

        {/* Right Column: Intelligence and Telemetry */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full overflow-hidden">
          <div className="shrink-0">
            <TelemetryPanel />
          </div>

          <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <DetectionLogs 
                onSelectLog={setSelectedLog} 
                logs={firestoreLogs || []} 
                isLoading={isLogsLoading} 
              />
            </div>
            <div className="shrink-0">
              <AIInsights logs={firestoreLogs || []} />
            </div>
          </div>
        </div>
      </main>

      <footer className="h-10 bg-card border-t border-border/50 px-6 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Link: MAVLINK/SAT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>AI CORE: NOMINAL</span>
          </div>
        </div>
        <div>
          EL OUED SECTOR B-12 // 33° 21' N 6° 52' E
        </div>
      </footer>
    </div>
  );
}
