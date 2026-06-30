from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URL"))

db = client["aihire"]

users = db["users"]
jobs = db["jobs"]
video_results = db["video_results"]

print("MongoDB connected")