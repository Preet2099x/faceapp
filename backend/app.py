import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Set MongoDB URI from environment variable
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

@app.route("/")
def index():
    return "<h1>Face Detection App with MongoDB</h1>"

@app.route("/save", methods=["POST"])
def save_data():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    mongo.db.detections.insert_one(data)
    return jsonify({"message": "Data saved"}), 201

@app.route("/all", methods=["GET"])
def get_all_data():
    all_data = list(mongo.db.detections.find({}, {'_id': 0}))  # exclude _id
    return jsonify(all_data), 200

@app.route("/test-db")
def test_db():
    try:
        # Try to get count of documents in your collection
        count = mongo.db.detections.count_documents({})
        return f"MongoDB connection works! You have {count} documents."
    except Exception as e:
        return f"MongoDB connection failed: {e}"

if __name__ == "__main__":
    app.run(debug=True)
