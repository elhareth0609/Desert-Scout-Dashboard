
"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-headline font-black uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-mono">Effective Date: Avril 28, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-primary">1. Data Sovereignty</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Desert Scout AI respects operational security. All telemetry data and surveillance feeds are encrypted at rest and in transit. Users retain full ownership of their flight logs and detection records.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-primary">2. Information Collection</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect minimal personal data, restricted to account credentials and system performance logs necessary for operational stability. We do not sell user data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold uppercase text-primary">3. Visual Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Video feeds processed by our AI Core are cached locally on the user's GCS. We do not store raw video data on our central servers unless explicitly exported for report generation by the authorized operator.
            </p>
          </section>

          <section className="space-y-4 pt-8 border-t border-border/40">
            <p className="text-xs text-muted-foreground font-mono italic">
              For security-related inquiries, contact command@desertscout.ai
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
