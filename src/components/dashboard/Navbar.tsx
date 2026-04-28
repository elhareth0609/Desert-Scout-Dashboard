
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
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
