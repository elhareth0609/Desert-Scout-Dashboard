
"use client";

import React from "react";
import Link from "next/link";
import { Shield, Target, Zap, Globe, ArrowRight, ChevronRight, Activity, Mail, Phone, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const { user } = useUser();
  const beforeImg = PlaceHolderImages.find(img => img.id === "detection-before");
  const afterImg = PlaceHolderImages.find(img => img.id === "detection-after");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
            <Link href="#vision" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">AI Vision</Link>
            <Link href="#contact" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Contact</Link>
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
        {/* Hero */}
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
                  src="./images/desert-drone.png" 
                  alt="Scout Drone" 
                  className="w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
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


        {/* AI Comparison Section */}
        <section id="vision" className="py-24 bg-card/30 border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Neural Analysis</h3>
              <h2 className="text-4xl font-headline font-black uppercase">Edge-AI Detection Power</h2>
              <p className="text-muted-foreground">Transform raw desert footage into actionable tactical intelligence instantly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Search className="w-4 h-4" /> Raw Input Footage
                </h4>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50">
                  <Image src={beforeImg?.imageUrl || ""} alt="Before AI" fill className="object-cover" data-ai-hint="desert raw" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-mono">SIGNAL: ANALOG_RAW</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                  <Target className="w-4 h-4" /> AI Enhanced Output
                </h4>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-accent/50">
                  <Image src={afterImg?.imageUrl || ""} alt="After AI" fill className="object-cover" data-ai-hint="desert detection" />
                  <div className="absolute inset-0 border-2 border-accent/20" />
                  <div className="absolute top-4 left-4 bg-accent text-background px-2 py-1 rounded text-[10px] font-bold">MODE: AI_ENABLED</div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-[10px] font-mono text-accent uppercase">Detections: 11</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Precision", desc: "98% accuracy in detecting movement patterns across sand dunes." },
              { icon: Globe, title: "Global Sync", desc: "Instant data transmission from remote desert locations." },
              { icon: Zap, title: "Edge Core", desc: "Low-latency processing optimized for tactical hardware." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-primary/10 bg-background/50">
                <f.icon className="w-10 h-10 text-primary mb-6" />
                <h4 className="text-xl font-bold uppercase mb-2">{f.title}</h4>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information Section */}
        <section id="contact" className="py-24 bg-primary/5 border-t border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-headline font-black uppercase tracking-tight">Contact HQ</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our operational headquarters are located in El Oued, Algeria. For tactical support or business inquiries, reach out through our encrypted channels.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Operational Email</p>
                      <p className="font-bold">desertscoutos@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Secure Line</p>
                      <p className="font-bold">0796050416</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">HQ Location</p>
                      <p className="font-bold">Guemar, El Oued - Algeria</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.123456789!2d6.851686!3d33.367589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDIyJzAzLjMiTiA2wrA1MScwNi4xIkU!5e0!3m2!1sen!2sdz!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Base Established: El Oued</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/40 bg-card/20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-headline font-black uppercase tracking-tighter">Desert Scout OS</span>
             </div>
             <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
               &copy; 2024 Desert Scout AI Systems. V-TACTICAL 1.0. Guemar, Algeria.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
