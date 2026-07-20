from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_url = os.getenv("MONGO_URL")

if mongo_url and mongo_url.strip():
    try:
        client = MongoClient(mongo_url)
        db = client["aihire"]
        users = db["users"]
        jobs = db["jobs"]
        video_results = db["video_results"]
        print("MongoDB connected")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        db = users = jobs = video_results = None
else:
    print("⚠️ WARNING: MONGO_URL environment variable is missing or empty. Please set MONGO_URL in Azure App Service Configuration.")
    client = db = users = jobs = video_results = None