#!/bin/bash

# Setup script for LoRa and GPS dependencies
# This script installs required packages for LoRa communication and GPS tracking

echo "============================================================"
echo "LoRa & GPS Setup for Raspberry Pi Camera Detection"
echo "============================================================"

# Update system packages
echo "[1/5] Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install GPIO libraries
echo "[2/5] Installing GPIO and I2C libraries..."
sudo apt-get install -y python3-rpi.gpio python3-smbus i2c-tools

# Install Python LoRa libraries
echo "[3/5] Installing Python LoRa libraries..."
pip3 install adafruit-circuitpython-rfm9x
pip3 install adafruit-circuitpython-busdevice
pip3 install adafruit-blinka

# Install MAVLink for SpeedyBee F405 v3 FC
echo "[4/5] Installing MAVLink libraries for SpeedyBee FC..."
pip3 install pymavlink

# Install additional Python dependencies
echo "[5/5] Installing additional Python packages..."
pip3 install requests pyserial

echo ""
echo "============================================================"
echo "Setup Complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Enable SPI interface:"
echo "   sudo raspi-config"
echo "   - Go to Interface Options → SPI → Enable"
echo ""
echo "2. Enable UART for SpeedyBee F405 v3 FC connection:"
echo "   sudo raspi-config"
echo "   - Go to Interface Options → Serial Port"
echo "   - Enable Serial Port (keep login disabled)"
echo ""
echo "3. Connect SpeedyBee F405 v3 FC GPS via UART:"
echo "   - SpeedyBee TX → Raspberry Pi RX (GPIO 15, Pin 10)"
echo "   - SpeedyBee RX → Raspberry Pi TX (GPIO 14, Pin 8)"
echo "   - SpeedyBee GND → Raspberry Pi GND"
echo ""
echo "4. Connect your LoRa module according to the wiring diagram:"
echo "   - Pin 1 (GND) → GPIO GND"
echo "   - Pin 2 (VCC 3.3V) → 3.3V power"
echo "   - Pin 3 (DIO0) → GPIO 24"
echo "   - Pin 6 (MISO) → GPIO 9 (MISO)"
echo "   - Pin 7 (MOSI) → GPIO 10 (MOSI)"
echo "   - Pin 8 (SCK) → GPIO 11 (SCLK)"
echo "   - Pin 9 (NSS) → GPIO 8 (CE0)"
echo "   - Pin 10 (RESET) → GPIO 25"
echo ""
echo "5. Run the detection script:"
echo "   python3 record_and_predict_realtime.py"
echo ""
