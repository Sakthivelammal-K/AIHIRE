from fastapi import APIRouter
from database import users
from utils.security import hash_password, create_token, verify_password
from datetime import datetime, timedelta 
import secrets
from passlib.context import CryptContext


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

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)



@router.post("/forgot-password")
def forgot_password(data: dict):

    email = data.get("email")


    user = users.find_one({
        "email": email
    })


    if not user:
        return {
            "message":"Email not registered"
        }


    token = secrets.token_urlsafe(32)


    users.update_one(
        {
            "email":email
        },
        {
            "$set":{
                "reset_token":token,
                "reset_expiry":
                datetime.utcnow()+timedelta(minutes=15)
            }
        }
    )


    reset_link = (
        f"http://localhost:5173/reset-password/{token}"
    )


    print(
        "RESET LINK:",
        reset_link
    )


    return {
        "message":
        "Reset link generated successfully"
    }




@router.post("/reset-password")
def reset_password(data:dict):


    token=data.get("token")
    password=data.get("password")


    user = users.find_one({
        "reset_token":token
    })


    if not user:
        return {
            "message":"Invalid reset link"
        }


    if user["reset_expiry"] < datetime.utcnow():

        return {
            "message":"Reset link expired"
        }



    hashed_password = pwd_context.hash(password)



    users.update_one(
        {
            "_id":user["_id"]
        },
        {
            "$set":{
                "password":hashed_password
            },
            "$unset":{
                "reset_token":"",
                "reset_expiry":""
            }
        }
    )


    return {
        "message":
        "Password changed successfully"
    }