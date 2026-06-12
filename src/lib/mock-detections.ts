/**
 * Mock detection data matching Raspberry Pi YOLO model output
 * Used when Firebase data is not available
 */

import { LogEntry } from "@/components/dashboard/DetectionLogs";

const DETECTION_TYPES = ["Camel", "Vehicle Tracks", "Human Activity", "Equipment", "Structure"];

const REAL_COORDINATES = [
  { lat: 33.3678, lon: 6.8512, name: "Sector B-12" },
  { lat: 33.3682, lon: 6.8521, name: "Eastern Ridge" },
  { lat: 33.3665, lon: 6.8505, name: "Central Valley" },
  { lat: 33.3690, lon: 6.8530, name: "Northern Zone" },
  { lat: 33.3655, lon: 6.8495, name: "Southern Pass" },
];

export function generateMockDetection(index: number = 0): LogEntry {
  const types = DETECTION_TYPES;
  const locations = REAL_COORDINATES;
  
  const typeIndex = index % types.length;
  const locationIndex = Math.floor(index / types.length) % locations.length;
  
  const type = types[typeIndex];
  const location = locations[locationIndex];
  
  // Realistic confidence scores based on detection type
  const confidenceByType: Record<string, number> = {
    "Camel": 0.92 + Math.random() * 0.07,
    "Vehicle Tracks": 0.85 + Math.random() * 0.12,
    "Human Activity": 0.78 + Math.random() * 0.15,
    "Equipment": 0.88 + Math.random() * 0.09,
    "Structure": 0.91 + Math.random() * 0.08,
  };
  
  const timeOffset = index * 5 * 60 * 1000; // 5 minutes between detections
  
  return {
    id: `mock-${Date.now()}-${index}`,
    detectedObjectType: type,
    confidenceScore: confidenceByType[type] || 0.85,
    latitude: location.lat + (Math.random() - 0.5) * 0.01,
    longitude: location.lon + (Math.random() - 0.5) * 0.01,
    timestamp: new Date(Date.now() - timeOffset).toISOString(),
  };
}

export function generateMockDetectionBatch(count: number = 5): LogEntry[] {
  return Array.from({ length: count }, (_, i) => generateMockDetection(i));
}

export const NO_DATA_MESSAGE = "Awaiting detection feed from Raspberry Pi...";

export const SAMPLE_DETECTIONS: LogEntry[] = [
  {
    id: "sample-1",
    detectedObjectType: "Camel",
    confidenceScore: 0.94,
    latitude: 33.3678,
    longitude: 6.8512,
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
  },
  {
    id: "sample-2",
    detectedObjectType: "Vehicle Tracks",
    confidenceScore: 0.82,
    latitude: 33.3682,
    longitude: 6.8521,
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
  },
  {
    id: "sample-3",
    detectedObjectType: "Human Activity",
    confidenceScore: 0.76,
    latitude: 33.3665,
    longitude: 6.8505,
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
  },
  {
    id: "sample-4",
    detectedObjectType: "Equipment",
    confidenceScore: 0.88,
    latitude: 33.3690,
    longitude: 6.8530,
    timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
  },
  {
    id: "sample-5",
    detectedObjectType: "Camel",
    confidenceScore: 0.91,
    latitude: 33.3655,
    longitude: 6.8495,
    timestamp: new Date(Date.now() - 1500000).toISOString(), // 25 min ago
  },
];
