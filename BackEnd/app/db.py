import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Locate and load the root .env file
app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # BackEnd
root_dir = os.path.dirname(app_dir) # CREDEX.io
env_path = os.path.join(root_dir, ".env")

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "credex_db")

_client = None

def get_mongo_client():
    global _client
    if _client is None:
        try:
            import certifi
            _client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        except ImportError:
            _client = MongoClient(MONGO_URI)
    return _client

def get_mongo_db():
    client = get_mongo_client()
    return client[DB_NAME]
