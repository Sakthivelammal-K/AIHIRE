from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime
import re

# ==========================================
# IMPORT NOTIFICATION HELPER
# ==========================================
try:
    from .notifications import create_notification, trigger_candidate_application_update  # 🟢 IMPORT CANDIDATE TRIGGER
except ImportError:
    def create_notification(recipient_email, title, message, type, metadata=None, action_link=None, priority="medium", icon=None, color=None):
        print(f"⚠️ NOTIFICATION SKIPPED (DB helper missing): {title} - {message}")
        return None

router = APIRouter()

applications = db["applications"]
jobs_collection = db["jobs"]
users_collection = db["users"]

@router.post("/create")
def create_application(application: dict):
    print("Received Application:", application)

    application["status"] = "Applied"
    application["createdAt"] = datetime.utcnow()
    
    result = applications.insert_one(application)
    application_id = str(result.inserted_id)

    job_title = application.get("jobTitle")
    job_id = application.get("jobId")
    candidate_name = application.get("candidateName")
    candidate_email = application.get("email")

    # Update Job Applicants Count
    if job_id:
        jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$inc": {"applicationsCount": 1}}
        )

    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters Only)
    # ==========================================
    
    # Notify ALL recruiters about new application (Case insensitive)
    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title="New Application Received",
                message=f"{candidate_name} applied for {job_title} position.",
                type="application",
                metadata={
                    "candidateName": candidate_name,
                    "jobTitle": job_title,
                    "applicationId": application_id
                },
                action_link="/candidates",  
                priority="high",
                icon="FaUserPlus",
                color="#f59e0b"
            )

     # 🟢 This is the NEW part to add:
    if candidate_email:
        from .notifications import trigger_candidate_application_update
        trigger_candidate_application_update(
            candidate_email=candidate_email,
            job_title=job_title,
            status="Applied"
        )

    return {"message": "Application submitted successfully", "applicationId": application_id}

@router.get("/")
def get_applications():
    result = []
    for app in applications.find():
        app["_id"] = str(app["_id"])
        result.append(app)
    return result

@router.get("/{application_id}")
def get_application(application_id: str):
    try:
        app = applications.find_one({"_id": ObjectId(application_id)})
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        app["_id"] = str(app["_id"])
        return app
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{application_id}")
def update_application(application_id: str, data: dict):
    try:
        current_app = applications.find_one({"_id": ObjectId(application_id)})
        
        result = applications.update_one(
            {"_id": ObjectId(application_id)},
            {"$set": data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
            
        # ==========================================
        # TRIGGER NOTIFICATION FOR STATUS CHANGE (Recruiters & Candidate)
        # ==========================================
        if "status" in data and current_app:
            new_status = data["status"]
            job_title = current_app.get("jobTitle", "Job")
            candidate_name = current_app.get("candidateName")
            candidate_email = current_app.get("email")  # 🟢 FIXED: Get candidate email
            
            # 1. Notify all recruiters about status change
            all_recruiters = users_collection.find(
                {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
                {"email": 1}
            )
            for recruiter in all_recruiters:
                recruiter_email = recruiter.get("email")
                if recruiter_email:
                    create_notification(
                        recipient_email=recruiter_email,
                        title=f"Application Status Updated",
                        message=f"Application for {job_title} by {candidate_name} is now {new_status}.",
                        type="application",
                        metadata={
                            "candidateName": candidate_name,
                            "jobTitle": job_title,
                            "status": new_status,
                            "applicationId": application_id
                        },
                        action_link="/candidates",  
                        priority="medium",
                        icon="FaUserPlus",
                        color="#f59e0b"
                    )

            # 2. 🟢 NEW: Notify the Candidate about the status change
            if candidate_email:
                trigger_candidate_application_update(
                    candidate_email=candidate_email,
                    job_title=job_title,
                    status=new_status
                )

        return {"message": "Application updated"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{application_id}")
def delete_application(application_id: str):
    try:
        result = applications.delete_one({"_id": ObjectId(application_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Application not found")
        return {"message": "Application deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))