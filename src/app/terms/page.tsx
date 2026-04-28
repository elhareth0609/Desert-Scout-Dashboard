
"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-20 border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-headline font-black uppercase tracking-tighter">Desert Scout OS</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-xs">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Base
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto py-24 px-6 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-black uppercase tracking-tight">Terms of Use</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono">Revision: 2.1-ALPHA</p>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-xl flex gap-4">
          <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
          <p className="text-xs text-destructive-foreground leading-relaxed uppercase font-bold tracking-tight">
            Operating drones in restricted airspace or without local authorization is a violation of international regulations and these terms.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-accent">1. Operator Responsibility</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users are solely responsible for ensuring flight operations comply with local and international aviation laws. Desert Scout OS is a tool for data visualization and does not grant legal flight authority.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-accent">2. System Limitations</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI detections are probabilistic. Confidence scores are estimates. Operators must visually verify all critical detections before taking tactical or logistical action.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-accent">3. Prohibited Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may not use the Desert Scout OS for unauthorized surveillance of private property, harassment of wildlife in protected zones, or any activity that violates human rights.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
