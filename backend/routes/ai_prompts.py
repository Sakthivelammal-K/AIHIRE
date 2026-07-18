from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

ai_prompts_collection = db["ai_prompts"]

# ==========================================
# 1. CREATE AI PROMPT TEMPLATE
# ==========================================
@router.post("/")
def create_ai_prompt(data: dict):
    required_fields = ["name", "systemPrompt", "userPrompt"]
    for field in required_fields:
        if not data.get(field):
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")

    template = {
        "name": data.get("name"),
        "description": data.get("description", ""),
        "systemPrompt": data.get("systemPrompt"),
        "userPrompt": data.get("userPrompt"),
        "temperature": data.get("temperature", 0.7),
        "category": data.get("category", "general"),
        "createdBy": data.get("createdBy"),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = ai_prompts_collection.insert_one(template)
    return {"message": "AI Prompt template created", "id": str(result.inserted_id)}


# ==========================================
# 2. GET ALL AI PROMPT TEMPLATES
# ==========================================
@router.get("/")
def get_ai_prompts(recruiter_email: str = None):
    query = {}
    if recruiter_email:
        query["createdBy"] = recruiter_email
        
    prompts = []
    for p in ai_prompts_collection.find(query).sort("createdAt", -1):
        p["_id"] = str(p["_id"])
        prompts.append(p)
    return prompts


# ==========================================
# 3. GET SINGLE AI PROMPT TEMPLATE
# ==========================================
@router.get("/{prompt_id}")
def get_ai_prompt(prompt_id: str):
    prompt = ai_prompts_collection.find_one({"_id": ObjectId(prompt_id)})
    if not prompt:
        raise HTTPException(404, "AI Prompt template not found")
    prompt["_id"] = str(prompt["_id"])
    return prompt


# ==========================================
# 4. UPDATE AI PROMPT TEMPLATE
# ==========================================
@router.put("/{prompt_id}")
def update_ai_prompt(prompt_id: str, data: dict):
    update_data = {}
    if "name" in data: update_data["name"] = data["name"]
    if "description" in data: update_data["description"] = data["description"]
    if "systemPrompt" in data: update_data["systemPrompt"] = data["systemPrompt"]
    if "userPrompt" in data: update_data["userPrompt"] = data["userPrompt"]
    if "temperature" in data: update_data["temperature"] = data["temperature"]
    if "category" in data: update_data["category"] = data["category"]
    update_data["updatedAt"] = datetime.utcnow()
    
    result = ai_prompts_collection.update_one(
        {"_id": ObjectId(prompt_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(404, "AI Prompt template not found")
        
    return {"message": "AI Prompt template updated"}


# ==========================================
# 5. DELETE AI PROMPT TEMPLATE
# ==========================================
@router.delete("/{prompt_id}")
def delete_ai_prompt(prompt_id: str):
    result = ai_prompts_collection.delete_one({"_id": ObjectId(prompt_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "AI Prompt template not found")
    return {"message": "AI Prompt template deleted"}