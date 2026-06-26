import os
import uuid
import json
import sys

# Set paths to import app modules correctly
backend_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.db import get_mongo_db

SQLITE_FILE = os.path.join(backend_path, "credex.db")
JSON_FILE = os.path.join(backend_path, "resumes_db.json")
JSON_BAK_FILE = os.path.join(backend_path, "resumes_db.json.bak")

def _migrate_to_mongodb():
    try:
        db = get_mongo_db()
        
        # 1. Migrate SQLite if it exists
        if os.path.exists(SQLITE_FILE):
            import sqlite3
            try:
                conn = sqlite3.connect(SQLITE_FILE)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT id, filename, resume_json FROM resumes")
                rows = cursor.fetchall()
                migrated_count = 0
                for row in rows:
                    resume_id = row["id"]
                    filename = row["filename"]
                    try:
                        resume_json = json.loads(row["resume_json"])
                    except:
                        resume_json = {}
                    
                    db.resumes.update_one(
                        {"_id": resume_id},
                        {"$set": {"filename": filename, "resume_json": resume_json}},
                        upsert=True
                    )
                    migrated_count += 1
                conn.close()
                
                backup_sqlite = SQLITE_FILE + ".bak"
                if os.path.exists(backup_sqlite):
                    os.remove(backup_sqlite)
                os.rename(SQLITE_FILE, backup_sqlite)
                print(f"[MIGRATION] Migrated {migrated_count} records from SQLite to MongoDB. SQLite backed up.")
            except Exception as se:
                print(f"[MIGRATION] Error migrating SQLite: {se}")

        # 2. Migrate JSON files if they exist
        for json_path in [JSON_FILE, JSON_BAK_FILE]:
            if os.path.exists(json_path):
                try:
                    with open(json_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    
                    if isinstance(data, dict):
                        migrated_count = 0
                        for resume_id, doc in data.items():
                            filename = doc.get("filename", "")
                            resume_json = doc.get("resume_json", {})
                            
                            db.resumes.update_one(
                                {"_id": resume_id},
                                {"$set": {"filename": filename, "resume_json": resume_json}},
                                upsert=True
                            )
                            migrated_count += 1
                        
                        if json_path == JSON_FILE:
                            backup_json = JSON_FILE + ".migrated"
                            if os.path.exists(backup_json):
                                os.remove(backup_json)
                            os.rename(JSON_FILE, backup_json)
                            print(f"[MIGRATION] Migrated {migrated_count} records from JSON file. JSON backed up.")
                except Exception as je:
                    print(f"[MIGRATION] Error migrating JSON {json_path}: {je}")
                    
    except Exception as e:
        print(f"[MIGRATION] MongoDB connection not available or error during migration: {e}")

# Run migration once on import
_migrate_to_mongodb()

def insert_resume(resume_json: dict, filename: str) -> str:
    new_id = str(uuid.uuid4())
    db = get_mongo_db()
    db.resumes.insert_one({
        "_id": new_id,
        "filename": filename,
        "resume_json": resume_json
    })
    return new_id

def get_resume(resume_id: str):
    db = get_mongo_db()
    doc = db.resumes.find_one({"_id": resume_id})
    return doc

def update_resume(resume_id: str, resume_json: dict) -> bool:
    db = get_mongo_db()
    result = db.resumes.update_one(
        {"_id": resume_id},
        {"$set": {"resume_json": resume_json}}
    )
    return result.matched_count > 0

