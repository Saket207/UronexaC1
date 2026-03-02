import cv2
import numpy as np
import sys
import os

def debug_contours(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error reading image: {image_path}")
        return
        
    debug_img = img.copy()
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    height, width, _ = img.shape
    
    if width > height:
        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        debug_img = cv2.rotate(debug_img, cv2.ROTATE_90_CLOCKWISE)
        height, width, _ = img.shape

    # -- Crop step -- 
    gray_for_lines = cv2.cvtColor(debug_img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_for_lines, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=height*0.3, maxLineGap=height*0.1)
    
    stick_left = 0
    stick_right = width
    
    if lines is not None:
        verticals = []
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if abs(x1 - x2) < width * 0.1:
                verticals.append((x1+x2)//2)
        
        if len(verticals) >= 2:
            verticals.sort()
            mid_verticals = [v for v in verticals if width*0.1 < v < width*0.9]
            if mid_verticals:
                stick_left = max(0, min(mid_verticals) - int(width*0.05))
                stick_right = min(width, max(mid_verticals) + int(width*0.05))

    if stick_right - stick_left > width * 0.2:
        img = img[:, stick_left:stick_right]
        debug_img = debug_img[:, stick_left:stick_right]
        width = stick_right - stick_left
        
    cv2.imwrite("debug_1_cropped.jpg", debug_img)

    # -- Segmentation step --
    lab_img = cv2.cvtColor(debug_img, cv2.COLOR_BGR2LAB)
    l_channel = lab_img[:, :, 0]
    blurred_l = cv2.GaussianBlur(l_channel, (5, 5), 0)
    thresh = cv2.adaptiveThreshold(blurred_l, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 3)
    cv2.imwrite("debug_2_thresh.jpg", thresh)
    
    from scipy.ndimage import gaussian_filter1d
    projection = np.sum(thresh, axis=1)
    smoothed_projection = gaussian_filter1d(projection, sigma=2.0)
    
    signal_threshold = np.max(smoothed_projection) * 0.15
    active_rows = smoothed_projection > signal_threshold
    
    regions = []
    in_region = False
    start_y = 0
    for y, is_active in enumerate(active_rows):
        if is_active and not in_region:
            in_region = True
            start_y = y
        elif not is_active and in_region:
            in_region = False
            end_y = y
            regions.append((start_y, end_y))
    if in_region:
        regions.append((start_y, height-1))
        
    min_pad_height = height * 0.02
    filtered_regions = [r for r in regions if (r[1] - r[0]) > min_pad_height]
    
    print(f"Found {len(filtered_regions)} projection regions")
    
    validated_contours = []
    
    for idx, (y_start, y_end) in enumerate(filtered_regions):
        region_mask = thresh[y_start:y_end, 0:width]
        contours, _ = cv2.findContours(region_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            continue
            
        largest_contour = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        y += y_start
        
        aspect_ratio = float(w) / float(h) if h > 0 else 0
        area = w * h
        width_ratio = float(w) / float(width)
        
        print(f"Region {idx} at Y={y_start}: Aspect={aspect_ratio:.2f} (Want 1.0-4.0), WidthRatio={width_ratio:.2f} (Want >0.4), Area={area} (Want >{width * height * 0.005})")
        
        if 1.0 <= aspect_ratio <= 4.0 and width_ratio > 0.4 and area > (width * height * 0.005):
            validated_contours.append((x, y, w, h))
            
    print(f"Valid contours via regions: {len(validated_contours)}")
    
    if not (8 <= len(validated_contours) <= 12):
        print("Falling back to pure contours")
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        validated_contours = []
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = float(w) / float(h) if h > 0 else 0
            width_ratio = float(w) / float(width)
            area = w * h
            
            if area > (width * height * 0.002):
                print(f"  Contour Area={area:.0f}, Aspect={aspect_ratio:.2f}, WidthRatio={width_ratio:.2f}, w={w}, h={h}")
            
            if 1.0 <= aspect_ratio <= 4.0 and width_ratio > 0.4 and area > (width * height * 0.005):
                validated_contours.append((x, y, w, h))
    
    print(f"Final Count: {len(validated_contours)}")

if __name__ == '__main__':
    # Find the most recently uploaded image 
    uploads_dir = r"c:\Users\asus\OneDrive\Desktop\UronexaC1\SMARTurinalysis\uploads"
    files = [os.path.join(uploads_dir, f) for f in os.listdir(uploads_dir) if f.endswith('.jpg') and not f.startswith('debug_')]
    if files:
        latest = max(files, key=os.path.getctime)
        print(f"Testing latest image: {latest}")
        debug_contours(latest)
    else:
        print("No uploaded images found.")
