
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Search, Camera, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export type LogEntry = {
  id: string;
  detectedObjectType: string;
  confidenceScore: number;
  latitude: number;
  longitude: number;
  timestamp: string;
};

interface DetectionLogsProps {
  onSelectLog?: (log: any) => void;
  logs: any[];
  isLoading: boolean;
}

export function DetectionLogs({ onSelectLog, logs, isLoading }: DetectionLogsProps) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLogs = logs.filter(log => 
    (log.detectedObjectType || "").toLowerCase().includes(search.toLowerCase())
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
            {isLoading ? "..." : `${filteredLogs.length} Records`}
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
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {filteredLogs.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-xs font-mono uppercase">
                  No operational data found
                </div>
              )}
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => onSelectLog?.(log)}
                  className="group p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-primary/10">
                        {log.detectedObjectType === "Camel" ? <Camera className="w-3 h-3 text-primary" /> : <AlertTriangle className="w-3 h-3 text-accent" />}
                      </div>
                      <span className="text-sm font-bold text-foreground">{log.detectedObjectType}</span>
                    </div>
                    <Badge variant={log.confidenceScore > 0.85 ? "default" : "secondary"} className="text-[10px] scale-90">
                      {(log.confidenceScore * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
                    <div>LAT: {log.latitude.toFixed(4)}</div>
                    <div>LON: {log.longitude.toFixed(4)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {mounted ? (
                      `${new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${new Date(log.timestamp).toLocaleDateString()}`
                    ) : (
                      "Calculating..."
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
