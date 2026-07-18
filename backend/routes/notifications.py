from fastapi import APIRouter, HTTPException, Query
from database import db
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional, List
import random

router = APIRouter()

# Collections
notifications_collection = db["notifications"]
messages_collection = db["messages"]
applications_collection = db["applications"]
users_collection = db["users"]

# ==========================================
# NOTIFICATION GENERATOR FUNCTIONS (TRIGGERS)
# ==========================================

def create_notification(
    recipient_email: str,
    title: str,
    message: str,
    type: str,
    metadata: dict = None,
    action_link: str = None,
    priority: str = "medium",
    icon: str = None,
    color: str = None
):
    """Helper function to create and save a notification to the DB"""
    
    print(f"📝 Creating notification for {recipient_email}: {title}")
    
    # Default icon/color based on type
    icon_map = {
        "message": "FaEnvelope", 
        "application": "FaUserPlus", 
        "interview": "FaCalendarAlt", 
        "assessment": "FaFileAlt",
        "hire": "FaAward", 
        "job": "FaBriefcase", 
        "system": "FaInfoCircle",
        "offer": "FaCheckCircle",
        "rejection": "FaTimesCircle",
        "reminder": "FaClock",
        "feedback": "FaStar"
    }
    
    color_map = {
        "message": "#3b82f6", 
        "application": "#f59e0b", 
        "interview": "#10b981", 
        "assessment": "#8b5cf6",
        "hire": "#22c55e", 
        "job": "#ef4444", 
        "system": "#6b7280",
        "offer": "#22c55e",
        "rejection": "#ef4444",
        "reminder": "#f59e0b",
        "feedback": "#8b5cf6"
    }

    notification = {
        "recipient": recipient_email,
        "title": title,
        "message": message,
        "type": type,
        "metadata": metadata or {},
        "action_link": action_link,
        "time": datetime.utcnow(),
        "read": False,
        "priority": priority,
        "icon": icon or icon_map.get(type, "FaBell"),
        "color": color or color_map.get(type, "#e67e22")
    }
    
    # ==========================================
    # HANDLE EMAIL NOTIFICATION BASED ON PREFERENCES
    # ==========================================
    # 1. Fetch user's preferences from database
    user = users_collection.find_one({"email": recipient_email}, {"preferences": 1})
    
    # 2. Default to True if not set, otherwise use their preference
    email_enabled = user.get("preferences", {}).get("emailEnabled", True) if user else True
    
    if email_enabled:
        print(f"📧 [EMAIL] Sending email notification to {recipient_email}")
        # 👇 INSERT YOUR ACTUAL EMAIL SENDING CODE HERE 👇
        # send_email(recipient_email, title, message)
    else:
        print(f"🔇 [EMAIL] User {recipient_email} has disabled email notifications. Skipping.")


    try:
        result = notifications_collection.insert_one(notification)
        notification["_id"] = str(result.inserted_id)
        print(f"✅ Notification saved with ID: {notification['_id']}")
        return notification
    except Exception as e:
        print(f"❌ Error saving notification: {e}")
        return None


# ==========================================
# ALL NOTIFICATION TRIGGERS - Call these from your routes
# ==========================================

def trigger_new_application_notification(applicant_email: str, job_title: str, recruiter_email: str):
    """Application submitted notification - Redirects to Recruiter Candidates page"""
    return create_notification(
        recipient_email=recruiter_email,
        title="New Application Received",
        message=f"{applicant_email} applied for {job_title} position.",
        type="application",
        metadata={"candidateName": applicant_email, "jobTitle": job_title},
        action_link="/candidates",  
        priority="high"
    )

