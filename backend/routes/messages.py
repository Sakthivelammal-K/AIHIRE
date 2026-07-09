from fastapi import APIRouter
from database import db
from datetime import datetime, timezone

router = APIRouter()

messages = db["messages"]
users = db["users"]


@router.post("/send")
def send_message(data: dict):

    data["timestamp"] = datetime.now(timezone.utc)
    data["read"] = False

    messages.insert_one(data)

    return {
        "message": "Message sent successfully"
    }


@router.get("/{user1}/{user2}")
def get_messages(user1: str, user2: str):

    result = []

    chats = messages.find(
        {
            "$or": [
                {
                    "sender": user1,
                    "receiver": user2
                },
                {
                    "sender": user2,
                    "receiver": user1
                }
            ]
        }
    ).sort("timestamp", 1)

    for chat in chats:
        chat["_id"] = str(chat["_id"])
        result.append(chat)

    return result


@router.get("/users/{email}")
def get_chat_users(email: str):

    conversation_map = {}

    chats = messages.find(
        {
            "$or": [
                {"sender": email},
                {"receiver": email}
            ]
        }
    ).sort("timestamp", -1)

    for chat in chats:

        other = chat["receiver"] if chat["sender"] == email else chat["sender"]

        if other in conversation_map:
            continue

        user = users.find_one({"email": other})

        conversation_map[other] = {
            "_id": other,
            "email": other,
            "name": user.get("name", other) if user else other,
            "role": user.get("role", "Candidate") if user else "Candidate",
            "lastMessage": chat.get("message", ""),
            "lastMessageTime": chat.get("timestamp"),
            "unreadCount": messages.count_documents({
                "sender": other,
                "receiver": email,
                "read": False
            })
        }

    return list(conversation_map.values())


@router.put("/read")
def mark_read(data: dict):

    messages.update_many(
        {
            "sender": data["sender"],
            "receiver": data["receiver"],
            "read": False
        },
        {
            "$set": {
                "read": True
            }
        }
    )

    return {
        "message": "Updated"
    }