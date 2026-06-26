from fastapi import APIRouter
from database import db


router = APIRouter()


organizations = db["organizations"]



@router.get("/")
def get_organizations():

    data = list(
        organizations.find()
    )

    for org in data:
        org["_id"] = str(org["_id"])


    return data