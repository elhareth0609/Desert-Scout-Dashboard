/**
 * Mock system logs matching Raspberry Pi output format
 */

export interface SystemLog {
  id: string;
  timestamp: string;
  category: "System" | "MAVLink" | "LoRa" | "Firebase" | "Detection" | "Error";
  message: string;
  level?: "info" | "error" | "warning" | "success";
}

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  {
    id: "log-1",
    timestamp: "09:26:56 PM",
    category: "System",
    message: "Model loaded — model/best.pt",
    level: "info",
  },
  {
    id: "log-2",
    timestamp: "09:26:57 PM",
    category: "MAVLink",
    message: "Listener started — SpeedyBee F405 v3 on /dev/ttyAMA0 @ 115200",
    level: "info",
  },
  {
    id: "log-3",
    timestamp: "09:26:58 PM",
    category: "LoRa",
    message: "SPI init OK — Version: 0x12 @ 915.0 MHz, TX Power: 23 dBm",
    level: "success",
  },
  {
    id: "log-4",
    timestamp: "09:27:00 PM",
    category: "Firebase",
    message: 'PATCH /camera_status — status: "active", device: "camera_realtime"',
    level: "info",
  },
  {
    id: "log-5",
    timestamp: "09:27:01 PM",
    category: "System",
    message: "rpicam-vid started — 1920×1080 @ 30fps, AWB gains 1.8/1.5",
    level: "info",
  },
  {
    id: "log-6",
    timestamp: "09:27:06 PM",
    category: "System",
    message: "H.264 file ready — records/h264_archive/video_*.h264",
    level: "success",
  },
  {
    id: "log-7",
    timestamp: "09:27:08 PM",
    category: "MAVLink",
    message: "GPS_RAW_INT — lat: 32.123456, lon: 35.654321",
    level: "info",
  },
  {
    id: "log-8",
    timestamp: "09:27:11 PM",
    category: "Detection",
    message: "Frame 30 — camel 87% @ (32.1234, 35.6543)",
    level: "success",
  },
  {
    id: "log-9",
    timestamp: "09:27:11 PM",
    category: "Firebase",
    message: 'PATCH /detections — class: "camel", accuracy: 87%, lat: 32.1234, lon: 35.6543',
    level: "info",
  },
  {
    id: "log-10",
    timestamp: "09:27:12 PM",
    category: "LoRa",
    message: "TX Payload sent — camel (87%) at (32.1234, 35.6543)",
    level: "success",
  },
  {
    id: "log-11",
    timestamp: "09:27:26 PM",
    category: "Detection",
    message: "Frame 60 — no detection",
    level: "info",
  },
  {
    id: "log-12",
    timestamp: "09:27:41 PM",
    category: "Detection",
    message: "Frame 90 — camel 74% @ (32.1235, 35.6544)",
    level: "success",
  },
  {
    id: "log-13",
    timestamp: "09:27:41 PM",
    category: "Firebase",
    message: 'PATCH /detections — class: "camel", accuracy: 74%, lat: 32.1235, lon: 35.6544',
    level: "info",
  },
  {
    id: "log-14",
    timestamp: "09:27:42 PM",
    category: "LoRa",
    message: "TX Payload sent — camel (74%) at (32.1235, 35.6544)",
    level: "success",
  },
  {
    id: "log-15",
    timestamp: "09:27:56 PM",
    category: "Error",
    message: "Firebase connection timeout — will retry next detection",
    level: "error",
  },
  {
    id: "log-16",
    timestamp: "09:27:58 PM",
    category: "MAVLink",
    message: "GPS_RAW_INT — lat: 32.123700, lon: 35.654500",
    level: "info",
  },
  {
    id: "log-17",
    timestamp: "09:28:55 PM",
    category: "Firebase",
    message: 'PATCH /camera_status — status: "inactive" (session end)',
    level: "warning",
  },
  {
    id: "log-18",
    timestamp: "09:28:56 PM",
    category: "System",
    message: "Session complete — 187 frames, 3 detections, rate: 1.6%",
    level: "info",
  },
];

export const getCategoryColor = (
  category: SystemLog["category"]
): "primary" | "accent" | "destructive" | "muted" => {
  switch (category) {
    case "System":
      return "primary";
    case "MAVLink":
      return "accent";
    case "LoRa":
      return "accent";
    case "Firebase":
      return "primary";
    case "Detection":
      return "accent";
    case "Error":
      return "destructive";
    default:
      return "muted";
  }
};
