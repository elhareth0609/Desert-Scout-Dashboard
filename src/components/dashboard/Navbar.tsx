
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Bell, Settings, User, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: "Camel",
      confidence: 94,
      lat: 33.3678,
      lon: 6.8512,
      timestamp: "12:24 AM — 4/6/2026",
    },
    {
      id: 2,
      title: "Vehicle Tracks",
      confidence: 82,
      lat: 33.3682,
      lon: 6.8521,
      timestamp: "12:19 AM — 4/6/2026",
    },
    {
      id: 3,
      title: "Human Activity",
      confidence: 76,
      lat: 33.3665,
      lon: 6.8505,
      timestamp: "12:14 AM — 4/6/2026",
    },
  ];

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="w-5 h-5 text-background" />
          </div>
          <h1 className="font-headline font-bold text-xl tracking-tighter uppercase">
            Desert Scout <span className="text-accent">OS</span>
          </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-8">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs uppercase font-bold tracking-widest ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Dashboard
            </Button>
          </Link>
          <Link href="/operations">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs uppercase font-bold tracking-widest ${pathname === '/operations' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Operations
            </Button>
          </Link>
          <Link href="/archive">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs uppercase font-bold tracking-widest ${pathname === '/archive' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Archive
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>
          
          {notificationsOpen && (
            <div className="absolute right-0 top-14 w-96 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-widest">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className="p-4 border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer last:border-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{notification.title}</h4>
                      <span className="text-xs font-bold px-2 py-1 bg-primary/20 text-primary rounded">
                        {notification.confidence}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 mb-2">
                      <div>LAT: {notification.lat}</div>
                      <div>LON: {notification.lon}</div>
                    </div>
                    <div className="text-xs text-muted-foreground/70">{notification.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button> */}
        <div className="h-8 w-px bg-border/50 mx-2" />
        <div className="flex items-center gap-3 bg-secondary/30 pl-3 pr-1 py-1 rounded-full border border-border/50">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {user?.email?.split('@')[0] || "Operator"}
          </span>
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-background" />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign Out">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