def trigger_application_status_notification(applicant_email: str, job_title: str, status: str):
    """Application status changed notification - Redirects to Recruiter Candidates page"""
    status_messages = {
        "reviewing": "Your application is being reviewed",
        "shortlisted": "Congratulations! You've been shortlisted",
        "rejected": "Your application was not selected",
        "hired": "Congratulations! You've been hired!"
    }
    return create_notification(
        recipient_email=applicant_email,
        title=f"Application {status.title()}",
        message=f"{status_messages.get(status, 'Your application status changed')} for {job_title}.",
        type="application",
        metadata={"jobTitle": job_title, "status": status},
        action_link="/candidates",
        priority="high"
    )

def trigger_new_message_notification(sender_email: str, receiver_email: str, message_preview: str):
    """New message notification"""
    return create_notification(
        recipient_email=receiver_email,
        title="New Message",
        message=f"You have a new message from {sender_email}",
        type="message",
        metadata={"sender": sender_email, "preview": message_preview[:50]},
        action_link="/messages",
        priority="medium"
    )

def trigger_interview_scheduled_notification(candidate_email: str, job_title: str, date: str, time: str = None):
    """Interview scheduled notification"""
    return create_notification(
        recipient_email=candidate_email,
        title="Interview Scheduled",
        message=f"Your interview for {job_title} has been scheduled for {date} at {time or 'TBD'}.",
        type="interview",
        metadata={"jobTitle": job_title, "interviewDate": date, "interviewTime": time},
        action_link="/interviews",
        priority="high"
    )

# ==========================================
# INTERVIEW STATUS NOTIFICATION TRIGGER
# ==========================================

def trigger_interview_status_notification(
    recipient_email: str, 
    candidate_name: str, 
    job_title: str, 
    status: str, 
    interview_id: str,
    date: str = None
):
    """Send a notification when an interview status changes"""
    
    status_messages = {
        "Scheduled": f"Your interview with {candidate_name} for {job_title} has been scheduled.",
        "Rescheduled": f"Your interview with {candidate_name} for {job_title} has been rescheduled.",
        "Cancelled": f"Your interview with {candidate_name} for {job_title} has been cancelled.",
        "Completed": f"Your interview with {candidate_name} for {job_title} has been completed."
    }
    
    status_icons = {
        "Scheduled": "FaCalendarAlt",
        "Rescheduled": "FaUndo",
        "Cancelled": "FaTimesCircle",
        "Completed": "FaCheckCircle"
    }
    
    status_colors = {
        "Scheduled": "#10b981",
        "Rescheduled": "#f59e0b",
        "Cancelled": "#ef4444",
        "Completed": "#3b82f6"
    }
    
    return create_notification(
        recipient_email=recipient_email,
        title=f"Interview {status}",
        message=status_messages.get(status, f"Your interview status has been updated to {status}."),
        type="interview",
        metadata={
            "candidateName": candidate_name,
            "jobTitle": job_title,
            "status": status,
            "interviewId": interview_id,
            "interviewDate": date
        },
        action_link="/interviews",
        priority="high",
        icon=status_icons.get(status, "FaCalendarAlt"),
        color=status_colors.get(status, "#10b981")
    )


def trigger_job_post_notification(job_title: str, company: str, target_audience: List[str]):
    """New job posted notification (for candidates)"""
    notifications = []
    for email in target_audience:
        notif = create_notification(
            recipient_email=email,
            title="New Job Opportunity",
            message=f"{company} is hiring for {job_title} position. Check it out!",
            type="job",
            metadata={"jobTitle": job_title, "company": company},
            action_link="/jobs",
            priority="medium"
        )
        notifications.append(notif)
    return notifications

def trigger_assignment_notification(student_email: str, assignment_title: str, due_date: str):
    """New assignment notification"""
    return create_notification(
        recipient_email=student_email,
        title="New Assignment",
        message=f"{assignment_title} has been assigned. Due: {due_date}",
        type="assessment",
        metadata={"assignmentTitle": assignment_title, "dueDate": due_date},
        action_link="/assignments",
        priority="high"
    )

