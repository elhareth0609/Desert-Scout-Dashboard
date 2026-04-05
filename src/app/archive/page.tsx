
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/dashboard/Navbar";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileText, Download, Calendar, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collection, query, orderBy } from "firebase/firestore";

export default function ArchivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [search, setSearch] = useState("");

  const flightsRef = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/flightLogs`) : null,
    [user, firestore]
  );

  const flightsQuery = useMemoFirebase(() => 
    flightsRef ? query(flightsRef, orderBy("startTime", "desc")) : null,
    [flightsRef]
  );

  const { data: flights, isLoading: isFlightsLoading } = useCollection<any>(flightsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const filteredFlights = (flights || []).filter(f => 
    (f.id || "").toLowerCase().includes(search.toLowerCase()) || 
    (f.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isUserLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-headline font-bold uppercase tracking-tight">Mission Archive</h2>
            <p className="text-muted-foreground text-sm">Review historical flight data and detection reports.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </header>

        <Card className="bg-card/30 border-primary/10 backdrop-blur-md">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search flight ID or area..." 
                  className="pl-10 bg-background/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">
                  <Calendar className="w-4 h-4 mr-2" /> Range
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border border-border/50 overflow-hidden">
              {isFlightsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-secondary/20">
                    <TableRow>
                      <TableHead className="font-headline text-[10px] uppercase tracking-widest">Flight ID</TableHead>
                      <TableHead className="font-headline text-[10px] uppercase tracking-widest">Date</TableHead>
                      <TableHead className="font-headline text-[10px] uppercase tracking-widest">Description</TableHead>
                      <TableHead className="font-headline text-[10px] uppercase tracking-widest">Status</TableHead>
                      <TableHead className="font-headline text-[10px] uppercase tracking-widest text-right">Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlights.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground font-mono uppercase text-xs">
                          Archive vault empty
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredFlights.map((flight) => (
                      <TableRow key={flight.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-mono text-xs font-bold">{flight.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(flight.startTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs font-medium">{flight.description || "N/A"}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`text-[9px] uppercase tracking-tighter ${
                              flight.status === 'completed' || flight.status === 'ongoing' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                          >
                            {flight.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="w-4 h-4 text-primary" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
