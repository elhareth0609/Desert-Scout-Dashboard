"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-xl px-6 py-4 mt-auto">
      <div className="flex items-center justify-center gap-6">
        <Link 
          href="/about" 
          className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          About
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <Link 
          href="/terms" 
          className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Terms
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <Link 
          href="/privacy" 
          className="text-xs uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
}
