import os
import time
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId # Required to handle MongoDB IDs
from bson.errors import InvalidId

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set MongoDB URI from .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# --- In-memory storage for the latest coordinates for HTTP Polling ---
latest_coords = {
    "data": None,
    "timestamp": 0
}

# ✅ Root route to confirm server is running
@app.route("/")
def index():
    return "<h1>Face Detection App with MongoDB</h1>"

# --- FOR HTTP POLLING: Receive coordinates from capture script ---
@app.route("/temp-coords", methods=["POST"])
def post_temp_coords():
    global latest_coords
    data_from_script = request.get_json()
    if not data_from_script:
        return jsonify({"error": "No data received"}), 400
    
    latest_coords["data"] = data_from_script
    latest_coords["timestamp"] = time.time()
    print(f"[INFO] Received new coordinates from capture script: {data_from_script}")
    return jsonify({"message": "Coordinates received"}), 200

# --- FOR HTTP POLLING: Allow React app to get latest coordinates ---
@app.route("/temp-coords", methods=["GET"])
def get_temp_coords():
    # Only return fresh data (e.g., captured in the last 20 seconds)
    if time.time() - latest_coords["timestamp"] < 20:
        return jsonify(latest_coords["data"]), 200
    else:
        return jsonify(None), 200 # Return null if data is old or non-existent

# --- FOR CREATING A USER ---
@app.route("/save", methods=["POST"])
def save_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    required_fields = ["name", "department", "face"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Missing one or more required fields: {required_fields}"}), 400

    # Additional validation can be kept as is...
    
    result = mongo.db.faces.insert_one(data)
    return jsonify({"message": "User and face data saved successfully", "id": str(result.inserted_id)}), 201

# --- FOR VERIFYING A USER ---
@app.route("/verify", methods=["POST"])
def verify_face():
    data = request.get_json()
    if not data or "face" not in data or not isinstance(data.get("face"), dict):
        return jsonify({"error": "Invalid input. Please provide a 'face' object."}), 400

    face_data = data["face"]
    if "eyes" not in face_data or not isinstance(face_data["eyes"], list) or len(face_data["eyes"]) != 2:
        return jsonify({"error": "Invalid 'face' object. It must contain an 'eyes' array."}), 400

    TOLERANCE = 5
    try:
        left_eye = face_data["eyes"][0]
        right_eye = face_data["eyes"][1]
        query = {
            "face.eyes.0.x": {"$gte": left_eye['x'] - TOLERANCE, "$lte": left_eye['x'] + TOLERANCE},
            "face.eyes.0.y": {"$gte": left_eye['y'] - TOLERANCE, "$lte": left_eye['y'] + TOLERANCE},
            "face.eyes.1.x": {"$gte": right_eye['x'] - TOLERANCE, "$lte": right_eye['x'] + TOLERANCE},
            "face.eyes.1.y": {"$gte": right_eye['y'] - TOLERANCE, "$lte": right_eye['y'] + TOLERANCE},
        }
    except (IndexError, KeyError):
        return jsonify({"error": "Invalid coordinate structure in 'eyes' array."}), 400

    found_record = mongo.db.faces.find_one(query)

    if found_record:
        return jsonify({
            "status": "Access Granted",
            "name": found_record.get("name"),
            "department": found_record.get("department")
        }), 200
    else:
        return jsonify({"status": "Face not found"}), 404

# --- FOR READING ALL USERS ---
@app.route("/all", methods=["GET"])
def get_all_data():
    # To make the output cleaner, let's include the ID
    all_users = []
    for user in mongo.db.faces.find({}):
        user["_id"] = str(user["_id"]) # Convert ObjectId to string
        all_users.append(user)
    return jsonify(all_users), 200

# --- FOR UPDATING A USER ---
@app.route("/user/<user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        # Convert string ID to MongoDB ObjectId
        obj_id = ObjectId(user_id)
    except InvalidId:
        return jsonify({"error": "Invalid user ID format."}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data for update."}), 400

    # Construct the update object, only allowing name and department to be changed
    update_fields = {}
    if "name" in data:
        update_fields["name"] = data["name"]
    if "department" in data:
        update_fields["department"] = data["department"]

    if not update_fields:
        return jsonify({"error": "No valid fields to update. Only 'name' and 'department' are allowed."}), 400

    result = mongo.db.faces.update_one({"_id": obj_id}, {"$set": update_fields})

    if result.matched_count == 0:
        return jsonify({"error": "User not found."}), 404

    return jsonify({"message": f"User {user_id} updated successfully."}), 200


# --- FOR DELETING A USER ---
@app.route("/user/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        obj_id = ObjectId(user_id)
    except InvalidId:
        return jsonify({"error": "Invalid user ID format."}), 400

    result = mongo.db.faces.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        return jsonify({"error": "User not found."}), 404

    return jsonify({"message": f"User {user_id} deleted successfully."}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)