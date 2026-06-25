from fastapi import APIRouter
from database import users


router = APIRouter()

@router.get("/")
def get_users():
    result=[]

    for user in users.find():
        user["_id"]=str(user["_id"])
        result.append(user)

    return result

@router.get("/profile")
def get_profile(email: str):

    user = users.find_one(
        {
            "email": email
        }
    )

    if not user:
        return {
            "message": "User not found"
        }


    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role")
    }

@router.put("/profile")
def update_profile(data: dict):

    email = data.get("email")

    users.update_one(
        {"email": email},
        {
            "$set": {
                "name": data.get("name"),
                "skills": data.get("skills"),
                "experience": data.get("experience"),
                "location": data.get("location"),
                "github": data.get("github"),
                "portfolio": data.get("portfolio"),
                "about": data.get("about")
            }
        }
    )

    return {
        "message": "Profile updated successfully"
    }