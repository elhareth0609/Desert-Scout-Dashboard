#!/usr/bin/env python3
"""
Real-time video recording with YOLO detection
Records H.264 and processes frames in real-time with detection
"""

from ultralytics import YOLO
import subprocess
import cv2
import numpy as np
import os
import sys
from datetime import datetime
import requests
import json
import threading
import time

# Disable display if running headless (no X11 display)
if os.environ.get('DISPLAY') is None:
    os.environ['QT_QPA_PLATFORM'] = 'offscreen'
    cv2.ocl.setUseOpenCL(False)

# Try to import LoRa library
try:
    import spidev
    SPIDEV_AVAILABLE = True
except ImportError:
    print("[WARNING] spidev not available")
    SPIDEV_AVAILABLE = False

# Try to import MAVLink for SpeedyBee F405 v3 FC
try:
    import serial
    from pymavlink.dialects.v10 import ardupilotmega as mavlink
    MAVLINK_AVAILABLE = True
except ImportError:
    print("[WARNING] MAVLink not available. Install: pip3 install pymavlink pyserial")
    MAVLINK_AVAILABLE = False

# Configuration
MODEL_PATH = "model/best.pt"
RECORDS_DIR = "records"
RESULTS_DIR = os.path.join(RECORDS_DIR, "results")
H264_DIR = os.path.join(RECORDS_DIR, "h264_archive")
LOG_FILE = os.path.join(RECORDS_DIR, "camera_status.log")

# Firebase Configuration
FIREBASE_PROJECT_ID = "studio-3648231506-d69a8-default-rtdb"
FIREBASE_API_KEY = "AIzaSyCVSr-6jG_680t9TyKTamOWO5DbsQjvZFM"
FIREBASE_DB_URL = f"https://{FIREBASE_PROJECT_ID}.firebaseio.com"
VIDEO_DURATION = 120000  # 2 minutes in milliseconds

# LoRa Configuration
LORA_FREQ_MHZ = 915.0  # Frequency in MHz (adjust for your region: 433, 868, 915)
LORA_CS_PIN = 8        # GPIO8 (CE0) - NSS/Chip Select
LORA_RESET_PIN = 25    # GPIO25 - RESET
LORA_DIO0_PIN = 24     # GPIO24 - DIO0 for interrupt
LORA_RX_TIMEOUT = 2.0  # Timeout in seconds
LORA_TX_POWER = 23     # dBm (max 23)

# SpeedyBee F405 v3 FC MAVLink Configuration
MAVLINK_PORT = "/dev/ttyAMA0"  # UART port for FC
MAVLINK_BAUD = 115200         # Baud rate for SpeedyBee FC

# Global variables
current_gps_location = {"lat": 0.0, "lon": 0.0}
gps_lock = threading.Lock()
lora_module = None
mavlink_serial = None

