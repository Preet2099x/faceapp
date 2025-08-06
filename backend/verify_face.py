# File: verify_face.py
import cv2
import os
import json
import time
import requests

# --- Configuration ---
# This points to your Flask server's verify endpoint
API_URL_VERIFY = "http://127.0.0.1:5000/verify"

# Load Haar Cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# --- Main Verification Function ---
def verify_user():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        return

    print("\n[INFO] Starting verification... Please look at the camera.")
    face_detected_time = None
    captured_data = None
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(100, 100))

        if len(faces) == 1:
            (x, y, w, h) = faces[0]
            roi_gray = gray[y:y + h, x:x + w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            
            if len(eyes) >= 2:
                if face_detected_time is None:
                    face_detected_time = time.time()
                
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                elapsed = time.time() - face_detected_time
                countdown = 5 - int(elapsed)
                if countdown > 0:
                    cv2.putText(frame, f"Verifying in {countdown}...", (x, y - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                if elapsed >= 5:
                    eye_coords = [{"x": x + ex + ew // 2, "y": y + ey + eh // 2} for (ex, ey, ew, eh) in eyes[:2]]
                    # Convert all values to standard Python types to ensure JSON serialization works
                    captured_data = {
                        'face_width': int(w),
                        'face_height': int(h),
                        'eyes': [{'x': int(eye['x']), 'y': int(eye['y'])} for eye in eye_coords]
                    }
                    print(f"[SUCCESS] Face captured.")
                    break
            else:
                face_detected_time = None
        else:
            face_detected_time = None

        cv2.imshow("Verify User - Press 'q' to cancel", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            captured_data = None
            break

    cap.release()
    cv2.destroyAllWindows()

    if captured_data:
        # Prepare payload for backend verification
        payload = {
            "face": captured_data
        }
        
        print(f"[INFO] Captured face data, verifying...")
        try:
            # Send data to backend API for verification
            response = requests.post(API_URL_VERIFY, json=payload)
            print(f"[INFO] Sent data to backend: {response.status_code}")
            
            # Process the verification response
            if response.status_code == 200:
                result = response.json()
                print(f"[SUCCESS] {result['status']}")
                if 'name' in result:
                    print(f"[INFO] User: {result['name']}, Department: {result['department']}")
                    
                # Display verification result in terminal
                print(f"[VERIFICATION RESULT] Access Granted")
                print(f"[USER DETAILS] Name: {result['name']}, Department: {result['department']}")
                print(f"[COORDINATES] Left Eye: ({captured_data['eyes'][0]['x']}, {captured_data['eyes'][0]['y']}), Right Eye: ({captured_data['eyes'][1]['x']}, {captured_data['eyes'][1]['y']})")
                print(f"[FACE DIMENSIONS] Width: {captured_data['face_width']}, Height: {captured_data['face_height']}")
            elif response.status_code == 404:
                print(f"[INFO] Face not recognized in the system.")
                # Display verification result in terminal
                print(f"[VERIFICATION RESULT] Access Denied: Face not recognized in the system.")
                print(f"[COORDINATES] Left Eye: ({captured_data['eyes'][0]['x']}, {captured_data['eyes'][0]['y']}), Right Eye: ({captured_data['eyes'][1]['x']}, {captured_data['eyes'][1]['y']})")
                print(f"[FACE DIMENSIONS] Width: {captured_data['face_width']}, Height: {captured_data['face_height']}")
            else:
                print(f"[ERROR] Verification failed with status code: {response.status_code}")
                print(f"[ERROR] Response: {response.text}")
            
        except requests.exceptions.ConnectionError as e:
            print(f"[ERROR] Connection error: {str(e)}")
            print("[ERROR] Could not connect to the server. Is it running?")

if __name__ == "__main__":
    verify_user()