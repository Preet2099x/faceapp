import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS  # Import CORS


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set MongoDB URI from .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# ✅ Root route to confirm server is running
@app.route("/")
def index():
    return "<h1>Face Detection App with MongoDB</h1>"

# ✅ Save full user and face data with validation
@app.route("/save", methods=["POST"])
def save_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # 1. Check for top-level required fields
    required_top_level_fields = ["name", "department", "face"]
    if not all(field in data for field in required_top_level_fields):
        return jsonify({"error": f"Missing required fields: {required_top_level_fields}"}), 400

    face_data = data.get("face")

    # 2. Check if 'face' is a valid object
    if not isinstance(face_data, dict):
        return jsonify({"error": "'face' must be a JSON object"}), 400

    # 3. Check for required fields within the 'face' object
    required_face_fields = ["face_width", "face_height", "eyes"]
    if not all(field in face_data for field in required_face_fields):
        return jsonify({"error": f"Missing required fields in 'face' object: {required_face_fields}"}), 400
    
    # 4. Check if 'eyes' is a valid array
    if not isinstance(face_data.get("eyes"), list):
        return jsonify({"error": "'eyes' must be a JSON array"}), 400

    # If all checks pass, insert the data
    result = mongo.db.faces.insert_one(data)
    return jsonify({"message": "User and face data saved successfully", "id": str(result.inserted_id)}), 201

# ⭐ --- UPDATED FUNCTION TO VERIFY FACE --- ⭐
@app.route("/verify", methods=["POST"])
def verify_face():
    """
    Checks if the eyes coordinates within an incoming 'face' object
    match a record in the database within a certain tolerance.
    """
    data = request.get_json()

    # 1. Validate input data: Check for a top-level 'face' object
    if not data or "face" not in data or not isinstance(data.get("face"), dict):
        return jsonify({"error": "Invalid input. Please provide a 'face' object."}), 400

    face_data = data["face"]
    
    # 2. Validate the contents of the 'face' object
    if "eyes" not in face_data or not isinstance(face_data["eyes"], list) or len(face_data["eyes"]) != 2:
        return jsonify({"error": "Invalid 'face' object. It must contain an 'eyes' array with two coordinates."}), 400

    # 3. Define a tolerance for matching (e.g., +/- 5 pixels)
    TOLERANCE = 5
    try:
        incoming_eyes = face_data["eyes"]
        left_eye = incoming_eyes[0]
        right_eye = incoming_eyes[1]
    except (IndexError, KeyError):
        return jsonify({"error": "Invalid coordinate structure in 'eyes' array."}), 400

    # 4. Build the database query to find a match within the tolerance range
    query = {
        "face.eyes.0.x": {"$gte": left_eye['x'] - TOLERANCE, "$lte": left_eye['x'] + TOLERANCE},
        "face.eyes.0.y": {"$gte": left_eye['y'] - TOLERANCE, "$lte": left_eye['y'] + TOLERANCE},
        "face.eyes.1.x": {"$gte": right_eye['x'] - TOLERANCE, "$lte": right_eye['x'] + TOLERANCE},
        "face.eyes.1.y": {"$gte": right_eye['y'] - TOLERANCE, "$lte": right_eye['y'] + TOLERANCE},
    }

    # 5. Search for one matching record in the database
    found_record = mongo.db.faces.find_one(query)

    # 6. Return the result
    if found_record:
        # Match found! Grant access and return user info.
        return jsonify({
            "status": "Access Granted",
            "name": found_record.get("name"),
            "department": found_record.get("department")
        }), 200
    else:
        # No match found.
        return jsonify({"status": "Face not found"}), 404

# ✅ Get all saved data
@app.route("/all", methods=["GET"])
def get_all_data():
    all_data = list(mongo.db.faces.find({}, {'_id': 0}))  # hide MongoDB _id
    return jsonify(all_data), 200

# ✅ Test MongoDB connection
@app.route("/test-db")
def test_db():
    try:
        count = mongo.db.faces.count_documents({})
        return f"MongoDB connection works! You have {count} documents."
    except Exception as e:
        return f"MongoDB connection failed: {e}"

if __name__ == "__main__":
    app.run(debug=True)
