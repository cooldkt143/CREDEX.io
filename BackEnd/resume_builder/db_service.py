import json
import os
import uuid

DB_FILE = "resumes_db.json"

def _load_db():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def _save_db(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def insert_resume(resume_json: dict, filename: str):
    db = _load_db()
    new_id = str(uuid.uuid4())
    db[new_id] = {
        "filename": filename,
        "resume_json": resume_json
    }
    _save_db(db)
    return new_id

def get_resume(resume_id: str):
    db = _load_db()
    doc = db.get(resume_id)
    if not doc:
        return None
    doc["_id"] = resume_id
    return doc

def update_resume(resume_id: str, resume_json: dict):
    db = _load_db()
    if resume_id in db:
        db[resume_id]["resume_json"] = resume_json
        _save_db(db)
        return True
    return False
