from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import db
from fastapi.responses import FileResponse
import os
from pypdf import PdfReader
from bson import ObjectId
from datetime import datetime


router = APIRouter()

resumes_collection = db["resumes"]
screenings_collection = db["resume_screening"]
applications_collection = db["applications"]
jobs_collection = db["jobs"]  # <--- FIXED: Added missing collection reference

UPLOAD_FOLDER = "uploads/resumes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_pdf_text(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

KNOWN_SKILLS = [
    "React", "JavaScript", "Python", "FastAPI", "MongoDB", "HTML", "CSS",
    "Node.js", "Express", "Java", "C", "C++", "SQL", "MySQL", "Git", "GitHub"
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
        "react.js": "react", "node": "node.js", "nodejs": "node.js",
        "js": "javascript", "rest api": "rest apis", "restful api": "rest apis"
    }
    return replacements.get(skill, skill)

@router.post("/upload")
async def upload_resume(email: str = Form(...), file: UploadFile = File(...)):
    filename = f"{email}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    resume_text = extract_pdf_text(file_path)
    skills = extract_skills(resume_text)

    resumes_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "resumeName": file.filename,
                "resumePath": file_path,
                "resumeText": resume_text,
                "skills": skills,
                "uploadedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {"message": "Resume uploaded successfully", "email": email, "resumeName": file.filename, "skills": skills}

@router.get("/{email}")
def get_resume(email: str):
    resume = resumes_collection.find_one({"email": email})
    if resume:
        resume["_id"] = str(resume["_id"])
        return resume
    return {}

@router.delete("/{email}")
def delete_resume(email: str):
    result = resumes_collection.delete_one({"email": email})
    if result.deleted_count == 1:
        return {"message": "Resume deleted successfully"}
    return {"message": "Resume not found"}


# ==========================================
# 1. VIEW ROUTE (For Preview / Overlay - NEVER downloads)
# ==========================================
@router.get("/view/{email}")
def view_resume_pdf(email: str):
    resume = resumes_collection.find_one({"email": email})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_path = resume.get("resumePath")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF file not found on server")
        
    # "inline" tells the browser to show the PDF. We remove filename to prevent accidental downloads.
    return FileResponse(
        path=file_path, 
        media_type="application/pdf",
        headers={"Content-Disposition": "inline"}
    )


# ==========================================
# 2. DOWNLOAD ROUTE (For Download Button - ALWAYS downloads)
# ==========================================
@router.get("/download/{email}")
def download_resume_pdf(email: str):
    resume = resumes_collection.find_one({"email": email})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_path = resume.get("resumePath")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="PDF file not found on server")
        
    # "attachment" + octet-stream + filename forces the browser to immediately download
    return FileResponse(
        path=file_path, 
        media_type="application/octet-stream", 
        filename=resume.get("resumeName")
    )

# ==========================================
# FIXED SCREENING ROUTE (No more 500 errors)
# ==========================================
@router.post("/screen")
def screen_resume(data: dict):
    try:
        email = data.get("email")
        job_id = data.get("jobId")

        if not email or not job_id:
            raise HTTPException(status_code=400, detail="Email and Job ID are required")

        # 1. Find candidate resume
        resume = resumes_collection.find_one({"email": email})
        if not resume:
            return {"message": "Resume not found for this user", "atsScore": 0}

        # 2. Find job - SAFELY CAST ObjectId
        try:
            job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        except Exception:
            return {"message": "Invalid Job ID format. Unable to screen.", "atsScore": 0}

        if not job:
            return {"message": "Job not found", "atsScore": 0}

        # ==================================================
        # FIX: PROPERLY PARSE THE SKILLS STRING
        # ==================================================
        required_skills = []
        raw_skills = job.get("requiredSkills")

        if raw_skills:
            # If it's already a list, use it directly
            if isinstance(raw_skills, list):
                required_skills = raw_skills
            else:
                # Convert to string and clean it up
                skills_str = str(raw_skills)
                
                # Step 1: Remove brackets and single/double quotes
                skills_str = skills_str.replace('[', '').replace(']', '').replace("'", '').replace('"', '')
                
                # Step 2: Split by comma and trim whitespace
                required_skills = [s.strip() for s in skills_str.split(',') if s.strip()]
        # ==================================================

        # 4. Candidate skills
        candidate_skills = resume.get("skills", [])

        # 5. Normalize and compare
        candidate_normalized = [normalize_skill(skill) for skill in candidate_skills]
        matched_skills = []
        missing_skills = []

        for skill in required_skills:
            if normalize_skill(skill) in candidate_normalized:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        # 6. Calculate ATS Score safely
        if len(required_skills) > 0:
            ats_score = int((len(matched_skills) / len(required_skills)) * 100)
        else:
            ats_score = 0

        # 7. Recommendation
        if ats_score >= 80:
            recommendation = "Highly Recommended"
        elif ats_score >= 60:
            recommendation = "Recommended"
        elif ats_score >= 40:
            recommendation = "Needs Improvement"
        else:
            recommendation = "Not Recommended"

        # 8. Save screening result
        screenings_collection.update_one(
            {"email": email, "jobId": job_id},
            {
                "$set": {
                    "email": email,
                    "jobId": job_id,
                    "jobTitle": job.get("title", "Unknown Job"),
                    "candidateSkills": candidate_skills,
                    "requiredSkills": required_skills,
                    "matchedSkills": matched_skills,
                    "missingSkills": missing_skills,
                    "atsScore": ats_score,
                    "recommendation": recommendation,
                    "screenedAt": datetime.utcnow()
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

    except Exception as e:
        print(f"CRITICAL ERROR IN SCREENING: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
@router.get("/screening/{email}")
def get_latest_screening(email: str):
    report = screenings_collection.find_one({"email": email}, sort=[("_id", -1)])
    if not report:
        return {}
    report["_id"] = str(report["_id"])
    return report

@router.get("/report/{job_id}/{email}")
def get_resume_report(job_id: str, email: str):
    report = screenings_collection.find_one({"jobId": str(job_id), "email": email.strip().lower()})
    if not report:
        return {"message": "Report not found"}
    report["_id"] = str(report["_id"])
    return report

@router.get("/debug-all")
def debug_all():
    data = list(screenings_collection.find())
    for d in data:
        d["_id"] = str(d["_id"])
    return data

# ==========================================
# RANKED CANDIDATES
# ==========================================
@router.get("/jobs/ranked-candidates/{jobId}")
def ranked_candidates(jobId: str):
    apps = list(applications_collection.find({"job_id": jobId}))
    results = []

    for app in apps:
        email = app.get("email")
        
        # Safely handle missing candidateName (fallback to 'name' or email)
        candidate_name = app.get("candidateName")
        if not candidate_name:
            candidate_name = app.get("name", email)

        report = screenings_collection.find_one({"jobId": jobId, "email": email})
        ats_score = report["atsScore"] if report else 0

        results.append({
            "candidateName": candidate_name,
            "email": email,
            "jobTitle": app.get("jobTitle"),
            "status": app.get("status", "Applied"),
            "atsScore": ats_score
        })

    results.sort(key=lambda x: x["atsScore"], reverse=True)

    return {
        "jobId": jobId,
        "totalCandidates": len(results),
        "rankedCandidates": results
    }