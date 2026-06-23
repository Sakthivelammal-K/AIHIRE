from fastapi import APIRouter
from database import db
from database import jobs
from bson import ObjectId


router = APIRouter()

jobs_collection = db["jobs"]

@router.post("/create")
def create_job(job: dict):

    jobs.insert_one(job)

    return {
        "message":"Job created successfully"
    }




@router.get("/")
def get_jobs():

    result=[]

    for job in jobs.find():

        job["_id"] = str(job["_id"])

        result.append(job)


    return result


@router.put("/{job_id}")
def update_job(job_id: str, data: dict):

    result = jobs_collection.update_one(
        {
            "_id": ObjectId(job_id)
        },
        {
            "$set": data
        }
    )

    if result.modified_count == 0:
        return {
            "message": "No changes made"
        }

    return {
        "message": "Job updated successfully"
    }

@router.delete("/{job_id}")
async def delete_job(job_id:str):

    result = jobs_collection.delete_one(
        {"_id": ObjectId(job_id)}
    )

    if result.deleted_count == 0:
        return {
            "message":"Job not found"
        }

    return {
        "message":"Job deleted"
    }