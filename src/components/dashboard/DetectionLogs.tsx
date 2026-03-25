
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Search, Filter, Camera, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

export type LogEntry = {
  id: string;
  detectedType: string;
  confidence: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

const INITIAL_LOGS: LogEntry[] = [
  { id: "1", detectedType: "Camel", confidence: 0.94, latitude: 33.3678, longitude: 6.8512, timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: "2", detectedType: "Vehicle Tracks", confidence: 0.82, latitude: 33.3682, longitude: 6.8521, timestamp: new Date(Date.now() - 450000).toISOString() },
  { id: "3", detectedType: "Human Activity", confidence: 0.76, latitude: 33.3665, longitude: 6.8505, timestamp: new Date(Date.now() - 1200000).toISOString() },
  { id: "4", detectedType: "Wildlife", confidence: 0.89, latitude: 33.3690, longitude: 6.8530, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "5", detectedType: "Camel", confidence: 0.91, latitude: 33.3672, longitude: 6.8518, timestamp: new Date(Date.now() - 7200000).toISOString() },
];

export function DetectionLogs({ onSelectLog }: { onSelectLog?: (log: LogEntry) => void }) {
  const [logs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter(log => 
    log.detectedType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-card/30 backdrop-blur-md border-primary/10 flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-sm font-headline uppercase tracking-[0.2em] flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Detection Logs
          </CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] uppercase">
            {filteredLogs.length} Records
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search type..."
            className="pl-9 bg-background/50 border-border/50 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-3">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                onClick={() => onSelectLog?.(log)}
                className="group p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-primary/10">
                      {log.detectedType === "Camel" ? <Camera className="w-3 h-3 text-primary" /> : <AlertTriangle className="w-3 h-3 text-accent" />}
                    </div>
                    <span className="text-sm font-bold text-foreground">{log.detectedType}</span>
                  </div>
                  <Badge variant={log.confidence > 0.85 ? "default" : "secondary"} className="text-[10px] scale-90">
                    {(log.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
                  <div>LAT: {log.latitude.toFixed(4)}</div>
                  <div>LON: {log.longitude.toFixed(4)}</div>
                </div>
                <div className="mt-2 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                  {new Date(log.timestamp).toLocaleTimeString()} — {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
