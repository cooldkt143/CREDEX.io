from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017")
db = client["resume_builder_db"]
collection = db["resumes"]


def insert_resume(resume_json: dict, filename: str):
    doc = {
        "filename": filename,
        "resume_json": resume_json
    }
    result = collection.insert_one(doc)
    return str(result.inserted_id)


def get_resume(resume_id: str):
    doc = collection.find_one({"_id": ObjectId(resume_id)})
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


def update_resume(resume_id: str, resume_json: dict):
    result = collection.update_one(
        {"_id": ObjectId(resume_id)},
        {"$set": {"resume_json": resume_json}}
    )
    return result.matched_count > 0
