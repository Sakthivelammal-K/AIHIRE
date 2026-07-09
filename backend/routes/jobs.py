from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId

router = APIRouter()

jobs_collection = db["jobs"]
applications_collection = db["applications"]

# ==========================================
# Create Job
# ==========================================
@router.post("/create")
def create_job(job: dict):
    # Ensure the frontend field exists
    job["applicationsCount"] = 0
    jobs_collection.insert_one(job)
    return {"message": "Job created successfully"}


# ==========================================
# Get All Jobs (WITH REAL-TIME COUNTS)
# ==========================================
@router.get("/")
def get_jobs():
    try:
        pipeline = [
            {
                "$lookup": {
                    "from": "applications",
                    "localField": "_id",
                    "foreignField": "jobId",
                    "as": "applicationsData"
                }
            },
            {
                "$addFields": {
                    "applicationsCount": {"$size": "$applicationsData"}
                }
            },
            {
                "$project": {
                    "applicationsData": 0
                }
            }
        ]

        result = []
        for job in jobs_collection.aggregate(pipeline):
            # Convert MongoDB ObjectId to string for JSON
            job["_id"] = str(job["_id"])
            
            # Force conversions to integers so React doesn't get confused
            if "applicationsCount" not in job:
                job["applicationsCount"] = 0
            else:
                job["applicationsCount"] = int(job["applicationsCount"])

            result.append(job)

        return result

    except Exception as e:
        print(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")


# ==========================================
# Get Single Job
# ==========================================
@router.get("/{job_id}")
def get_job(job_id: str):
    try:
        pipeline = [
            {"$match": {"_id": ObjectId(job_id)}},
            {
                "$lookup": {
                    "from": "applications",
                    "localField": "_id",
                    "foreignField": "jobId",
                    "as": "applicationsData"
                }
            },
            {
                "$addFields": {
                    "applicationsCount": {"$size": "$applicationsData"}
                }
            },
            {
                "$project": {
                    "applicationsData": 0
                }
            }
        ]

        job = list(jobs_collection.aggregate(pipeline))
        
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
            
        job = job[0]
        job["_id"] = str(job["_id"])
        job["applicationsCount"] = int(job["applicationsCount"])
        
        return job

    except Exception as e:
        print(f"Error fetching job: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch job")


# ==========================================
# Update Job
# ==========================================
@router.put("/{job_id}")
def update_job(job_id: str, data: dict):
    try:
        if "_id" in data:
            del data["_id"]
            
        result = jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": data}
        )

        if result.matched_count == 0:
            return {"message": "Job not found"}

        if result.modified_count == 0:
            return {"message": "No changes made"}

        return {"message": "Job updated successfully"}

    except Exception as e:
        print("UPDATE ERROR:", e)
        return {"error": str(e)}


# ==========================================
# Increase Applicant Count
# ==========================================
@router.put("/{job_id}/applicant")
def increase_applicant(job_id: str):
    result = jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$inc": {"applicationsCount": 1}}
    )

    if result.modified_count == 0:
        return {"message": "Job not found"}

    return {"message": "Applicant count updated"}


# ==========================================
# Delete Job
# ==========================================
@router.delete("/{job_id}")
def delete_job(job_id: str):
    result = jobs_collection.delete_one({"_id": ObjectId(job_id)})

    if result.deleted_count == 0:
        return {"message": "Job not found"}

    return {"message": "Job deleted"}