from fastapi import APIRouter
from database import db, jobs
from bson import ObjectId

router = APIRouter()

jobs_collection = db["jobs"]


# Create Job
@router.post("/create")
def create_job(job: dict):

    job["applicants"] = 0

    jobs.insert_one(job)

    return {
        "message": "Job created successfully"
    }


# Get All Jobs
@router.get("/")
def get_jobs():

    result = []

    for job in jobs.find():

        job["_id"] = str(job["_id"])

        result.append(job)

    return result


# Update Job
@router.put("/{job_id}")
def update_job(job_id: str, data: dict):

    try:

        result = jobs_collection.update_one(
            {
                "_id": ObjectId(job_id)
            },
            {
                "$set": data
            }
        )


        print("Matched:", result.matched_count)
        print("Modified:", result.modified_count)


        if result.matched_count == 0:

            return {
                "message":"Job not found"
            }


        if result.modified_count == 0:

            return {
                "message":"No changes made"
            }


        return {
            "message":"Job updated successfully"
        }


    except Exception as e:

        print("UPDATE ERROR:",e)

        return {
            "error":str(e)
        }


# Increase Applicant Count
@router.put("/{job_id}/applicant")
def increase_applicant(job_id: str):

    result = jobs_collection.update_one(
        {
            "_id": ObjectId(job_id)
        },
        {
            "$inc": {
                "applicants": 1
            }
        }
    )

    if result.modified_count == 0:
        return {
            "message": "Job not found"
        }

    return {
        "message": "Applicant count updated"
    }


# Delete Job
@router.delete("/{job_id}")
def delete_job(job_id: str):

    result = jobs_collection.delete_one(
        {
            "_id": ObjectId(job_id)
        }
    )

    if result.deleted_count == 0:
        return {
            "message": "Job not found"
        }

    return {
        "message": "Job deleted"
    }