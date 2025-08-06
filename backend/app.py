import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Set MongoDB URI from .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# ✅ Root route to confirm server is running
@app.route("/")
def index():
    return "<h1>Face Detection App with MongoDB</h1>"

# ✅ Save face data with validation
@app.route("/save", methods=["POST"])
def save_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # --- Structure Validation Starts Here ---

    # 1. Check for top-level required fields
    required_fields = ["department", "face"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields: 'department' and/or 'face'"}), 400

    face_data = data.get("face")

    # 2. Check if 'face' is a valid object (dictionary)
    if not isinstance(face_data, dict):
        return jsonify({"error": "'face' must be a JSON object"}), 400

    # 3. Check for required fields within the 'face' object
    required_face_fields = ["face_width", "face_height", "eyes"]
    if not all(field in face_data for field in required_face_fields):
        return jsonify({"error": "Missing required fields in 'face' object: 'face_width', 'face_height', and/or 'eyes'"}), 400
    
    # 4. Check if 'eyes' is a valid array (list)
    if not isinstance(face_data.get("eyes"), list):
        return jsonify({"error": "'eyes' must be a JSON array"}), 400

    # --- Validation Ends Here ---

    # If all checks pass, insert the data
    result = mongo.db.faces.insert_one(data)
    return jsonify({"message": "Data saved successfully", "id": str(result.inserted_id)}), 201

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