# Create directories
os.makedirs(H264_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# Logging function
def log_detection(message):
    """Write detection to log file"""
    with open(LOG_FILE, 'a') as f:
        f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")

# MAVLink GPS Thread Function
def mavlink_listener_thread():
    """Background thread to read GPS data from SpeedyBee F405 v3 FC via MAVLink"""
    global mavlink_serial
    
    if not MAVLINK_AVAILABLE:
        return
    
    while True:
        try:
            # Open serial connection to FC
            mavlink_serial = serial.Serial(MAVLINK_PORT, MAVLINK_BAUD, timeout=1)
            mav = mavlink.MAVLink(mavlink_serial)
            
            log_detection("MAVLink connected to SpeedyBee F405 v3 FC")
            
            while True:
                # Try to receive MAVLink messages
                msg = mav.recv_match(blocking=False)
                
                if msg and msg.get_type() == 'GPS_RAW_INT':
                    # Parse GPS message
                    lat = msg.lat / 1e7  # Convert from raw to degrees
                    lon = msg.lon / 1e7
                    
                    with gps_lock:
                        current_gps_location["lat"] = lat
                        current_gps_location["lon"] = lon
                    
                    log_detection(f"MAVLink GPS Update: {lat:.6f}, {lon:.6f}")
                
                time.sleep(0.1)  # Prevent busy waiting
        
        except FileNotFoundError:
            log_detection(f"MAVLink port not found: {MAVLINK_PORT}")
            time.sleep(5)
        except Exception as e:
            log_detection(f"MAVLink connection error: {e}")
            if mavlink_serial:
                try:
                    mavlink_serial.close()
                except:
                    pass
            time.sleep(5)

# LoRa Initialization (using direct SPI)
def init_lora():
    """Initialize LoRa module using direct SPI"""
    global lora_module
    
    if not SPIDEV_AVAILABLE:
        log_detection("spidev not available")
        return False
    
    try:
        import RPi.GPIO as GPIO
        
        # Setup GPIO for reset
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(LORA_RESET_PIN, GPIO.OUT)
        
        # Proper reset sequence
        GPIO.output(LORA_RESET_PIN, GPIO.LOW)
        time.sleep(0.01)
        GPIO.output(LORA_RESET_PIN, GPIO.HIGH)
        time.sleep(0.01)
        
        # Open SPI
        lora_module = spidev.SpiDev()
        lora_module.open(0, 0)
        lora_module.max_speed_hz = 500000
        
        # Read version register to verify
        resp = lora_module.xfer2([0x42 & 0x7F, 0x00])
        version = resp[1]
        
        if version == 0x12:  # RFM9x version
            log_detection(f"LoRa initialized (Version: 0x{version:02X})")
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] LoRa initialized (Version: 0x{version:02X})")
            return True
        else:
            log_detection(f"Unexpected LoRa version: 0x{version:02X}")
            print(f"Unexpected LoRa version: 0x{version:02X}")
            return False
            
    except Exception as e:
        log_detection(f"LoRa initialization failed: {e}")
        print(f"LoRa init error: {e}")
        return False

# Send detection data via LoRa
def send_via_lora(frame_num, label, confidence, lat, lon):
    """Send detection data via LoRa"""
    if not lora_module:
        return False
    
    try:
        # Create JSON payload
        payload = json.dumps({
            "type": "detection",
            "frame": frame_num,
            "class": label,
            "accuracy": confidence,
            "lat": lat,
            "lon": lon,
            "timestamp": datetime.now().isoformat()
        })
        
        # LoRa transmission
        lora_module.send(payload.encode())
        log_detection(f"LoRa TX: {label} ({confidence}%) at ({lat:.4f}, {lon:.4f})")
        return True
    except Exception as e:
        log_detection(f"LoRa TX error: {e}")
        return False

# Firebase status function
def send_status_to_firebase(status):
    """Send camera status to Firebase"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        json_payload = {
            "status": status,
            "timestamp": timestamp,
            "device": "camera_realtime",
            "mode": "detection"
        }
        response = requests.patch(
            f"{FIREBASE_DB_URL}/camera_status.json?key={FIREBASE_API_KEY}",
            json=json_payload,
            timeout=5
        )
        if response.status_code == 200:
            log_detection(f"Firebase status '{status}' sent successfully")
            print(f"[{timestamp}] ✓ Firebase status '{status}' sent")
        else:
            log_detection(f"Firebase API Error (HTTP {response.status_code}): {response.text}")
            print(f"[{timestamp}] Firebase error: HTTP {response.status_code}")
    except requests.exceptions.RequestException as e:
        log_detection(f"Firebase connection error: {e}")
        print(f"[{timestamp}] Firebase connection error (will retry)")
    except Exception as e:
        log_detection(f"Firebase error: {e}")
        print(f"[{timestamp}] Firebase error: {e}")

# Send detection data to Firebase and/or LoRa
def send_detection_data(frame_num, label, confidence, lat, lon):
    """Send detection data to Firebase, LoRa is optional"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    firebase_sent = False
    
    try:
        # Try Firebase first
        detection_payload = {
            "frame": frame_num,
            "class": label,
            "accuracy": float(confidence),
            "latitude": float(lat),
            "longitude": float(lon),
            "timestamp": timestamp
        }
        
        response = requests.patch(
            f"{FIREBASE_DB_URL}/detections.json?key={FIREBASE_API_KEY}",
            json=detection_payload,
            timeout=5
        )
        
        if response.status_code == 200:
            firebase_sent = True
            log_detection(f"Detection sent to Firebase: {label} ({confidence}%) at ({lat:.4f}, {lon:.4f})")
    except requests.exceptions.RequestException:
        log_detection(f"Firebase connection failed for detection: {label}")
    except Exception as e:
        log_detection(f"Firebase detection error: {e}")
    
    # Note: LoRa transmission would require more complex register operations
    # For now, LoRa is initialized as a status indicator only

