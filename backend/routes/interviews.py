from fastapi import APIRouter
from database import db
from bson import ObjectId
from datetime import datetime
import re

# ==========================================
# IMPORT NOTIFICATION HELPER
# ==========================================
try:
    from .notifications import create_notification, trigger_candidate_interview_invite  # 🟢 IMPORT CANDIDATE TRIGGER
except ImportError:
    def create_notification(recipient_email, title, message, type, metadata=None, action_link=None, priority="medium", icon=None, color=None):
        print(f"⚠️ NOTIFICATION SKIPPED (DB helper missing): {title} - {message}")
        return None

router = APIRouter()

interviews = db["interviews"]
users_collection = db["users"]

# ==========================================
# CREATE SCHEDULED INTERVIEW
# ==========================================
@router.post("/create")
def create_interview(data: dict):
    interview = {
        "candidateName": data.get("candidateName"),
        "candidateEmail": data.get("candidateEmail"),
        "jobTitle": data.get("jobTitle"),
        "applicationId": data.get("applicationId"),
        "date": data.get("date"),
        "time": data.get("time", "TBD"),
        "type": data.get("type", "Interview"),
        "status": "Scheduled",
        "meetingLink": data.get("meetingLink", ""),
        "instructions": data.get("instructions", ""),
        "notes": "",
        "createdAt": datetime.utcnow()
    }

    result = interviews.insert_one(interview)
    interview_id = str(result.inserted_id)

    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters & Candidate)
    # ==========================================
    
    candidate_name = data.get("candidateName")
    candidate_email = data.get("candidateEmail")  # 🟢 FIXED: Get candidate email
    job_title = data.get("jobTitle")
    interview_date = data.get("date")
    interview_time = data.get("time", "TBD")
    meeting_link = data.get("meetingLink", "")

    # 1. Notify all recruiters about scheduled interview (Case insensitive)
    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title="Interview Scheduled",
                message=f"Interview for {candidate_name} for {job_title} scheduled for {interview_date} at {interview_time}.",
                type="interview",
                metadata={
                    "candidateName": candidate_name,
                    "jobTitle": job_title,
                    "interviewDate": interview_date,
                    "interviewTime": interview_time,
                    "interviewId": interview_id
                },
                action_link="/interviews",
                priority="high",
                icon="FaCalendarAlt",
                color="#10b981"
            )

    # 2. 🟢 NEW: Notify the Candidate about the interview
    if candidate_email:
        trigger_candidate_interview_invite(
            candidate_email=candidate_email,
            job_title=job_title,
            date=interview_date,
            time=interview_time,
            meeting_link=meeting_link
        )

    return {"message": "Interview scheduled", "interviewId": interview_id}

