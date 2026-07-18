from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

templates_collection = db["templates"]

# ==========================================
# 1. CREATE A TEMPLATE (Email or Job)
# ==========================================
@router.post("/")
def create_template(data: dict):
    # Determine the type of template (default to 'email')
    template_type = data.get("type", "email")
    
    # Validate required fields based on type
    if template_type == "email":
        if not data.get("name") or not data.get("subject") or not data.get("body"):
            raise HTTPException(status_code=400, detail="Email templates require name, subject, and body")
    elif template_type == "job":
        if not data.get("name") or not data.get("jobTitle") or not data.get("description"):
            raise HTTPException(status_code=400, detail="Job templates require name, jobTitle, and description")
    else:
        raise HTTPException(status_code=400, detail="Invalid template type. Must be 'email' or 'job'")

    template = {
        "type": template_type,  # 🟢 This is the key that separates them
        "name": data.get("name"),
        "category": data.get("category", "general"),
        "tags": data.get("tags", []),
        "isDefault": data.get("isDefault", False),
        "usageCount": 0,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "createdBy": data.get("createdBy")
    }

    # Add Email specific fields
    if template_type == "email":
        template["subject"] = data.get("subject")
        template["body"] = data.get("body")
    
    # 🟢 Add ALL Job specific fields
    if template_type == "job":
        template["jobTitle"] = data.get("jobTitle")
        template["description"] = data.get("description")
        template["requirements"] = data.get("requirements", [])
        template["responsibilities"] = data.get("responsibilities", [])
        template["location"] = data.get("location", "")
        template["employmentType"] = data.get("employmentType", "Full-time")
        template["salaryRange"] = data.get("salaryRange", "")
        
        # 🟢 NEW ADDITIONAL FIELDS
        template["summary"] = data.get("summary", "")
        template["department"] = data.get("department", "")
        template["workMode"] = data.get("workMode", "Hybrid")
        template["experienceLevel"] = data.get("experienceLevel", "Mid Level (2-5 years)")
        template["minExperience"] = data.get("minExperience", "")
        template["maxExperience"] = data.get("maxExperience", "")
        template["minSalary"] = data.get("minSalary", "")
        template["maxSalary"] = data.get("maxSalary", "")
        template["applicationDeadline"] = data.get("applicationDeadline", "")
        template["openings"] = data.get("openings", "")
        template["benefits"] = data.get("benefits", "")

    result = templates_collection.insert_one(template)
    return {"message": "Template created", "id": str(result.inserted_id)}


# ==========================================
# 2. GET ALL TEMPLATES (Filter by Type)
# ==========================================
@router.get("/")
def get_templates(type: str = None, recruiter_email: str = None):
    query = {}
    if type:
        query["type"] = type  # 🟢 Allows filtering by "email" or "job"
    if recruiter_email:
        query["createdBy"] = recruiter_email
        
    templates = []
    for t in templates_collection.find(query).sort("createdAt", -1):
        t["_id"] = str(t["_id"])
        templates.append(t)
    return templates


# ==========================================
# 3. GET SINGLE TEMPLATE
# ==========================================
@router.get("/{template_id}")
def get_template(template_id: str):
    template = templates_collection.find_one({"_id": ObjectId(template_id)})
    if not template:
        raise HTTPException(404, "Template not found")
    template["_id"] = str(template["_id"])
    return template


# ==========================================
# 4. UPDATE TEMPLATE
# ==========================================
@router.put("/{template_id}")
def update_template(template_id: str, data: dict):
    update_data = {}
    # Common fields
    if "name" in data: update_data["name"] = data["name"]
    if "category" in data: update_data["category"] = data["category"]
    if "tags" in data: update_data["tags"] = data["tags"]
    if "isDefault" in data: update_data["isDefault"] = data["isDefault"]
    
    # Email specific fields
    if "subject" in data: update_data["subject"] = data["subject"]
    if "body" in data: update_data["body"] = data["body"]
    
    # 🟢 Update ALL Job specific fields
    if "jobTitle" in data: update_data["jobTitle"] = data["jobTitle"]
    if "description" in data: update_data["description"] = data["description"]
    if "requirements" in data: update_data["requirements"] = data["requirements"]
    if "responsibilities" in data: update_data["responsibilities"] = data["responsibilities"]
    if "location" in data: update_data["location"] = data["location"]
    if "employmentType" in data: update_data["employmentType"] = data["employmentType"]
    if "salaryRange" in data: update_data["salaryRange"] = data["salaryRange"]
    
    # 🟢 NEW ADDITIONAL FIELDS
    if "summary" in data: update_data["summary"] = data["summary"]
    if "department" in data: update_data["department"] = data["department"]
    if "workMode" in data: update_data["workMode"] = data["workMode"]
    if "experienceLevel" in data: update_data["experienceLevel"] = data["experienceLevel"]
    if "minExperience" in data: update_data["minExperience"] = data["minExperience"]
    if "maxExperience" in data: update_data["maxExperience"] = data["maxExperience"]
    if "minSalary" in data: update_data["minSalary"] = data["minSalary"]
    if "maxSalary" in data: update_data["maxSalary"] = data["maxSalary"]
    if "applicationDeadline" in data: update_data["applicationDeadline"] = data["applicationDeadline"]
    if "openings" in data: update_data["openings"] = data["openings"]
    if "benefits" in data: update_data["benefits"] = data["benefits"]
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = templates_collection.update_one(
        {"_id": ObjectId(template_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(404, "Template not found")
        
    return {"message": "Template updated"}

# ==========================================
# 5. DELETE TEMPLATE (FIXED FOR 405 ERROR)
# ==========================================
@router.delete("/{template_id}")
def delete_template(template_id: str):
    # DIRECT STRING CONVERSION - GUARANTEED TO WORK
    from bson import ObjectId
    try:
        oid = ObjectId(template_id)
    except:
        raise HTTPException(400, "Invalid template ID format")
        
    result = templates_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(404, "Template not found")
    return {"message": "Template deleted"}