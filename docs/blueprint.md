# **App Name**: Desert Scout Dashboard

## Core Features:

- Live Video Feed with Detections: Stream the live camera feed from the Raspberry Pi with real-time bounding boxes, labels, and confidence scores for detected objects overlaid directly on the video.
- Real-time Flight Telemetry Dashboard: Display essential flight data including GPS coordinates (latitude, longitude), altitude, ground speed, heading, battery level, and current flight time in a clear and continuously updated panel.
- Interactive Flight & Detection Map: Visualize the drone's current position and live flight path on an interactive map. This map will also mark and highlight recorded detection locations using cached tiles of the operating area (El Oued).
- Historical Detection Log Viewer: Present a scrollable and filterable list of all recorded detection events, displaying the detected type, confidence score, precise coordinates, and timestamp for each event.
- AI Log Insight Tool: Offer a generative AI tool to provide summary reports, anomaly detection, or actionable insights based on a customizable subset of historical detection logs, assisting in pattern recognition.
- Live Data Stream Integration: Establish and manage WebSocket connections to the Python Flask backend for receiving and rendering real-time telemetry data and detection updates, ensuring the dashboard reflects current drone status.

## Style Guidelines:

- Color palette is inspired by a desert environment with a focus on a dark, observational theme. Primary interactive color: muted terracotta/sienna (#CA8E77) for warmth and readability. Background color: a deep, subtle reddish-brown charcoal (#2D2725) for a calming and unobtrusive dark scheme. Accent color: a vibrant desert-gold/ochre (#FAD169) for highlights, alerts, and calls to action.
- All text uses 'Inter' (sans-serif) for its modern, neutral, and highly readable characteristics, suitable for displaying data efficiently in a dashboard environment.
- Utilize minimalist line-art icons for status indicators (e.g., battery, signal strength) and simple, clear pictograms to represent detected objects (e.g., camel, vehicle tracks) to maintain a clean, technical aesthetic.
- Employ a responsive two-column layout. The primary viewing area (left) for the live camera feed and interactive map, with a dedicated right sidebar for real-time telemetry, drone status, and the historical detection log. This maximizes visual information display without clutter.
- Incorporate subtle and smooth animations for data updates (e.g., telemetry value changes, new log entries) and interactive elements (e.g., map movements, hover states) to provide a fluid and responsive user experience.