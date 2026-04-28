
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/dashboard/Navbar";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, FileText, Download, Calendar, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collection, query, orderBy } from "firebase/firestore";

export default function ArchivePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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

  const filteredFlights = (flights || []).filter(f => {
    // Search filter
    const searchMatch = (f.id || "").toLowerCase().includes(search.toLowerCase()) || 
      (f.description || "").toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === "all" || f.status === statusFilter;
    
    // Date range filter
    const flightDate = new Date(f.startTime);
    let dateMatch = true;
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateMatch = dateMatch && flightDate >= start;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && flightDate <= end;
    }
    
    return searchMatch && statusMatch && dateMatch;
  });

  const exportCSV = () => {
    if (filteredFlights.length === 0) {
      alert("No flights to export");
      return;
    }

    const headers = ["Flight ID", "Date", "Description", "Status", "Start Time"];
    const rows = filteredFlights.map(f => [
      f.id || "",
      new Date(f.startTime).toLocaleDateString(),
      f.description || "N/A",
      f.status || "N/A",
      new Date(f.startTime).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `flight-archive-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setShowFilter(false);
    setShowDateRange(false);
  };

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
             <Button 
              variant="outline" 
              size="sm"
              onClick={exportCSV}
             >
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
              <div className="flex items-center gap-2 relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs uppercase tracking-widest"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>

                {showFilter && (
                  <div className="absolute left-0 top-10 bg-card border border-border/50 rounded-lg p-4 shadow-lg z-40 w-56">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest">Filter by Status</h4>
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={() => setShowFilter(false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-background/50 border-border/50 text-xs">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs uppercase tracking-widest"
                  onClick={() => setShowDateRange(!showDateRange)}
                >
                  <Calendar className="w-4 h-4 mr-2" /> Range
                </Button>

                {showDateRange && (
                  <div className="absolute right-0 top-10 bg-card border border-border/50 rounded-lg p-4 shadow-lg z-40 w-64">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest">Date Range</h4>
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="w-5 h-5"
                        onClick={() => setShowDateRange(false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-background/50 border-border/50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-background/50 border-border/50 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(statusFilter !== "all" || startDate || endDate || search) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs uppercase tracking-widest ml-2"
                    onClick={clearFilters}
                  >
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
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
