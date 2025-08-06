# File: register_user.py
import cv2
import os
import json
import time
import tkinter as tk
from tkinter import messagebox
import requests
import webbrowser
import subprocess


# --- Configuration ---
# This correctly points to your Flask server's save endpoint
API_URL_SAVE = "http://127.0.0.1:5000/save"
# Frontend URL for sending coordinates to signup page
FRONTEND_URL = "http://localhost:5173/signup"

# Load Haar Cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade  = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# --- GUI Input ---
def get_user_info_dialog():
    """Creates a custom dialog to get both name and department."""
    dialog = tk.Tk()
    dialog.title("Register User")
    dialog.geometry("350x150")

    # Center the dialog on the screen
    window_height = 150
    window_width = 350
    screen_width = dialog.winfo_screenwidth()
    screen_height = dialog.winfo_screenheight()
    x_cordinate = int((screen_width/2) - (window_width/2))
    y_cordinate = int((screen_height/2) - (window_height/2))
    dialog.geometry("{}x{}+{}+{}".format(window_width, window_height, x_cordinate, y_cordinate))

    tk.Label(dialog, text="Name:").pack(pady=5)
    name_entry = tk.Entry(dialog, width=40)
    name_entry.pack()

    tk.Label(dialog, text="Department:").pack(pady=5)
    dept_entry = tk.Entry(dialog, width=40)
    dept_entry.pack()

    user_info = {}
    def on_ok():
        user_info['name'] = name_entry.get()
        user_info['department'] = dept_entry.get()
        dialog.destroy()

    ok_button = tk.Button(dialog, text="OK", command=on_ok)
    ok_button.pack(pady=10)
    
    dialog.wait_window()
    return user_info

# --- Main Registration Function ---
def register_new_user():
    cap = None
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("[ERROR] Could not open webcam.")
            return None

        print("\n[INFO] Starting registration... Please look at the camera.")
        face_detected_time = None
        captured_data = None
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[ERROR] Failed to read from camera.")
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
                        cv2.putText(frame, f"Capturing in {countdown}...", (x, y - 10),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                    
                    if elapsed >= 5:
                        eye_coords = [{"x": x + ex + ew // 2, "y": y + ey + eh // 2} for (ex, ey, ew, eh) in eyes[:2]]
                        # Convert all values to standard Python types to ensure JSON serialization works
                        captured_data = {
                            'face_width': int(w),
                            'face_height': int(h),
                            'eyes': [{'x': int(eye['x']), 'y': int(eye['y'])} for eye in eye_coords]
                        }
                        print(f"[SUCCESS] Face captured successfully!")
                        break
                else:
                    face_detected_time = None
            else:
                face_detected_time = None

            cv2.imshow("Register User - Press 'q' to cancel", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("[INFO] Registration cancelled by user.")
                captured_data = None
                break

    except Exception as e:
        print(f"[ERROR] Error during face capture: {str(e)}")
        captured_data = None
    finally:
        # Ensure camera and windows are properly closed
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Camera and windows closed.")

    if captured_data:
        # Skip user info dialog and use default values
        name = "User"
        department = "Default"
        
        # Prepare payload for backend
        payload = {
            "name": name,
            "department": department,
            "face": captured_data
        }
        
        print(f"[INFO] Captured face data, opening frontend...")
        try:
            # Send data to backend API
            response = requests.post(API_URL_SAVE, json=payload)
            print(f"[INFO] Sent data to backend: {response.status_code}")
            
            # Construct frontend URL with query parameters
            query_params = f"?coordinates={json.dumps(captured_data)}"
            frontend_url_with_params = FRONTEND_URL + query_params
            
            # Open the frontend URL in browser
            print(f"[INFO] Opening frontend URL: {frontend_url_with_params}")
            webbrowser.open(frontend_url_with_params)
            
        except requests.exceptions.ConnectionError as e:
            print(f"[ERROR] Connection error: {str(e)}")
            print("[ERROR] Could not connect to the server. Is it running?")
            
            # Still try to open frontend even if backend connection fails
            query_params = f"?coordinates={json.dumps(captured_data)}"
            frontend_url_with_params = FRONTEND_URL + query_params
            webbrowser.open(frontend_url_with_params)
    else:
        print("[INFO] Face capture was cancelled or failed.")

if __name__ == "__main__":
    try:
        register_new_user()
    except Exception as e:
        print(f"[ERROR] Script execution failed: {str(e)}")
    finally:
        print("[INFO] Face registration script completed.")
        # Ensure all OpenCV windows are closed
        cv2.destroyAllWindows()