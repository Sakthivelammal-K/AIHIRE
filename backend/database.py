from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

DEFAULT_MONGO_URL = "mongodb+srv://suman:Sudalairajan%40123@media.global.mongocluster.cosmos.azure.com"
mongo_url = os.getenv("MONGO_URL") or os.getenv("MONGO_URI") or DEFAULT_MONGO_URL

try:
    client = MongoClient(mongo_url)
    db = client["aihire"]
    users = db["users"]
    jobs = db["jobs"]
    video_results = db["video_results"]
    print("MongoDB connected successfully")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB with primary URL ({e}), connecting with fallback...")
    client = MongoClient(DEFAULT_MONGO_URL)
    db = client["aihire"]
    users = db["users"]
    jobs = db["jobs"]
    video_results = db["video_results"]
    print("MongoDB connected via fallback")