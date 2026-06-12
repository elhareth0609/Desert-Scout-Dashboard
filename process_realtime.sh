#!/bin/bash

# Real-time Video Recording with Detection Pipeline
# Records H.264 and processes frames in real-time with YOLO detection

PROJECT_DIR="/home/hareth/Desktop/project"
LOG_FILE="$PROJECT_DIR/records/camera_status.log"

echo "=== Starting Real-Time Recording & Detection Pipeline ===" | tee -a "$LOG_FILE"
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting real-time processing..." | tee -a "$LOG_FILE"

# Run the real-time recording and prediction script
cd "$PROJECT_DIR"
python3 record_and_predict_realtime.py

if [ $? -eq 0 ]; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Real-time processing completed successfully!" | tee -a "$LOG_FILE"
else
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Real-time processing failed!" | tee -a "$LOG_FILE"
    exit 1
fi

echo "=== Pipeline Complete ===" | tee -a "$LOG_FILE"