# Load YOLO model
try:
    model = YOLO(MODEL_PATH)
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Model loaded successfully")
    log_detection("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    log_detection(f"ERROR: Model loading failed - {e}")
    sys.exit(1)

# Generate timestamp after model loads
TIMESTAMP = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
H264_FILE = os.path.join(H264_DIR, f"video_{TIMESTAMP}.h264")
OUTPUT_FILE = os.path.join(RESULTS_DIR, f"video_{TIMESTAMP}_detected.mp4")
RECORDS_FILE = os.path.join(RECORDS_DIR, f"video_{TIMESTAMP}.mp4")

print(f"[{TIMESTAMP}] Starting real-time recording with detection...")
print(f"[{TIMESTAMP}] H.264 output: {H264_FILE}")
print(f"[{TIMESTAMP}] Detected output: {OUTPUT_FILE}")

# Initialize LoRa
if SPIDEV_AVAILABLE:
    if init_lora():
        print(f"[{TIMESTAMP}] LoRa module ready")
    else:
        print("[WARNING] LoRa module initialization failed")
else:
    print("[WARNING] spidev unavailable - will use Firebase only")

# Start MAVLink GPS listener thread for SpeedyBee F405 v3 FC
if MAVLINK_AVAILABLE:
    mavlink_thread = threading.Thread(target=mavlink_listener_thread, daemon=True)
    mavlink_thread.start()
    print(f"[{TIMESTAMP}] MAVLink listener started (SpeedyBee F405 v3)")
else:
    print("[WARNING] MAVLink unavailable - location will be 0.0, 0.0")

# Send active status to Firebase
log_detection("="*60)
log_detection("Starting recording and detection")
send_status_to_firebase("active")

# Start rpicam-vid process to capture H.264
camera_process = subprocess.Popen(
    [
        "rpicam-vid",
        "-o", H264_FILE,
        "-t", str(VIDEO_DURATION),
        "--width", "1920",
        "--height", "1080",
        "--framerate", "30",
        "--awbgains", "1.8,1.5",
        "--nopreview"
    ],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Camera recording started...")

# Give time for H.264 file to accumulate frames
import time
time.sleep(5)

log_detection("="*60)
log_detection("Recording and detection started")
log_detection("="*60)

# Setup video writer for detected output
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = None
frame_count = 0
detection_count = 0

print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting frame processing...")

# Wait for H.264 file to be ready with proper frames
# With retries - the file might exist but not have frames yet
max_retries = 10
retry_count = 0
cap = None

while retry_count < max_retries and cap is None:
    try:
        cap = cv2.VideoCapture(H264_FILE)
        if cap.isOpened():
            # Test if we can read at least one frame
            ret, test_frame = cap.read()
            if ret and test_frame is not None:
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] H.264 file ready with frames")
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reset to start
                break
            else:
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] H.264 file exists but no frames yet (retry {retry_count+1}/{max_retries})")
                cap.release()
                cap = None
                time.sleep(1)
                retry_count += 1
        else:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Cannot open H.264 file yet (retry {retry_count+1}/{max_retries})")
            time.sleep(1)
            retry_count += 1
    except Exception as e:
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Error opening file (retry {retry_count+1}/{max_retries}): {e}")
        time.sleep(1)
        retry_count += 1

