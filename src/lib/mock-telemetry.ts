/**
 * Mock telemetry data for Raspberry Pi flight telemetry
 */

export interface TelemetryData {
  lat: number;
  lon: number;
  alt: number;
  speed: number;
  heading: number;
  battery: number;
  voltage: number;
  uptime: string;
}

export const DEFAULT_TELEMETRY: TelemetryData = {
  lat: 33.3675,
  lon: 6.8514,
  alt: 124.5,
  speed: 42.8,
  heading: 184,
  battery: 88,
  voltage: 15.4,
  uptime: "00:14:22",
};

export const EMPTY_TELEMETRY: Record<keyof TelemetryData, string> = {
  lat: "-",
  lon: "-",
  alt: "-",
  speed: "-",
  heading: "-",
  battery: "-",
  voltage: "-",
  uptime: "-",
};
