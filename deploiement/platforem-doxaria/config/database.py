# config/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "doxaria_db")  # Corrected environment variable name

def connect_db():
    """Connect to MongoDB and return the database."""
    client = MongoClient(MONGO_URI)
    return client[DB_NAME]