if cap is None or not cap.isOpened():
    print(f"Error: Could not open H.264 file after {max_retries} retries: {H264_FILE}")
    log_detection(f"ERROR: Failed to open H.264 file after {max_retries} retries")
    send_status_to_firebase("inactive")
    camera_process.terminate()
    camera_process.wait(timeout=5)
    sys.exit(1)

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Video properties: {width}x{height} @ {fps} fps")

try:
    while True:
        ret, frame = cap.read()
        
        if not ret:
            # Check if camera is still recording
            if camera_process.poll() is not None:
                # Camera finished, try to read remaining frames
                time.sleep(1)
                # Reopen to try to get any remaining frames
                cap.release()
                cap = cv2.VideoCapture(H264_FILE)
                ret, frame = cap.read()
                if not ret:
                    break
            else:
                # Camera still recording, wait a bit and try again
                time.sleep(0.1)
                continue
        
        frame_count += 1
        
        # Initialize video writer on first frame
        if out is None:
            out = cv2.VideoWriter(OUTPUT_FILE, fourcc, 30, (width, height))
        
        # Convert to grayscale for consistency
        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_display = cv2.cvtColor(frame_gray, cv2.COLOR_GRAY2BGR)
        
        # Run YOLO detection
        results = model.predict(frame, conf=0.3, verbose=False)
        
        # Draw detections on original frame
        detection_on_frame = False
        for box in results[0].boxes:
            detection_on_frame = True
            detection_count += 1
            
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            conf_percent = int(conf * 100)
            cls = int(box.cls[0])
            label = model.names[cls]
            
            # Get current GPS location
            with gps_lock:
                lat = current_gps_location["lat"]
                lon = current_gps_location["lon"]
            
            # Log and send detection data
            log_detection(f"DETECTION - Frame {frame_count}: {label} ({conf_percent}%)")
            
            # Send to Firebase/LoRa
            send_detection_data(frame_count, label, conf_percent, lat, lon)
            
            cv2.rectangle(frame_display, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame_display, f"{label} {conf_percent}%", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Write frame to output video
        out.write(frame_display)
        
        # Display progress
        if frame_count % 30 == 0:
            status = "✓ DETECTED" if detection_on_frame else "○ No detection"
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Frame {frame_count} - {status}")
        
        # Show preview only if display is available (press 'q' to quit early)
        if os.environ.get('DISPLAY') is not None:
            cv2.imshow("Detection", frame_display)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    
    cap.release()
            
except KeyboardInterrupt:
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Interrupted by user")
except Exception as e:
    print(f"Error during processing: {e}")
    import traceback
    traceback.print_exc()
finally:
    # Close SPI connection
    if lora_module:
        try:
            lora_module.close()
        except:
            pass
    
    # Cleanup MAVLink connection
    if mavlink_serial:
        try:
            mavlink_serial.close()
        except:
            pass
    
    # Cleanup GPIO
    try:
        import RPi.GPIO as GPIO
        GPIO.cleanup()
    except:
        pass
    
    # Cleanup
    camera_process.terminate()
    camera_process.wait(timeout=5)
    
    if out is not None:
        out.release()
    
    if os.environ.get('DISPLAY') is not None:
        cv2.destroyAllWindows()
    
    # Cleanup GPIO
    if LORA_AVAILABLE:
        try:
            GPIO.cleanup()
        except:
            pass
    
    # Log final summary
    log_detection("="*60)
    log_detection(f"Processing complete!")
    log_detection(f"Total frames processed: {frame_count}")
    log_detection(f"Total detections: {detection_count}")
    if frame_count > 0:
        log_detection(f"Detection rate: {(detection_count/frame_count)*100:.1f}%")
        log_detection(f"Output saved to: {OUTPUT_FILE}")
    else:
        log_detection(f"WARNING: No frames were processed")
    log_detection("="*60)
    
    # Send inactive status to Firebase
    send_status_to_firebase("inactive")
    
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Processing complete!")
    print(f"Total frames processed: {frame_count}")
    print(f"Total detections: {detection_count}")
    if frame_count > 0:
        print(f"Detected video saved to: {OUTPUT_FILE}")
    else:
        print(f"Warning: No frames were processed")
