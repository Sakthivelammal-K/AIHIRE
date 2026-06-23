from fastapi import APIRouter
from database import db
from bson import ObjectId


router = APIRouter()


resumes = db["resumes"]



# Save resume analysis
@router.post("/create")
def create_resume(resume: dict):

    resumes.insert_one(resume)

    return {
        "message": "Resume saved successfully"
    }




# Get all resumes
@router.get("/")
def get_resumes():

    result = []

    for resume in resumes.find():

        resume["_id"] = str(resume["_id"])

        result.append(resume)


    return result




# Get resume by email
@router.get("/{email}")
def get_resume(email: str):

    resume = resumes.find_one(
        {
            "email": email
        }
    )


    if not resume:

        return {
            "message": "Resume not found"
        }


    resume["_id"] = str(resume["_id"])


    return resume




# Update resume
@router.put("/{resume_id}")
def update_resume(
    resume_id: str,
    data: dict
):

    resumes.update_one(
        {
            "_id": ObjectId(resume_id)
        },
        {
            "$set": data
        }
    )


    return {
        "message": "Resume updated"
    }