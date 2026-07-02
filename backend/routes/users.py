from fastapi import APIRouter
from database import users
from bson import ObjectId
from datetime import datetime

router = APIRouter()



# ==========================
# GET ALL USERS (ADMIN)
# ==========================

@router.get("/")
def get_users():

    result=[]

    for user in users.find():

        user["_id"]=str(user["_id"])

        result.append(user)


    return result





# ==========================
# GET USER PROFILE
# ==========================
@router.get("/profile")
def get_profile(email: str):

    user = users.find_one(
        {
            "email": email
        }
    )

    if not user:
        return {
            "message": "User not found"
        }

    # Get candidate application
    application = users.database["applications"].find_one(
        {
            "email": email
        }
    )

    job_id = application.get("job_id") if application else None

    # Get ATS report
    ats_score = 0

    if job_id:
        report = users.database["resume_screening"].find_one(
            {
                "email": email,
                "jobId": job_id
            }
        )

        if report:
            ats_score = report.get("atsScore", 0)

    return {

        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "status": user.get("status", "Active"),

        "skills": user.get("skills", ""),
        "experience": user.get("experience", ""),
        "location": user.get("location", ""),
        "github": user.get("github", ""),
        "portfolio": user.get("portfolio", ""),
        "about": user.get("about", ""),

        "job_id": job_id,
        "atsScore": ats_score
    }

@router.get("/activity")
def get_activity(email: str):

    activities = []

    # Resume Uploaded
    resume = users.database["resumes"].find_one({"email": email})

    if resume:
        activities.append({
            "title": "Resume Uploaded",
            "date": resume.get("uploadedAt") or resume.get("createdAt"),
            "type": "resume"
        })

    # Job Applications
    for app in users.database["applications"].find({"email": email}):

        activities.append({
            "title": f"Applied for {app.get('jobTitle','Job')}",
            "date": app.get("appliedDate"),
            "type": "application"
        })

    # Online Assessment
    for assessment in users.database["assessments"].find({
        "candidateName": resume.get("candidateName") if resume else "",
        "status": "Completed"
    }):

        activities.append({
            "title": "Completed Online Assessment",
            "date": assessment.get("submittedAt"),
            "type": "assessment"
        })

    # Video Interview
    for interview in users.database["video_interviews"].find({
        "candidateName": resume.get("candidateName") if resume else "",
        "status": "Completed"
    }):

        activities.append({
            "title": "Completed Video Interview",
            "date": interview.get("completedAt"),
            "type": "video"
        })

    activities.sort(
        key=lambda x: str(x["date"]),
        reverse=True
    )

    return activities

# ==========================
# UPDATE PROFILE
# ==========================


@router.put("/profile")
def update_profile(data:dict):

    email=data.get("email")


    users.update_one(

        {
            "email":email
        },

        {

        "$set":{

            "name":data.get("name"),
            "skills":data.get("skills"),
            "experience":data.get("experience"),
            "location":data.get("location"),
            "github":data.get("github"),
            "portfolio":data.get("portfolio"),
            "about":data.get("about")

        }

        }

    )


    return {

        "message":"Profile updated successfully"

    }







# ==========================
# ADMIN DELETE USER
# ==========================


@router.delete("/{user_id}")
def delete_user(user_id:str):


    result = users.delete_one(
        {
            "_id":ObjectId(user_id)
        }
    )


    if result.deleted_count == 0:

        return {
            "message":"User not found"
        }



    return {

        "message":"User deleted successfully"

    }








# ==========================
# ADMIN CHANGE ROLE
# ==========================


@router.put("/{user_id}/role")
def change_role(
    user_id:str,
    data:dict
):


    role=data.get("role")



    users.update_one(

        {
            "_id":ObjectId(user_id)
        },

        {

        "$set":{

            "role":role

        }

        }

    )



    return {

        "message":"Role updated"

    }








# ==========================
# ADMIN USER STATUS
# ==========================


@router.put("/{user_id}/status")
def change_status(
    user_id:str,
    data:dict
):


    status=data.get("status")



    users.update_one(

        {
            "_id":ObjectId(user_id)
        },

        {

        "$set":{

            "status":status

        }

        }

    )


    return {

        "message":"Status updated"

    }