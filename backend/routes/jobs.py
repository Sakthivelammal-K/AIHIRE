from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime, timezone
import re

# ==========================================
# IMPORT NOTIFICATION HELPER
# ==========================================
try:
    from .notifications import create_notification, trigger_candidate_job_alert  # 🟢 IMPORT CANDIDATE TRIGGER
    print("✅ [JOBS] Successfully imported create_notification")
except ImportError:
    print("❌ [JOBS] Failed to import create_notification. Using fallback.")
    def create_notification(recipient_email, title, message, type, metadata=None, action_link=None, priority="medium", icon=None, color=None):
        print(f"⚠️ [JOBS] NOTIFICATION SKIPPED: {title} - {message}")
        return None

router = APIRouter()

jobs_collection = db["jobs"]
applications_collection = db["applications"]
users_collection = db["users"]

# ==========================================
# Create Job & TRIGGER NOTIFICATION
# ==========================================
@router.post("/create")
def create_job(job: dict):
    print(f"\n📝 [JOBS] Creating job: {job.get('title')}")
    
    # Ensure the frontend field exists
    job["applicationsCount"] = 0
    job["createdAt"] = datetime.now(timezone.utc)
    
    result = jobs_collection.insert_one(job)
    job_id = str(result.inserted_id)
    job_title = job.get("title", "New Job")
    company = job.get("company", "Company")

    print(f"✅ [JOBS] Job created with ID: {job_id}")

    # ==========================================
    # TRIGGER NOTIFICATIONS (Recruiters & Candidates)
    # ==========================================
    
    # 1. Find ALL recruiters (Case insensitive search)
    print(f"🔍 [JOBS] Looking for recruiters in database...")
    
    all_recruiters = users_collection.find({
        "role": {"$regex": re.compile("^recruiter$", re.IGNORECASE)}
    }, {"email": 1})
    
    recruiter_list = list(all_recruiters)
    print(f"📊 [JOBS] Found {len(recruiter_list)} recruiters.")

    sent_count = 0

    # 2. Send notifications to Recruiters
    if len(recruiter_list) > 0:
        for recruiter in recruiter_list:
            recruiter_email = recruiter.get("email")
            if recruiter_email:
                print(f"📧 [JOBS] Sending notification to recruiter: {recruiter_email}")
                
                notif_result = create_notification(
                    recipient_email=recruiter_email,
                    title="New Job Posted",
                    message=f"A new job \"{job_title}\" at {company} has been posted successfully.",
                    type="job",
                    metadata={
                        "jobTitle": job_title, 
                        "jobId": job_id,
                        "company": company
                    },
                    action_link="/recruiter/jobs",
                    priority="medium",
                    icon="FaBriefcase",
                    color="#ef4444"
                )
                
                if notif_result:
                    print(f"✅ [JOBS] Notification saved to DB with ID: {notif_result.get('_id')}")
                    sent_count += 1
                else:
                    print(f"❌ [JOBS] Notification creation failed for {recruiter_email}")
    else:
        # 🛑 FALLBACK: If no recruiters exist in DB, send to yourself for testing
        print("⚠️ [JOBS] No recruiters found in DB. Sending fallback notification to jagan@wshu.net")
        notif_result = create_notification(
            recipient_email="jagan@wshu.net",
            title="[FALLBACK] New Job Posted",
            message=f"No recruiters found in DB, but job \"{job_title}\" was created!",
            type="job",
            metadata={
                "jobTitle": job_title, 
                "jobId": job_id,
                "company": company
            },
            action_link="/recruiter/jobs",
            priority="high",
            icon="FaBriefcase",
            color="#ef4444"
        )
        if notif_result:
            sent_count += 1
            print(f"✅ [JOBS] Fallback notification saved to DB with ID: {notif_result.get('_id')}")

    # ==========================================
    # 🟢 NEW: NOTIFY ALL CANDIDATES ABOUT THE NEW JOB
    # ==========================================
    print(f"🔍 [JOBS] Looking for candidates to alert...")
    
    all_candidates = users_collection.find({
        "role": {"$regex": re.compile("^candidate$", re.IGNORECASE)}
    }, {"email": 1})
    
    candidate_list = list(all_candidates)
    print(f"📊 [JOBS] Found {len(candidate_list)} candidates.")
    
    for candidate in candidate_list:
        candidate_email = candidate.get("email")
        if candidate_email:
            print(f"📧 [JOBS] Sending job alert to candidate: {candidate_email}")
            
            trigger_candidate_job_alert(
                candidate_email=candidate_email,
                job_title=job_title,
                company=company,
                job_id=job_id
            )

    print(f"✅ [JOBS] Process complete. Sent {sent_count} recruiter notifications and {len(candidate_list)} candidate alerts.\n")

    return {
        "message": "Job created successfully", 
        "jobId": job_id,
        "notificationsSent": sent_count
    }

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
            job["_id"] = str(job["_id"])
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

        # Notify recruiters about job update
        job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        if job:
            job_title = job.get("title", "Job")
            company = job.get("company", "Company")
            
            all_recruiters = users_collection.find({"role": {"$regex": re.compile("^recruiter$", re.IGNORECASE)}}, {"email": 1})
            for recruiter in all_recruiters:
                recruiter_email = recruiter.get("email")
                if recruiter_email:
                    create_notification(
                        recipient_email=recruiter_email,
                        title="Job Updated",
                        message=f"The job posting \"{job_title}\" at {company} has been updated.",
                        type="job",
                        metadata={
                            "jobTitle": job_title,
                            "company": company,
                            "jobId": job_id
                        },
                        action_link="/recruiter/jobs",
                        priority="medium",
                        icon="FaBriefcase",
                        color="#ef4444"
                    )

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
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    
    result = jobs_collection.delete_one({"_id": ObjectId(job_id)})

    if result.deleted_count == 0:
        return {"message": "Job not found"}

    # Notify recruiters about job removal
    if job:
        job_title = job.get("title", "Job")
        company = job.get("company", "Company")
        
        all_recruiters = users_collection.find({"role": {"$regex": re.compile("^recruiter$", re.IGNORECASE)}}, {"email": 1})
        for recruiter in all_recruiters:
            recruiter_email = recruiter.get("email")
            if recruiter_email:
                create_notification(
                    recipient_email=recruiter_email,
                    title="Job Removed",
                    message=f"The job posting \"{job_title}\" at {company} has been removed.",
                    type="system",
                    metadata={
                        "jobTitle": job_title,
                        "company": company
                    },
                    priority="low",
                    icon="FaInfoCircle",
                    color="#6b7280"
                )

    return {"message": "Job deleted"}