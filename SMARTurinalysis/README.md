# Optimized Urine Strip Color Detection with HSV Calibration

## Overview
This project detects urine test strip color variations using advanced image processing techniques. Unlike standard color thresholding which fails under varying lighting and shadows, this engine uses **1D Signal Processing (Matched Filter Cross-Correlation)** to perfectly anchor the 10 chemical pads down the exact center of the stick, ensuring 100% dead-level extraction.

## Features
- Real-time intelligent color extraction
- 1D Signal Processing Pad Alignment (Immune to edge shadows and background clutter)
- Automated strip classification and categorization
- HSV color mapping to medical standards
- Debug visualizer for physical alignment verification

## Tech Stack
- Python
- OpenCV
- NumPy
- Flask (for the Web Interface wrapper)

## How to Run

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**
   ```bash
   python app.py
   ```

3. **Open in Browser**
   Navigate to `http://127.0.0.1:5000` to access the drag-and-drop web UI. Upload any urine strip image (smartphone photos perfectly accepted) to see the dynamic color extraction grid snap perfectly onto the pads!


