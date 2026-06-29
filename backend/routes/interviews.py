from fastapi import APIRouter
from database import db
from bson import ObjectId
from fastapi import HTTPException

router = APIRouter()

interviews = db["interviews"]

@router.post("/create")
def create_interview(data: dict):

    interview = {
        "candidateName": data.get("candidateName"),
        "jobTitle": data.get("jobTitle"),
        "date": data.get("date"),
        "type": data.get("type", "Interview"),
        "status": data.get("status", "Scheduled"),
        "meetingLink": data.get("meetingLink", ""),
        "instructions": data.get("instructions", ""),
        "notes": data.get("notes", "")
    }

    interviews.insert_one(interview)

    return {"message": "Interview scheduled"}

@router.post("/result")
def save_interview_result(data:dict):

    interviews.insert_one({
        "candidateName": data.get("candidateName"),
        "jobTitle": data.get("jobTitle"),

        "technical": data.get("technical"),
        "communication": data.get("communication"),
        "confidence": data.get("confidence"),

        "overall": data.get("overall"),
        "verdict": data.get("verdict"),

        "strengths": data.get("strengths"),
        "improvements": data.get("improvements"),

        "type":"AI Interview Result"
    })


    return {
        "message":"Interview result saved"
    }

@router.get("/")
def get_interviews():

    scheduled = []
    results = []

    for item in interviews.find():

        item["_id"] = str(item["_id"])

        if item.get("verdict") or item.get("overall"):
            results.append(item)
        else:
            scheduled.append(item)

    return {
        "scheduled": scheduled,
        "results": results
    }


@router.get("/results")
def get_interview_results():

    results = list(
        interviews.find(
            {},
            {"_id":0}
        )
    )


    return results

@router.put("/{id}")
def update_interview(id: str, data: dict):

    result = interviews.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "meetingLink": data.get("meetingLink"),
                "instructions": data.get("instructions"),
                "notes": data.get("notes"),
                "result": data.get("result"),
                "status": data.get("status")
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return {
        "message": "Interview updated successfully"
    }
