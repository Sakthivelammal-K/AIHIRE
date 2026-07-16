from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
from database import db
from datetime import datetime, timezone
import os
import shutil
from pathlib import Path

# ==========================================
# IMPORT NOTIFICATION HELPER
# ==========================================
try:
    from .notifications import create_notification
except ImportError:
    def create_notification(recipient_email, title, message, type, metadata=None, action_link=None, priority="medium", icon=None, color=None):
        print(f"NOTIFICATION SKIPPED (DB helper missing): {title} - {message}")
        return None

router = APIRouter()

messages = db["messages"]

# Create an 'uploads' folder if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# ==========================================
# SEND MESSAGE
# ==========================================
@router.post("/send")
def send_message(data: dict):
    # Force emails to lowercase to prevent case-sensitive matching issues
    if "sender" in data: data["sender"] = data["sender"].lower()
    if "receiver" in data: data["receiver"] = data["receiver"].lower()
    
    data["timestamp"] = datetime.now(timezone.utc)
    data["read"] = False
    messages.insert_one(data)
    
    sender = data.get("sender")
    receiver = data.get("receiver")
    msg_text = data.get("message", "")
    
    if receiver and sender:
        # 🟢 This will send a notification to BOTH Recruiters and Candidates
        create_notification(
            recipient_email=receiver,
            title="New Message",
            message=f"You have a new message from {sender}: \"{msg_text[:50]}{'...' if len(msg_text) > 50 else ''}\"",
            type="message",
            metadata={"sender": sender},
            # 🟢 IMPORTANT: Use generic /messages so frontend adds /recruiter or /candidate automatically
            action_link="/messages", 
            priority="medium",
            icon="FaEnvelope",
            color="#3b82f6"
        )

    return {"message": "Message sent successfully"}

# ==========================================
# UPLOAD FILE
# ==========================================
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    sender: str = Form(...),
    receiver: str = Form(...)
):
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = UPLOAD_DIR / safe_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        base_url = "http://localhost:8000" 
        file_url = f"{base_url}/uploads/{safe_filename}"

        return {
            "message": "File uploaded successfully",
            "fileUrl": file_url,
            "fileName": safe_filename,
            "originalName": file.filename
        }
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# SERVE UPLOADED FILES
# ==========================================
@router.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        return {"error": "File not found"}
    return FileResponse(path=file_path)

# ==========================================
# GET CHAT HISTORY
# ==========================================
@router.get("/{user1}/{user2}")
def get_messages(user1: str, user2: str):
    user1 = user1.lower()
    user2 = user2.lower()
    
    result = []
    chats = messages.find(
        {
            "$or": [
                {"sender": user1, "receiver": user2},
                {"sender": user2, "receiver": user1}
            ]
        }
    ).sort("timestamp", 1)

    for chat in chats:
        chat["_id"] = str(chat["_id"])
        chat["senderName"] = chat["sender"].split('@')[0].capitalize()
        chat["senderRole"] = "User"
        result.append(chat)

    return result

# ==========================================
# GET CHAT USERS (SIDEBAR LIST) - ULTIMATE PYTHON FILTER
# ==========================================
@router.get("/users/{email}")
def get_chat_users(email: str):
    email_lower = email.lower()
    conversation_map = {}
    processed_emails = set()

    # 1. Fetch ALL messages from the database, regardless of email
    try:
        all_chats = messages.find().sort("timestamp", -1)
    except Exception as e:
        print("Error fetching messages:", e)
        return []

    # 2. Filter the messages manually
    for chat in all_chats:
        sender = chat.get("sender", "").lower()
        receiver = chat.get("receiver", "").lower()

        # If this message doesn't involve the current user, skip it
        if sender != email_lower and receiver != email_lower:
            continue

        # Determine who the "other" person is
        other = receiver if sender == email_lower else sender

        if other in processed_emails:
            continue
        processed_emails.add(other)

        # Calculate unread count
        unread = messages.count_documents({
            "sender": other,
            "receiver": email_lower,
            "read": False
        })

        name = other.split('@')[0].capitalize()
        role = "Candidate" if "candidate" in other else "Recruiter"

        conversation_map[other] = {
            "_id": other,
            "email": other,
            "name": name,
            "role": role,
            "lastMessage": chat.get("message", "Start a conversation"),
            "lastMessageTime": chat.get("timestamp").isoformat() if chat.get("timestamp") else "",
            "unreadCount": unread,
            "isArchived": False
        }

    return list(conversation_map.values())

# ==========================================
# DELETE CONVERSATION
# ==========================================
@router.delete("/conversation/{other_email}")
def delete_conversation(other_email: str, data: dict):
    try:
        my_email = data.get("myEmail")
        if not my_email:
            return {"error": "Missing 'myEmail' in request body"}

        result = messages.delete_many({
            "$or": [
                {"sender": my_email, "receiver": other_email},
                {"sender": other_email, "receiver": my_email}
            ]
        })

        return {
            "message": "Conversation deleted successfully",
            "deleted_count": result.deleted_count
        }
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# ARCHIVE CONVERSATION
# ==========================================
@router.put("/archive/{id}")
def archive_conversation(id: str, data: dict):
    try:
        is_archived = data.get("isArchived", False)
        return {"message": "Archive status updated", "isArchived": is_archived}
    except Exception as e:
        return {"error": str(e)}

# ==========================================
# MARK AS READ
# ==========================================
@router.put("/read")
def mark_read(data: dict):
    messages.update_many(
        {
            "sender": data["sender"],
            "receiver": data["receiver"],
            "read": False
        },
        {"$set": {"read": True}}
    )
    return {"message": "Updated"}