import cv2
import os
import json
import time
import tkinter as tk
from tkinter import messagebox
import requests # Import the requests library

# --- Configuration ---
# This should match the address of your running Flask server
API_URL_SAVE = "http://127.0.0.1:5000/save"

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
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        messagebox.showerror("Error", "Could not open webcam.")
        return

    print("\n[INFO] Starting registration... Please look at the camera.")
    face_detected_time = None
    captured_data = None
    
    # This is the main loop for capturing video from the webcam
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
            
            # Check if at least 2 eyes are detected
            if len(eyes) >= 2:
                if face_detected_time is None:
                    face_detected_time = time.time()
                
                # Draw rectangles and prepare coordinates
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                eye_coords = []
                for (ex, ey, ew, eh) in eyes[:2]:
                    eye_center_x = x + ex + ew // 2
                    eye_center_y = y + ey + eh // 2
                    eye_coords.append({"x": eye_center_x, "y": eye_center_y})
                    cv2.rectangle(frame, (x + ex, y + ey), (x + ex + ew, y + ey + eh), (255, 255, 0), 2)

                # Show countdown on screen
                elapsed = time.time() - face_detected_time
                countdown = 5 - int(elapsed)
                if countdown > 0:
                    cv2.putText(frame, f"Capturing in {countdown}...", (x, y - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                # After 5 seconds, capture the data
                if elapsed >= 5:
                    captured_data = {
                        'face_width': int(w),
                        'face_height': int(h),
                        'eyes': eye_coords
                    }
                    print(f"[SUCCESS] Face captured.")
                    break # Exit the loop after capturing
            else:
                # If less than 2 eyes are detected, reset timer
                face_detected_time = None
                cv2.putText(frame, "Cannot see both eyes clearly", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

        else:
            face_detected_time = None
            cv2.putText(frame, "Position ONE face in the frame", (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)

        cv2.imshow("Register User - Press 'q' to cancel", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[INFO] Registration cancelled by user.")
            captured_data = None # Ensure no data is processed
            break

    cap.release()
    cv2.destroyAllWindows()

    # --- This part runs after the camera window closes ---
    if captured_data:
        user_info = get_user_info_dialog()
        name = user_info.get('name')
        department = user_info.get('department')

        if name and department:
            # Construct the final payload in the format the API expects
            payload = {
                "name": name,
                "department": department,
                "face": captured_data
            }
            
            print(f"[INFO] Sending data for '{name}' to API...")
            try:
                # Send the POST request to the Flask server
                response = requests.post(API_URL_SAVE, json=payload)
                
                # Check the response from the server
                if response.status_code == 201:
                    print("[SUCCESS] Server accepted the data.")
                    messagebox.showinfo("Success", f"User '{name}' was successfully registered!")
                else:
                    error_message = response.json().get('error', 'Unknown error')
                    print(f"[ERROR] Server returned status {response.status_code}: {error_message}")
                    messagebox.showerror("API Error", f"Failed to save user. Server says: {error_message}")

            except requests.exceptions.ConnectionError:
                print("[ERROR] Could not connect to the server. Is it running?")
                messagebox.showerror("Connection Error", "Could not connect to the server. Please ensure the backend is running.")
        else:
            print("[INFO] No name/department entered. Registration aborted.")

if __name__ == "__main__":
    register_new_user()