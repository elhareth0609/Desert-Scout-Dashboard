
"use client";

import React from "react";
import Link from "next/link";
import { Shield, Target, Zap, Globe, ArrowRight, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public Header */}
      <header className="h-20 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-background" />
            </div>
            <h1 className="font-headline font-black text-2xl tracking-tighter uppercase">
              Desert Scout <span className="text-accent">OS</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Features</Link>
            <Link href="/about" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">About Us</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-xs h-10">
                  Launch Console <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10 font-bold uppercase tracking-widest text-xs h-10 px-6">
                  Operator Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),0.1),transparent)]" />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                <Activity className="w-3 h-3 animate-pulse" /> AI-Powered Reconnaissance
              </div>
              <h2 className="text-6xl md:text-7xl font-headline font-black uppercase tracking-tighter leading-[0.9]">
                Secure the <span className="text-accent">Sands</span> with Intelligence
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                The next generation of desert surveillance. Real-time AI detection, satellite-grade telemetry, and automated scouting for mission-critical operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login">
                  <Button className="bg-primary text-background font-black uppercase tracking-widest h-14 px-10 text-sm shadow-xl shadow-primary/20 group">
                    Start Mission <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="ghost" className="h-14 px-10 font-bold uppercase tracking-widest text-xs">
                    Explore Platform
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
              <div className="relative z-10 w-full h-full border border-primary/10 rounded-2xl bg-card/30 backdrop-blur-3xl overflow-hidden shadow-2xl rotate-3">
                <img 
                  src="https://picsum.photos/seed/drone-landing/800/800" 
                  alt="Scout Drone" 
                  className="object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                  data-ai-hint="drone desert"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-xl">
                   <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
                      <span>Signal: Locked</span>
                      <span>Sector: B-12</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Core Capabilities</h3>
              <h2 className="text-4xl font-headline font-black uppercase">Tactical Advantage</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "AI Detection",
                  desc: "Neural networks trained for desert environments. Detect humans, camels, and vehicle tracks with 98% accuracy."
                },
                {
                  icon: Globe,
                  title: "Global Link",
                  desc: "Satellite-connected GCS link for remote operations across vast, uninhabited desert expanses."
                },
                {
                  icon: Zap,
                  title: "Live Telemetry",
                  desc: "Sub-second latency flight data streaming directly to your encrypted tactical console."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl border border-primary/10 bg-background/50 hover:border-primary/40 transition-colors group">
                  <feature.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-bold uppercase mb-4">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40 bg-card/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-headline font-black uppercase tracking-tighter">Desert Scout OS</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm uppercase tracking-widest leading-loose">
                Advanced AI infrastructure for modern reconnaissance. Operating in the most demanding environments on Earth.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Company</h5>
              <nav className="flex flex-col gap-2">
                <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground">About Us</Link>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">Terms of Use</Link>
              </nav>
            </div>
            <div className="space-y-4 text-right md:text-right">
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Systems</h5>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">
                v1.0.4-TACTICAL<br />
                EL OUED SECTOR B-12<br />
                EST. 2024
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/20 text-center">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              &copy; 2024 Desert Scout AI Systems. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