def trigger_offer_notification(candidate_email: str, job_title: str, company: str):
    """Job offer notification"""
    return create_notification(
        recipient_email=candidate_email,
        title="Job Offer! 🎉",
        message=f"Congratulations! You've received an offer from {company} for {job_title}.",
        type="offer",
        metadata={"jobTitle": job_title, "company": company},
        action_link="/offers",
        priority="high"
    )

def trigger_reminder_notification(recipient_email: str, reminder_text: str, due_date: str):
    """Reminder notification"""
    return create_notification(
        recipient_email=recipient_email,
        title="Reminder",
        message=f"{reminder_text} (Due: {due_date})",
        type="reminder",
        metadata={"reminderText": reminder_text, "dueDate": due_date},
        action_link="/reminders",
        priority="medium"
    )

def trigger_feedback_notification(recipient_email: str, feedback_text: str, rating: int):
    """Feedback received notification"""
    return create_notification(
        recipient_email=recipient_email,
        title="Feedback Received",
        message=f"You received feedback with rating {rating}/5: '{feedback_text[:50]}...'",
        type="feedback",
        metadata={"rating": rating, "feedback": feedback_text[:50]},
        action_link="/feedback",
        priority="medium"
    )

# ==========================================
# CANDIDATE NOTIFICATION TRIGGERS
# ==========================================

def trigger_candidate_job_alert(candidate_email: str, job_title: str, company: str, job_id: str):
    """Send a notification when a new job matching their profile is posted"""
    return create_notification(
        recipient_email=candidate_email,
        title="New Job Alert! 🚀",
        message=f"{company} is hiring for {job_title}. Check it out and apply now!",
        type="job",
        metadata={
            "jobTitle": job_title, 
            "company": company,
            "jobId": job_id
        },
        action_link="/jobs",
        priority="high",
        icon="FaBriefcase",
        color="#ef4444"
    )

def trigger_candidate_application_update(candidate_email: str, job_title: str, status: str):
    """Send a notification when the application status changes"""
    status_messages = {
        "Applied": "Your application has been received.",
        "Reviewing": "Your application is currently being reviewed by the hiring team.",
        "Shortlisted": "Congratulations! You have been shortlisted for the next round!",
        "Rejected": "Unfortunately, you were not selected for this position.",
        "Selected": "Congratulations! You have been selected for this position!",
        "Hired": "Congratulations! You have been hired! 🎉"
    }
    
    return create_notification(
        recipient_email=candidate_email,
        title=f"Application Status: {status}",
        message=status_messages.get(status, f"Your application status has changed to {status}."),
        type="application",
        metadata={
            "jobTitle": job_title, 
            "status": status
        },
        action_link="/applications",
        priority="high",
        icon="FaUserPlus",
        color="#f59e0b"
    )

def trigger_candidate_interview_invite(candidate_email: str, job_title: str, date: str, time: str = None, meeting_link: str = ""):
    """Send a notification when an interview is scheduled"""
    return create_notification(
        recipient_email=candidate_email,
        title="Interview Scheduled",
        message=f"Your interview for {job_title} is scheduled for {date} at {time or 'TBD'}.",
        type="interview",
        metadata={
            "jobTitle": job_title, 
            "interviewDate": date,
            "interviewTime": time,
            "meetingLink": meeting_link
        },
        action_link="/interviews",
        priority="high",
        icon="FaCalendarAlt",
        color="#10b981"
    )

def trigger_candidate_assessment_ready(candidate_email: str, job_title: str, assessment_id: str):
    """Send a notification when an assessment is ready to be taken"""
    return create_notification(
        recipient_email=candidate_email,
        title="Assessment Ready",
        message=f"Your online assessment for {job_title} is now ready. Please complete it as soon as possible.",
        type="assessment",
        metadata={
            "jobTitle": job_title,
            "assessmentId": assessment_id
        },
        action_link="/assessments",
        priority="high",
        icon="FaFileAlt",
        color="#8b5cf6"
    )

