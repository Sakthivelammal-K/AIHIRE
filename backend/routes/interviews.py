from fastapi import APIRouter
from database import db

router = APIRouter()

interviews = db["interviews"]

@router.post("/create")
def create_interview(data:dict):
    interviews.insert_one(data)

    return{
        "message":"Interview scheduled"
    }

@router.get("/")
def get_interviews():

    result=[]

    for item in interviews.find():
        item["_id"]=str(item["_id"])
        result.append(item)
    return result