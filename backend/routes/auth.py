from fastapi import APIRouter, HTTPException
from database import users
from utils.security import hash_password, create_token, verify_password
from datetime import datetime, timedelta
import secrets

router = APIRouter()


# ==========================
# REGISTER
# ==========================

@router.post("/register")
def register(user: dict):

    name = user.get("name", "").strip()
    email = user.get("email", "").strip().lower()
    password = user.get("password", "")
    role = user.get("role", "").strip()

    if not name or not email or not password or not role:
        raise HTTPException(
            status_code=400,
            detail="All fields are required"
        )

    existing_user = users.find_one(
        {
            "email": email
        }
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_data = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "role": role,
        "created_at": datetime.utcnow()
    }

    users.insert_one(user_data)

    return {
        "message": "User registered successfully"
    }


# ==========================
# LOGIN
# ==========================

@router.post("/login")
def login(user: dict):

    email = user.get("email", "").strip().lower()
    password = user.get("password", "")

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required"
        )

    existing_user = users.find_one(
        {
            "email": email
        }
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_token(
        {
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {
        "message": "Login successful",
        "token": token,
        "role": existing_user["role"],
        "username": existing_user.get("name"),
        "email": existing_user["email"]
    }


# ==========================
# FORGOT PASSWORD
# ==========================

@router.post("/forgot-password")
def forgot_password(data: dict):

    email = data.get("email", "").strip().lower()

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    user = users.find_one(
        {
            "email": email
        }
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email not registered"
        )

    token = secrets.token_urlsafe(32)

    expiry = datetime.utcnow() + timedelta(minutes=15)

    users.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "reset_token": token,
                "reset_expiry": expiry
            }
        }
    )

    reset_link = f"http://localhost:5173/reset-password/{token}"

    # TODO:
    # Replace this print with email sending.
    print("RESET LINK:", reset_link)

    return {
        "message": "Password reset link sent successfully",
        "reset_link": reset_link
    }


# ==========================
# RESET PASSWORD
# ==========================

@router.post("/reset-password")
def reset_password(data: dict):

    token = data.get("token")
    password = data.get("password")

    if not token or not password:
        raise HTTPException(
            status_code=400,
            detail="Token and password are required"
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user = users.find_one(
        {
            "reset_token": token
        }
    )

    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset link"
        )

    if user.get("reset_expiry") < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Reset link has expired"
        )

    users.update_one(
        {
            "_id": user["_id"]
        },
        {
            "$set": {
                "password": hash_password(password)
            },
            "$unset": {
                "reset_token": "",
                "reset_expiry": ""
            }
        }
    )

    return {
        "message": "Password changed successfully"
    }