# ==========================================
# API: GET ALL NOTIFICATIONS (WITH SEARCH)
# ==========================================
@router.get("/")
def get_notifications(
    recipient: Optional[str] = Query(None, description="Filter by recipient email"),
    type: Optional[str] = Query(None, description="Filter by notification type"),
    read: Optional[bool] = Query(None, description="Filter by read status"),
    search: Optional[str] = Query(None, description="Search in title and message"),
    limit: int = Query(50, description="Limit number of results"),
    skip: int = Query(0, description="Skip for pagination"),
    sort_by: str = Query("time", description="Sort field"),
    sort_order: int = Query(-1, description="Sort order (-1 for desc, 1 for asc)")
):
    query = {}
    
    if recipient:
        query["recipient"] = recipient
    if type:
        query["type"] = type
    if read is not None:
        query["read"] = read

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"message": {"$regex": search, "$options": "i"}}
        ]

    notifications = []
    for item in notifications_collection.find(query).sort(sort_by, sort_order).skip(skip).limit(limit):
        item["_id"] = str(item["_id"])
        if "time" in item:
            item["time"] = item["time"].isoformat()
        notifications.append(item)
    return notifications

# ==========================================
# API: GET NOTIFICATION STATS
# ==========================================
@router.get("/stats")
def get_notification_stats(recipient: str):
    """Get statistics about notifications"""
    total = notifications_collection.count_documents({"recipient": recipient})
    unread = notifications_collection.count_documents({"recipient": recipient, "read": False})
    
    # Count by type
    type_counts = notifications_collection.aggregate([
        {"$match": {"recipient": recipient}},
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ])
    
    type_stats = {item["_id"]: item["count"] for item in type_counts}
    
    return {
        "total": total,
        "unread": unread,
        "read": total - unread,
        "by_type": type_stats
    }

# ==========================================
# API: MARK SINGLE AS READ
# ==========================================
@router.put("/{id}/read")
def mark_notification_read(id: str):
    try:
        result = notifications_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"read": True}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"message": "Marked as read"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==========================================
