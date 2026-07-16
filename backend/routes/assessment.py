from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime
import re

router = APIRouter(
    prefix="/assessments",
    tags=["Assessment"]
)

assessments = db["assessments"]
users_collection = db["users"]

# ==========================================
# IMPORT NOTIFICATION HELPER
# ==========================================
try:
    from .notifications import create_notification, trigger_candidate_assessment_ready  # 🟢 IMPORT CANDIDATE TRIGGER
except ImportError:
    def create_notification(recipient_email, title, message, type, metadata=None, action_link=None, priority="medium", icon=None, color=None):
        print(f"⚠️ NOTIFICATION SKIPPED (DB helper missing): {title} - {message}")
        return None

# ===========================
# Get all completed assessments
# ===========================
@router.get("/results")
def get_results():
    results = []
    for assessment in assessments.find({"status": "Completed"}):
        jobTitle = assessment.get("jobTitle")
        if not jobTitle:
            jobId = assessment.get("jobId")
            if jobId:
                job = db.jobs.find_one({"_id": ObjectId(jobId)})
                if job:
                    jobTitle = job.get("title")
        assessment["jobTitle"] = jobTitle or "-"
        assessment["_id"] = str(assessment["_id"])
        results.append(assessment)
    return results

# ===========================
# Get one completed assessment
# ===========================
@router.get("/result/{candidate_name}")
def get_candidate_result(candidate_name: str):
    assessment = assessments.find_one({
        "candidateName": candidate_name,
        "status": "Completed"
    })
    if not assessment:
        return {}
    assessment["_id"] = str(assessment["_id"])
    return assessment

# ===========================
# Submit assessment
# ===========================
@router.put("/{id}/submit")
def submit_assessment(id: str, data: dict):
    assessment = assessments.find_one({"_id": ObjectId(id)})
    if not assessment:
        return {"message": "Assessment not found"}

    answers = data.get("answers", [])
    score = 0
    
    for index, answer in enumerate(answers):
        if index < len(assessment["questions"]):
            if answer == assessment["questions"][index]["answer"]:
                score += 1

    percentage = int((score / len(assessment["questions"])) * 100) if assessment["questions"] else 0

    jobTitle = assessment.get("jobTitle", "")
    jobId = assessment.get("jobId", None)
    candidate_name = assessment.get("candidateName")

    # if old assessment has no job details
    if not jobTitle:
        application = db["applications"].find_one({"candidateName": assessment["candidateName"]})
        if application:
            jobId = application.get("jobId")
            if jobId:
                job = db["jobs"].find_one({"_id": ObjectId(jobId)})
                if job:
                    jobTitle = job.get("title", "")

    assessments.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "answers": answers,
                "score": percentage,
                "jobId": jobId,
                "jobTitle": jobTitle,
                "status": "Completed",
                "submittedAt": datetime.utcnow()
            }
        }
    )

    # Update scheduled interview status
    db["interviews"].update_one(
        {
            "candidateName": assessment["candidateName"],
            "jobTitle": jobTitle,
            "type": "Online Assessment"
        },
        {"$set": {"status": "Completed"}}
    )

    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters Only)
    # ==========================================
    
    # Notify all recruiters about completed assessment (Case insensitive)
    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title="Assessment Completed",
                message=f"{candidate_name} completed the online assessment for {jobTitle}. Score: {percentage}%",
                type="assessment",
                metadata={
                    "candidateName": candidate_name,
                    "jobTitle": jobTitle,
                    "score": percentage,
                    "assessmentId": id
                },
                action_link="/results",
                priority="medium",
                icon="FaFileAlt",
                color="#8b5cf6"
            )

    return {"score": percentage, "message": "Assessment completed"}

# ===========================
# Get/Create assessment
# ===========================
@router.get("/{username}")
def get_assessment(username: str):
    assessment = assessments.find_one({
        "candidateName": username,
        "status": "Pending"
    })

    if assessment:
        assessment["_id"] = str(assessment["_id"])
        return assessment

    # find application of candidate
    application = db["applications"].find_one({"candidateName": username})

    jobTitle = ""
    jobId = None

    if application:
        jobId = application.get("jobId") or application.get("job_id")
        jobTitle = application.get("jobTitle", "")
        if not jobTitle and jobId:
            job = db["jobs"].find_one({"_id": ObjectId(jobId)})
            if job:
                jobTitle = job.get("title", "")

    questions = [
        {
            "question": "What is React?",
            "options": ["Library", "Database", "Language", "OS"],
            "answer": "Library"
        },
        {
            "question": "What is MongoDB?",
            "options": ["SQL Database", "NoSQL Database", "Framework", "Browser"],
            "answer": "NoSQL Database"
        },
        {
            "question": "FastAPI is built using?",
            "options": ["Python", "Java", "C++", "PHP"],
            "answer": "Python"
        }
    ]

    result = {
        "candidateName": username,
        "jobId": jobId,
        "jobTitle": jobTitle,
        "type": "Online Assessment",
        "questions": questions,
        "status": "Pending",
        "createdAt": datetime.utcnow()
    }

    inserted = assessments.insert_one(result)
    result["_id"] = str(inserted.inserted_id)
    
    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters & Candidate)
    # ==========================================
    
    # 1. Notify recruiters that assessment is available (Case insensitive)
    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title="New Assessment Available",
                message=f"An assessment for {username} for {jobTitle or 'the position'} is ready.",
                type="assessment",
                metadata={
                    "candidateName": username,
                    "jobTitle": jobTitle or "the position",
                    "assessmentId": result["_id"]
                },
                action_link="/results",
                priority="medium",
                icon="FaFileAlt",
                color="#8b5cf6"
            )

    # 2. 🟢 NEW: Notify the Candidate about the assessment
    candidate_email = application.get("email") if application else None
    if candidate_email:
        trigger_candidate_assessment_ready(
            candidate_email=candidate_email,
            job_title=jobTitle,
            assessment_id=str(inserted.inserted_id)
        )

    return result

# ===========================
# Review assessment
# ===========================
@router.put("/{id}/review")
def review_assessment(id: str, data: dict):
    assessment = assessments.find_one({"_id": ObjectId(id)})
    if not assessment:
        raise HTTPException(404, "Assessment not found")

    assessments.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "recruiterComment": data.get("recruiterComment"),
                "recruiterRating": data.get("recruiterRating"),
                "finalDecision": data.get("finalDecision")
            }
        }
    )

    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters Only)
    # ==========================================
    candidate_name = assessment.get("candidateName")
    job_title = assessment.get("jobTitle", "the position")
    decision = data.get("finalDecision", "Pending")

    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title=f"Assessment Review: {decision}",
                message=f"{candidate_name}'s assessment for {job_title} has been reviewed. Decision: {decision}",
                type="assessment",
                metadata={
                    "candidateName": candidate_name,
                    "jobTitle": job_title,
                    "decision": decision,
                    "assessmentId": id
                },
                action_link="/results",
                priority="medium",
                icon="FaCheckCircle" if decision == "Selected" else "FaFileAlt",
                color="#22c55e" if decision == "Selected" else "#8b5cf6"
            )

    return {"message": "Assessment review saved"}