from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from database import db
from azure_storage import upload_file_to_azure
import os
import io
from pypdf import PdfReader
from bson import ObjectId
from datetime import datetime


router = APIRouter()

resumes_collection = db["resumes"]
screenings_collection = db["resume_screening"]
applications_collection = db["applications"]
jobs_collection = db["jobs"]

def extract_pdf_text_from_bytes(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
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

def extract_skills(resume_text: str):
    matched_skills = []
    resume_text_lower = resume_text.lower()
    for skill in KNOWN_SKILLS:
        if skill.lower() in resume_text_lower:
            matched_skills.append(skill)
    return matched_skills

def normalize_skill(skill: str):
    skill = skill.lower().strip()
    replacements = {
        "react.js": "react", "node": "node.js", "nodejs": "node.js",
        "js": "javascript", "rest api": "rest apis", "restful api": "rest apis"
    }
    return replacements.get(skill, skill)

@router.post("/upload")
async def upload_resume(email: str = Form(...), file: UploadFile = File(...)):
    file_bytes = await file.read()
    
    # 1. Upload file directly to Azure Blob Storage (container: media)
    content_type = file.content_type or "application/pdf"
    file_url = upload_file_to_azure(file_bytes, file.filename, content_type=content_type, folder="resumes")

    # 2. Extract text and skills from PDF bytes
    resume_text = extract_pdf_text_from_bytes(file_bytes)
    skills = extract_skills(resume_text)

    # 3. Store resume metadata and Azure URL in MongoDB
    resumes_collection.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "resumeName": file.filename,
                "resumeUrl": file_url,
                "resumePath": file_url,
                "resumeText": resume_text,
                "skills": skills,
                "uploadedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {
        "message": "Resume uploaded successfully to Azure Storage",
        "email": email,
        "resumeName": file.filename,
        "resumeUrl": file_url,
        "skills": skills
    }

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

@router.get("/view/{email}")
def view_resume_pdf(email: str):
    resume = resumes_collection.find_one({"email": email})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_url = resume.get("resumeUrl") or resume.get("resumePath")
    if not file_url:
        raise HTTPException(status_code=404, detail="PDF file not found")
        
    if file_url.startswith(("http://", "https://")):
        return RedirectResponse(url=file_url)
        
    if os.path.exists(file_url):
        return FileResponse(
            path=file_url,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline"}
        )
    raise HTTPException(status_code=404, detail="PDF file not found on server")

@router.get("/download/{email}")
def download_resume_pdf(email: str):
    resume = resumes_collection.find_one({"email": email})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    file_url = resume.get("resumeUrl") or resume.get("resumePath")
    if not file_url:
        raise HTTPException(status_code=404, detail="PDF file not found")
        
    if file_url.startswith(("http://", "https://")):
        return RedirectResponse(url=file_url)
        
    if os.path.exists(file_url):
        return FileResponse(
            path=file_url,
            media_type="application/octet-stream",
            filename=resume.get("resumeName", "resume.pdf")
        )
    raise HTTPException(status_code=404, detail="PDF file not found on server")

@router.post("/screen")
def screen_resume(data: dict):
    try:
        email = data.get("email")
        job_id = data.get("jobId")

        if not email or not job_id:
            raise HTTPException(status_code=400, detail="Email and Job ID are required")

        resume = resumes_collection.find_one({"email": email})
        if not resume:
            return {"message": "Resume not found for this user", "atsScore": 0}

        try:
            job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        except Exception:
            return {"message": "Invalid Job ID format. Unable to screen.", "atsScore": 0}

        if not job:
            return {"message": "Job not found", "atsScore": 0}

        required_skills = []
        raw_skills = job.get("requiredSkills")

        if raw_skills:
            if isinstance(raw_skills, list):
                required_skills = raw_skills
            else:
                skills_str = str(raw_skills).replace('[', '').replace(']', '').replace("'", '').replace('"', '')
                required_skills = [s.strip() for s in skills_str.split(',') if s.strip()]

        candidate_skills = resume.get("skills", [])
        candidate_normalized = [normalize_skill(skill) for skill in candidate_skills]
        matched_skills = []
        missing_skills = []

        for skill in required_skills:
            if normalize_skill(skill) in candidate_normalized:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        if len(required_skills) > 0:
            ats_score = int((len(matched_skills) / len(required_skills)) * 100)
        else:
            ats_score = 0

        if ats_score >= 80:
            recommendation = "Highly Recommended"
        elif ats_score >= 60:
            recommendation = "Recommended"
        elif ats_score >= 40:
            recommendation = "Needs Improvement"
        else:
            recommendation = "Not Recommended"

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

@router.get("/jobs/ranked-candidates/{jobId}")
def ranked_candidates(jobId: str):
    apps = list(applications_collection.find({"job_id": jobId}))
    results = []

    for app in apps:
        email = app.get("email")
        candidate_name = app.get("candidateName") or app.get("name", email)
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