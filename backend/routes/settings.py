from fastapi import APIRouter, HTTPException, Query
from database import db
from bson import ObjectId

router = APIRouter(tags=["Settings"])

settings_collection = db["settings"]
users_collection = db["users"]

@router.get("/settings")
def get_settings(email: str = Query(...)):
    """
    Fetch settings for a specific user by email.
    """
    data = settings_collection.find_one({"email": email})
    if data:
        data["_id"] = str(data["_id"])
        return data
    
    # Return empty object if no settings found (Frontend will use defaults)
    return {}


@router.put("/settings")
def save_settings(settings_data: dict):
    """
    Save or update user settings.
    Expects { "email": "...", "notifications": {...}, ... }
    """
    email = settings_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Remove _id if present to avoid MongoDB conflicts
    if "_id" in settings_data:
        del settings_data["_id"]
        
    settings_collection.update_one(
        {"email": email},
        {"$set": settings_data},
        upsert=True
    )
    
    return {"message": "Settings saved successfully"}


@router.post("/settings/change-password")
def change_password(payload: dict):
    """
    Update user password.
    Expects { "email": "...", "currentPassword": "...", "newPassword": "..." }
    """
    email = payload.get("email")
    new_password = payload.get("newPassword")
    
    if not email or not new_password:
        raise HTTPException(status_code=400, detail="Email and new password are required")
    
    # Note: In production, you should hash the password here using bcrypt
    # from passlib.context import CryptContext
    # pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    # hashed_password = pwd_context.hash(new_password)
    
    result = users_collection.update_one(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Password updated successfully"}


@router.post("/users/profile-picture")
async def upload_profile_picture(
    email: str = Query(...), 
    # In a real app, use FastAPI's UploadFile
    # file: UploadFile = File(...)
):
    """
    Placeholder for profile picture upload.
    """
    # Actual implementation would save file to disk/cloud and return the path.
    # For now, we just mock the update.
    
    dummy_image_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    
    users_collection.update_one(
        {"email": email},
        {"$set": {"profilePicture": dummy_image_url}}
    )
    
    return {"message": "Profile picture updated", "profilePicture": dummy_image_url}