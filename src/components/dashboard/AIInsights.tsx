
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, Activity, FileText, ChevronRight, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { analyzeDetectionLogs, AnalyzeDetectionLogsOutput } from "@/ai/flows/analyze-detection-logs";

export function AIInsights({ logs }: { logs: any[] }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeDetectionLogsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if AI analysis is disabled for presentations
  const isDisabled = process.env.NEXT_PUBLIC_DISABLE_AI_ANALYSIS === "false";

  const handleAnalyze = async () => {
    if (isDisabled) {
      setError("AI analysis is currently disabled. Enable in environment settings to use.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const formattedLogs = logs.map(l => ({
        detectedType: l.detectedObjectType || "Unknown",
        confidence: l.confidenceScore || 0,
        latitude: l.latitude || 0,
        longitude: l.longitude || 0,
        timestamp: l.timestamp || new Date().toISOString()
      }));

      const output = await analyzeDetectionLogs({
        detectionLogs: formattedLogs,
        analysisRequest: "Identify movements and high-confidence patterns"
      });
      setResult(output);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("AI Analysis failed", error);
      
      // Check if it's a service unavailable error
      if (errorMsg.includes("503") || errorMsg.includes("high demand")) {
        setError("AI service is temporarily unavailable due to high demand. Please try again in a moment.");
      } else if (errorMsg.includes("API key")) {
        setError("Google AI API key is not configured. Please check your .env.local file.");
      } else {
        setError("Failed to analyze logs. Please try again or check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-primary/5 border-primary/20 backdrop-blur-xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-32 h-32 text-primary" />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-headline uppercase tracking-[0.2em] flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-accent" />
          AI Scouting Insights
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error ? (
          <div className="py-6 text-center space-y-4">
            <div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="max-w-[240px] mx-auto">
              <p className="text-xs text-destructive font-medium">
                {error}
              </p>
            </div>
          </div>
        ) : !result ? (
          <div className="py-6 text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
              <Activity className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="max-w-[240px] mx-auto">
              <p className="text-sm text-muted-foreground font-medium">
                Analyze {logs.length} historical logs to discover patterns and environmental anomalies.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <FileText className="w-3 h-3" />
                Summary
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed bg-background/40 p-3 rounded-md border border-border/20">
                {result.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <ChevronRight className="w-3 h-3" />
                Key Patterns
              </h4>
              <ul className="space-y-1">
                {result.patterns.map((p, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground pl-2 border-l border-primary/40">{p}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-destructive flex items-center gap-2">
                <AlertCircleIcon className="w-3 h-3" />
                Anomalies
              </h4>
              <ul className="space-y-1">
                {result.anomalies.map((a, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground pl-2 border-l border-destructive/40">{a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/10">
        <Button 
          onClick={handleAnalyze} 
          disabled={loading || logs.length === 0 || isDisabled}
          className="w-full bg-accent hover:bg-accent/80 text-background font-bold uppercase tracking-widest text-xs h-10 group disabled:opacity-50 disabled:cursor-not-allowed"
          title={isDisabled ? "AI Analysis disabled for presentation mode" : ""}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : error ? (
            <RotateCcw className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
          )}
          {isDisabled ? "AI Disabled" : loading ? "Analyzing..." : error ? "Retry Analysis" : result ? "Re-Analyze Logs" : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function AlertCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
