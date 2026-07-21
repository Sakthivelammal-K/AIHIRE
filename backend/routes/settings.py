from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from database import db
from azure_storage import upload_file_to_azure
from bson import ObjectId

router = APIRouter(tags=["Settings"])

settings_collection = db["settings"]
users_collection = db["users"]

@router.get("/settings")
def get_settings(email: str = Query(...)):
    data = settings_collection.find_one({"email": email})
    if data:
        data["_id"] = str(data["_id"])
        return data
    return {}


@router.put("/settings")
def save_settings(settings_data: dict):
    email = settings_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
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
    email = payload.get("email")
    new_password = payload.get("newPassword")
    
    if not email or not new_password:
        raise HTTPException(status_code=400, detail="Email and new password are required")
    
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
    file: UploadFile = File(None)
):
    """
    Upload profile picture to Azure Blob Storage and update user profile in MongoDB.
    """
    if file:
        file_bytes = await file.read()
        content_type = file.content_type or "image/png"
        image_url = upload_file_to_azure(
            file_bytes=file_bytes,
            filename=file.filename,
            content_type=content_type,
            folder="avatars"
        )
    else:
        image_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}"
    
    users_collection.update_one(
        {"email": email},
        {"$set": {"profilePicture": image_url}},
        upsert=True
    )
    
    return {
        "message": "Profile picture updated successfully",
        "profilePicture": image_url
    }