# ==========================================
# SAVE AI RESULT
# ==========================================
@router.post("/result")
def save_result(data: dict):
    result = {
        "candidateName": data.get("candidateName"),
        "candidateEmail": data.get("candidateEmail"),
        "jobTitle": data.get("jobTitle"),
        "type": "AI Interview",
        "technical": data.get("technical", 0),
        "communication": data.get("communication", 0),
        "confidence": data.get("confidence", 0),
        "overall": data.get("overall", 0),
        "verdict": data.get("verdict", "Pending"),
        "strengths": data.get("strengths", []),
        "improvements": data.get("improvements", []),
        "recruiterComment": "",
        "recruiterRating": 0,
        "finalDecision": "",
        "createdAt": datetime.utcnow()
    }

    interviews.insert_one(result)
    
    # ==========================================
    # TRIGGER NOTIFICATION (Recruiters Only)
    # ==========================================
    candidate_name = data.get("candidateName")
    job_title = data.get("jobTitle")
    overall_score = data.get("overall", 0)

    all_recruiters = users_collection.find(
        {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
        {"email": 1}
    )
    for recruiter in all_recruiters:
        recruiter_email = recruiter.get("email")
        if recruiter_email:
            create_notification(
                recipient_email=recruiter_email,
                title="AI Interview Results Ready",
                message=f"AI interview results for {candidate_name} for {job_title} are ready. Overall score: {overall_score}%.",
                type="assessment",
                metadata={
                    "candidateName": candidate_name,
                    "jobTitle": job_title,
                    "score": overall_score
                },
                action_link="/results",
                priority="medium",
                icon="FaFileAlt",
                color="#8b5cf6"
            )

    return {"message": "AI Result saved"}

# ==========================================
# GET SCHEDULED INTERVIEWS
# ==========================================
@router.get("/")
def get_interviews():
    scheduled = []
    for item in interviews.find():
        if item.get("type") == "AI Interview":
            continue
        item["_id"] = str(item["_id"])
        scheduled.append(item)
    return {"scheduled": scheduled}

# ==========================================
# COMBINED RESULTS
# ==========================================
@router.get("/results")
def get_results():
    results = []
    # VIDEO INTERVIEW RESULTS
    for item in db["video_interviews"].find({"status": "Completed"}):
        interview = interviews.find_one({
            "candidateName": item.get("candidateName"),
            "jobTitle": item.get("jobTitle"),
            "type": "Video Interview"
        })
        results.append({
            "_id": str(item["_id"]),
            "candidateName": item.get("candidateName"),
            "candidateEmail": item.get("candidateEmail"),
            "jobTitle": item.get("jobTitle"),
            "type": "Video Interview",
            "technical": item.get("technical", 0),
            "communication": item.get("communication", 0),
            "confidence": item.get("confidence", 0),
            "overall": item.get("overall", 0),
            "verdict": interview.get("finalDecision", "Pending") if interview else "Pending",
            "strengths": item.get("strengths", []),
            "improvements": item.get("improvements", []),
            "videoPath": item.get("videoPath", ""),
            "answers": item.get("answers", []),
            "violations": item.get("violations", 0)
        })

    # ONLINE ASSESSMENT RESULTS
    for assessment in db["assessments"].find({"status": "Completed"}):
        interview = interviews.find_one({
            "candidateName": assessment.get("candidateName"),
            "jobTitle": assessment.get("jobTitle"),
            "type": "Online Assessment"
        })
        results.append({
            "_id": str(assessment["_id"]),
            "candidateName": assessment.get("candidateName"),
            "candidateEmail": assessment.get("candidateEmail"),
            "jobTitle": assessment.get("jobTitle"),
            "type": "Online Assessment",
            "overall": assessment.get("score", 0),
            "score": assessment.get("score", 0),
            "answers": assessment.get("answers", []),
            "questions": assessment.get("questions", []),
            "verdict": interview.get("finalDecision", "Pending") if interview else "Pending"
        })
    return results

# ==========================================
# UPDATE INTERVIEW + SAVE RECRUITER REVIEW
# ==========================================
@router.put("/result/{id}")
def update_interview(id: str, data: dict):
    update = {}
    if "type" in data: update["type"] = data.get("type")
    if "status" in data: update["status"] = data.get("status")
    if "meetingLink" in data: update["meetingLink"] = data.get("meetingLink")
    if "instructions" in data: update["instructions"] = data.get("instructions")
    if "notes" in data: update["notes"] = data.get("notes")
    if "recruiterComment" in data: update["recruiterComment"] = data.get("recruiterComment", "")
    if "recruiterRating" in data: update["recruiterRating"] = data.get("recruiterRating", 0)
    if "finalDecision" in data: update["finalDecision"] = data.get("finalDecision", "")
    if "interviewType" in data: update["interviewType"] = data.get("interviewType")
    if "date" in data: update["date"] = data.get("date")
    if "duration" in data: update["duration"] = data.get("duration")
    if "mode" in data: update["mode"] = data.get("mode")
    if "interviewers" in data: update["interviewers"] = data.get("interviewers")
    if "rounds" in data: update["rounds"] = data.get("rounds")
    update["updatedAt"] = datetime.utcnow()

    result = interviews.update_one({"_id": ObjectId(id)}, {"$set": update})
    if result.matched_count == 0:
        return {"message": "Interview not found"}

    interview = interviews.find_one({"_id": ObjectId(id)})
    
    # ==========================================
    # TRIGGER NOTIFICATION FOR DECISION CHANGE (Recruiters Only)
    # ==========================================
    if interview and "finalDecision" in data:
        decision = data.get("finalDecision")
        candidate_name = interview.get("candidateName")
        job_title = interview.get("jobTitle")
        
        all_recruiters = users_collection.find(
            {"role": {"$regex": "^recruiter$", "$options": "i"}}, 
            {"email": 1}
        )
        for recruiter in all_recruiters:
            recruiter_email = recruiter.get("email")
            if recruiter_email:
                create_notification(
                    recipient_email=recruiter_email,
                    title=f"Application Decision: {decision}",
                    message=f"{candidate_name}'s application for {job_title} is now {decision}.",
                    type="hire" if decision == "Selected" else "application",
                    metadata={
                        "candidateName": candidate_name,
                        "jobTitle": job_title,
                        "decision": decision,
                        "interviewId": id
                    },
                    action_link="/applications",
                    priority="high",
                    icon="FaCheckCircle" if decision == "Selected" else "FaTimesCircle",
                    color="#22c55e" if decision == "Selected" else "#ef4444"
                )

    # Update application status if decision was made
    if interview and interview.get("applicationId"):
        application_id = interview["applicationId"]
        decision = data.get("finalDecision")
        status = None
        if decision == "Selected": status = "Selected"
        elif decision == "Rejected": status = "Rejected"
        elif decision == "Hold": status = "Hold"
        if status:
            db["applications"].update_one(
                {"_id": ObjectId(application_id)},
                {"$set": {"status": status}}
            )

    return {"message": "Interview updated"}

# ==========================================
# DEBUG ROUTE
# ==========================================
@router.get("/ping")
def ping():
    return {"status": "alive"}