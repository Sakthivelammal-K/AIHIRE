from fastapi import APIRouter
from database import users
from utils.security import hash_password, create_token, verify_password


router = APIRouter()

@router.post("/register")
def register(user: dict):

    user["password"] = hash_password(
        user["password"]
    )

    users.insert_one(user)

    return {
        "message":"User registered successfully"
    }



@router.post("/login")
def login(user: dict):

    existing_user = users.find_one(
        {
            "email": user["email"]
        }
    )


    if not existing_user:

        return {
            "error":"User not found"
        }



    if not verify_password(
        user["password"],
        existing_user["password"]
    ):

        return {
            "error":"Invalid password"
        }



    token = create_token(
        {
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )


    return {

        "message":"Login successful",

        "token":token,

        "role":existing_user["role"],

        "username": existing_user.get("name"),

        "email": existing_user["email"]

    }

@router.post("/forgot-password")
def forgot_password(data: dict):

    email = data.get("email")


    user = users.find_one({
        "email": email
    })


    if not user:
        return {
            "message":"Email not found"
        }


    # later connect email service here

    return {
        "message":"Password reset link sent to your email"
    }