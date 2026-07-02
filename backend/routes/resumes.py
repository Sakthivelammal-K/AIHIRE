from fastapi import APIRouter, UploadFile, File, Form
from database import db,jobs
import os
from pypdf import PdfReader
from bson import ObjectId
from datetime import datetime


router = APIRouter()


resumes=db["resumes"]
screenings=db["resume_screening"]
applications=db["applications"]

UPLOAD_FOLDER = "uploads/resumes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
def extract_pdf_text(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:

        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text

KNOWN_SKILLS = [

    "React",
    "JavaScript",
    "Python",
    "FastAPI",
    "MongoDB",
    "HTML",
    "CSS",
    "Node.js",
    "Express",
    "Java",
    "C",
    "C++",
    "SQL",
    "MySQL",
    "Git",
    "GitHub"

]

def extract_skills(resume_text):

    matched_skills = []

    resume_text = resume_text.lower()

    for skill in KNOWN_SKILLS:

        if skill.lower() in resume_text:

            matched_skills.append(skill)

    return matched_skills

def normalize_skill(skill):

    skill = skill.lower().strip()

    replacements = {
        "react.js": "react",
        "node": "node.js",
        "nodejs": "node.js",
        "js": "javascript",
        "rest api": "rest apis",
        "restful api": "rest apis"
    }

    return replacements.get(skill, skill)


@router.post("/upload")
async def upload_resume(
    email: str = Form(...),
    file: UploadFile = File(...)
):

    # Create unique filename
    filename = f"{email}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    # Save uploaded PDF
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Extract resume text
    resume_text = extract_pdf_text(file_path)

    # Extract skills
    skills = extract_skills(resume_text)

    print(resume_text)
    print("Detected Skills:", skills)

    # Save or update resume in MongoDB
    resumes.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "email": email,
                "resumeName": file.filename,
                "resumePath": file_path,
                "resumeText": resume_text,
                "skills": skills,
                "uploadedAt":datetime.utcnow() 
           }
        },
        upsert=True
    )

    return {
        "message": "Resume uploaded successfully",
        "email": email,
        "resumeName": file.filename,
        "skills": skills
    }


@router.get("/{email}")
def get_resume(email:str):

    resume=resumes.find_one(
        {
            "email":email
        }
    )


    if resume:

        resume["_id"]=str(
            resume["_id"]
        )


        return resume


    return {}

@router.delete("/{email}")
def delete_resume(email:str):


    result = resumes.delete_one(
        {
            "email": email
        }
    )


    if result.deleted_count == 1:

        return {
            "message":"Resume deleted successfully"
        }


    return {
        "message":"Resume not found"
    }

    
@router.post("/screen")
def screen_resume(data: dict):

    email = data["email"]
    job_id = data["jobId"]

    # Find candidate resume
    resume = resumes.find_one(
        {
            "email": email
        }
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    # Find job
    job = jobs.find_one(
        {
            "_id": ObjectId(job_id)
        }
    )

    if not job:
        return {
            "message": "Job not found"
        }

    # Convert required skills string into list
    required_skills = [
        skill.strip()
        for skill in job["requiredSkills"].split(",")
    ]

    # Candidate skills
    candidate_skills = resume["skills"]

    # Matched skills
    candidate_normalized = [
    normalize_skill(skill)
    for skill in candidate_skills
]

    matched_skills = []

    for skill in required_skills:

        if normalize_skill(skill) in candidate_normalized:

            matched_skills.append(skill)

    # Missing skills
    missing_skills = []

    for skill in required_skills:

        if normalize_skill(skill) not in candidate_normalized:

            missing_skills.append(skill)

    # ATS Score
    if len(required_skills) > 0:

        ats_score = int(
            (len(matched_skills) / len(required_skills)) * 100
        )

    else:

        ats_score = 0

    # Recommendation
    if ats_score >= 80:
        recommendation = "Highly Recommended"
    elif ats_score >= 60:
        recommendation = "Recommended"
    elif ats_score >= 40:
        recommendation = "Needs Improvement"
    else:
        recommendation = "Not Recommended"

    # Save screening result
    screenings.update_one(
        {
            "email": email,
            "jobId": job_id
        },
        {
            "$set": {
                "email": email,
                "jobId": job_id,
                "jobTitle": job["title"],
                "candidateSkills": candidate_skills,
                "requiredSkills": required_skills,
                "matchedSkills": matched_skills,
                "missingSkills": missing_skills,
                "atsScore": ats_score,
                "recommendation": recommendation
            }
        },
        upsert=True
    )

    return {

        "candidateSkills": candidate_skills,

        "requiredSkills": required_skills,

        "matchedSkills": matched_skills,

        "missingSkills": missing_skills,

        "atsScore": ats_score,

        "recommendation": recommendation

    }

@router.get("/screening/{email}")
def get_latest_screening(email: str):

    report = screenings.find_one(
        {"email": email},
        sort=[("_id", -1)]   # latest screening
    )

    if not report:
        return {}

    report["_id"] = str(report["_id"])

    return report


@router.get("/report/{job_id}/{email}")
def get_resume_report(job_id: str, email: str):

    report = screenings.find_one({
        "jobId": str(job_id),
        "email": email.strip().lower()
    })

    if not report:
        return {"message": "Report not found"}

    report["_id"] = str(report["_id"])
    return report


@router.get("/debug-all")
def debug_all():

    data = list(screenings.find())

    for d in data:
        d["_id"] = str(d["_id"])

    return data


@router.get("/jobs/ranked-candidates/{jobId}")
def ranked_candidates(jobId: str):

    apps = list(applications.find({"job_id": jobId}))

    results = []

    for app in apps:

        email = app.get("email")

        report = screenings.find_one({
            "jobId": jobId,
            "email": email
        })

        ats_score = report["atsScore"] if report else 0

        results.append({
            "candidateName": app.get("candidateName"),
            "email": email,
            "jobTitle": app.get("jobTitle"),
            "status": app.get("status"),
            "atsScore": ats_score
        })

    results.sort(key=lambda x: x["atsScore"], reverse=True)

    return {
        "jobId": jobId,
        "totalCandidates": len(results),
        "rankedCandidates": results
    }