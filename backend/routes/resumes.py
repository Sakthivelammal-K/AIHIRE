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

@router.delete("/{email}")
def delete_resume(email:str):


    result = resumes.delete_one(
        {
            "email": email
        }
    )


    if result.deleted_count == 1:

        return {
            "message":"Resume deleted successfully"
        }


    return {
        "message":"Resume not found"
    }