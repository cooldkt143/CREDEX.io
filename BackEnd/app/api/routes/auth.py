from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import os
import shutil
import uuid
from app.db import get_mongo_db

router = APIRouter()

class LoginRequest(BaseModel):
    uid: str
    email: Optional[str] = None
    displayName: Optional[str] = None
    photoURL: Optional[str] = None
    userData: Optional[Dict[str, Any]] = None

@router.post("/login")
async def register_login(request: LoginRequest):
    try:
        db = get_mongo_db()
        email = request.email or ""
        username = f"@{email.split('@')[0]}" if "@" in email else "@user"
        
        # Check if user already exists to merge fields
        existing = db.users.find_one({"_id": request.uid})
        
        user_data = {
            "email": email,
            "displayName": request.displayName or (existing.get("displayName") if existing else ""),
            "photoURL": request.photoURL or (existing.get("photoURL") if existing else ""),
            "username": username,
            "last_login": datetime.utcnow()
        }
        
        # Initialize additional profile fields if new user
        if not existing:
            user_data.update({
                "phone": "",
                "location": "IN",
                "skills": [],
                "education": [],
                "description": "",
                "resume": None,
                "platforms": {
                    "github": 0,
                    "hackerrank": 0,
                    "geeksforgeeks": 0,
                    "linkedin": 0
                },
                "profileCompletion": 0
            })
            
        db.users.update_one(
            {"_id": request.uid},
            {"$set": user_data},
            upsert=True
        )
        return {"status": "success", "message": "User login stored successfully", "username": username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

class ProfileUpdateRequest(BaseModel):
    displayName: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    education: Optional[List[Dict[str, Any]]] = None
    description: Optional[str] = None
    resume: Optional[Dict[str, Any]] = None

@router.get("/profile/{uid}")
async def get_profile(uid: str):
    try:
        db = get_mongo_db()
        profile = db.users.find_one({"_id": uid})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        # Ensure _id is in string format for JSON serialization
        profile["uid"] = profile["_id"]
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.put("/profile/{uid}")
async def update_profile(uid: str, request: ProfileUpdateRequest):
    try:
        db = get_mongo_db()
        
        update_data = {}
        if request.displayName is not None:
            update_data["displayName"] = request.displayName
        if request.phone is not None:
            update_data["phone"] = request.phone
        if request.location is not None:
            update_data["location"] = request.location
        if request.skills is not None:
            update_data["skills"] = request.skills
        if request.education is not None:
            update_data["education"] = request.education
        if request.description is not None:
            update_data["description"] = request.description
        if request.resume is not None:
            update_data["resume"] = request.resume

        if not update_data:
            return {"status": "success", "message": "No changes to update"}
            
        # Recalculate Profile Completion Percentage
        existing = db.users.find_one({"_id": uid})
        if not existing:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        # Merged data to calculate completion
        merged = {**existing, **update_data}
        filled_fields = 0
        completion_fields = ["displayName", "email", "phone", "location", "description", "resume"]
        filled_fields += sum(1 for field in completion_fields if merged.get(field))
        
        if merged.get("skills") and len(merged.get("skills")) > 0: 
            filled_fields += 1
        if merged.get("education") and len(merged.get("education")) > 0: 
            filled_fields += 1
        
        completion = int((filled_fields / 8) * 100)
        update_data["profileCompletion"] = completion

        db.users.update_one(
            {"_id": uid},
            {"$set": update_data}
        )
        return {"status": "success", "message": "Profile updated successfully", "profileCompletion": completion}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/profile/{uid}/upload-resume")
async def upload_profile_resume(uid: str, file: UploadFile = File(...)):
    try:
        db = get_mongo_db()
        existing = db.users.find_one({"_id": uid})
        if not existing:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        temp_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(upload_dir, temp_filename).replace("\\", "/")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        resume_data = {
            "filename": file.filename,
            "file_path": file_path
        }
        
        # Recalculate Profile Completion
        merged = {**existing, "resume": resume_data}
        filled_fields = 0
        completion_fields = ["displayName", "email", "phone", "location", "description", "resume"]
        filled_fields += sum(1 for field in completion_fields if merged.get(field))
        
        if merged.get("skills") and len(merged.get("skills")) > 0: 
            filled_fields += 1
        if merged.get("education") and len(merged.get("education")) > 0: 
            filled_fields += 1
            
        completion = int((filled_fields / 8) * 100)
        
        db.users.update_one(
            {"_id": uid},
            {"$set": {"resume": resume_data, "profileCompletion": completion}}
        )
        return {
            "status": "success",
            "message": "Resume uploaded successfully",
            "resume": resume_data,
            "profileCompletion": completion
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")


