import sys
import os

# Add the project dir
sys.path.insert(0, r"c:\Users\asus\OneDrive\Desktop\UronexaC1\SMARTurinalysis")

import numpy as np
import cv2
import app

dummy_path = os.path.join(r"c:\Users\asus\OneDrive\Desktop\UronexaC1\SMARTurinalysis", "uploads", "dummy.jpg")
img = np.zeros((800, 200, 3), dtype=np.uint8)
img[:] = [255, 255, 255]
cv2.imwrite(dummy_path, img)

try:
    print("Testing extract_colors")
    clinical_data, debug_path = app.extract_colors(dummy_path)
    print("Success!")
    print(clinical_data)
except Exception as e:
    print(f"Python Caught Exception: {e}")
