from fastapi import APIRouter
from database import db


router = APIRouter()


resumes=db["resumes"]



@router.post("/upload")
def upload_resume(data:dict):

    resumes.insert_one(data)

    return {
        "message":"Resume uploaded"
    }



@router.get("/{email}")
def get_resume(email:str):

    resume=resumes.find_one(
        {
            "email":email
        }
    )


    if resume:

        resume["_id"]=str(
            resume["_id"]
        )


        return resume


    return {}