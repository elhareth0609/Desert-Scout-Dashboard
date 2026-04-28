
"use client";

import React from "react";
import Link from "next/link";
import { Shield, Users, Globe, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
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

      <main className="flex-1 max-w-4xl mx-auto py-24 px-6 space-y-16">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-headline font-black uppercase tracking-tight">Our Mission</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Desert Scout AI was founded on a singular principle: bridging the gap between frontier environments and advanced intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4 p-8 rounded-2xl border border-primary/10 bg-card/30">
            <Users className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-xl font-bold uppercase">The Team</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "We are engineers, pilots, and conservationists working together to provide tools that matter where infrastructure doesn't exist."
            </p>
          </div>
          <div className="space-y-4 p-8 rounded-2xl border border-primary/10 bg-card/30">
            <Globe className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold uppercase">Impact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From protecting endangered wildlife to assisting in critical search and rescue, our systems are deployed where the horizon is the only guide.
            </p>
          </div>
        </div>

        <div className="space-y-8 pt-8 border-t border-border/40">
          <h2 className="text-3xl font-headline font-black uppercase">Technology Stack</h2>
          <div className="grid gap-6">
             {[
               { title: "Computer Vision", detail: "Edge-computed neural networks for zero-latency detection." },
               { title: "Mesh Networking", detail: "Proprietary long-range protocols for high-bandwidth data transmission." },
               { title: "Sustainability", detail: "Solar-ready GCS units designed for months of isolated operation." }
             ].map((item, i) => (
               <div key={i} className="flex gap-4 items-start">
                 <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                 <div>
                   <h4 className="font-bold uppercase text-sm">{item.title}</h4>
                   <p className="text-sm text-muted-foreground">{item.detail}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