# API: MARK ALL AS READ
# ==========================================
@router.put("/mark-all-read")
def mark_all_read(recipient: str):
    notifications_collection.update_many(
        {"recipient": recipient, "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "All marked as read"}

# ==========================================
# API: DELETE NOTIFICATION
# ==========================================
@router.delete("/{id}")
def delete_notification(id: str):
    try:
        result = notifications_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"message": "Deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==========================================
# API: DELETE ALL NOTIFICATIONS FOR A USER
# ==========================================
@router.delete("/clear-all/{recipient}")
def clear_all_notifications(recipient: str):
    result = notifications_collection.delete_many({"recipient": recipient})
    return {"message": f"Deleted {result.deleted_count} notifications"}

# ==========================================
# 🟢 NEW: MANUAL NOTIFICATION CREATION FALLBACK
# ==========================================
@router.post("/create-manual")
def create_manual_notification(data: dict):
    """Creates a notification directly without triggers (Used as fallback)"""
    return create_notification(
        recipient_email=data.get("recipient"),
        title=data.get("title"),
        message=data.get("message"),
        type=data.get("type"),
        metadata=data.get("metadata", {}),
        action_link=data.get("action_link"),
        priority=data.get("priority", "high"),
        icon=data.get("icon", "FaBell"),
        color=data.get("color", "#e67e22")
    )

# ==========================================
# API: SEED DATA FOR TESTING
# ==========================================
@router.post("/seed")
def seed_notifications(email: str):
    """Generates all types of dummy notifications for testing"""
    dummy_data = [
        # Applications
        {"type": "application", "title": "New Application", "message": "Sarah Johnson applied for Senior Developer", "color": "#f59e0b", "icon": "FaUserPlus", "metadata": {"candidateName": "Sarah Johnson", "jobTitle": "Senior Developer"}},
        {"type": "application", "title": "Application Shortlisted", "message": "Your application for UX Designer was shortlisted", "color": "#f59e0b", "icon": "FaUserPlus", "metadata": {"jobTitle": "UX Designer", "status": "shortlisted"}},
        
        # Messages
        {"type": "message", "title": "New Message", "message": "You have a new message from John Doe", "color": "#3b82f6", "icon": "FaEnvelope", "metadata": {"sender": "John Doe"}},
        
        # Interviews
        {"type": "interview", "title": "Interview Scheduled", "message": "Interview for UI/UX Designer tomorrow at 10 AM", "color": "#10b981", "icon": "FaCalendarAlt", "metadata": {"jobTitle": "UI/UX Designer", "interviewDate": "Tomorrow"}},
        
        # Jobs
        {"type": "job", "title": "New Job Opportunity", "message": "TechCorp is hiring for Full Stack Developer", "color": "#ef4444", "icon": "FaBriefcase", "metadata": {"jobTitle": "Full Stack Developer", "company": "TechCorp"}},
        
        # Assessments
        {"type": "assessment", "title": "Assignment Due", "message": "React Assessment due in 3 days", "color": "#8b5cf6", "icon": "FaFileAlt", "metadata": {"assignmentTitle": "React Assessment", "dueDate": "3 days"}},
        
        # Offers
        {"type": "offer", "title": "Job Offer! 🎉", "message": "Congratulations! You got an offer from Google", "color": "#22c55e", "icon": "FaCheckCircle", "metadata": {"jobTitle": "Software Engineer", "company": "Google"}},
        
        # System
        {"type": "system", "title": "Profile Verified", "message": "Your profile has been successfully verified", "color": "#6b7280", "icon": "FaInfoCircle"},
        
        # Reminders
        {"type": "reminder", "title": "Reminder", "message": "Complete your profile details", "color": "#f59e0b", "icon": "FaClock", "metadata": {"reminderText": "Complete profile details", "dueDate": "Tomorrow"}},
        
        # Feedback
        {"type": "feedback", "title": "Feedback Received", "message": "You received 5-star feedback from TechCorp", "color": "#8b5cf6", "icon": "FaStar", "metadata": {"rating": 5, "feedback": "Excellent work!"}},
    ]
    
    created = []
    for item in dummy_data:
        notif = create_notification(
            recipient_email=email,
            title=item["title"],
            message=item["message"],
            type=item["type"],
            metadata=item.get("metadata", {}),
            color=item["color"],
            icon=item["icon"],
            priority=random.choice(["low", "medium", "high"])
        )
        created.append(notif)
    
    return {"message": f"Created {len(created)} seed notifications", "notifications": created}

# ==========================================
# API: TEST NOTIFICATION
# ==========================================
@router.get("/test")
def test_notification():
    """Test endpoint to verify notification creation"""
    try:
        print("🧪 Testing notification creation...")
        result = create_notification(
            recipient_email="test@example.com",
            title="Test Notification",
            message="This is a test notification",
            type="system",
            metadata={"test": True},
            action_link="/test",
            priority="high",
            icon="FaInfoCircle",
            color="#6b7280"
        )
        
        if result:
            # Verify it exists in the database
            saved = notifications_collection.find_one({"_id": ObjectId(result["_id"])})
            if saved:
                return {
                    "status": "success",
                    "message": "Notification created and saved successfully",
                    "notification": {
                        "id": str(saved["_id"]),
                        "recipient": saved["recipient"],
                        "title": saved["title"],
                        "message": saved["message"],
                        "type": saved["type"]
                    }
                }
            else:
                return {
                    "status": "error",
                    "message": "Notification was created but not found in database"
                }
        else:
            return {
                "status": "error",
                "message": "Failed to create notification"
            }
    except Exception as e:
        print(f"❌ Test notification error: {e}")
        return {
            "status": "error",
            "message": f"Exception: {str(e)}"
        }