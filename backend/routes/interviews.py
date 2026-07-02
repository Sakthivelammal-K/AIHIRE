from fastapi import APIRouter
from database import db
from bson import ObjectId
from datetime import datetime


router = APIRouter()

interviews = db["interviews"]



# CREATE SCHEDULED INTERVIEW

@router.post("/create")
def create_interview(data:dict):

    interview={

        "candidateName":
        data.get("candidateName"),

        "jobTitle":
        data.get("jobTitle"),

        "applicationId":
        data.get("applicationId"),

        "date":
        data.get("date"),

        "type":
        data.get("type","Interview"),

        "status":
        "Scheduled",

        "meetingLink":
        data.get("meetingLink",""),

        "instructions":
        data.get("instructions",""),

        "notes":"",

        "createdAt":
        datetime.utcnow()

    }


    interviews.insert_one(interview)


    return {
        "message":"Interview scheduled"
    }






# SAVE AI RESULT

@router.post("/result")
def save_result(data:dict):


    result={


        "candidateName":
        data.get("candidateName"),


        "jobTitle":
        data.get("jobTitle"),


        "type":
        "AI Interview",



        "technical":
        data.get("technical",0),


        "communication":
        data.get("communication",0),


        "confidence":
        data.get("confidence",0),


        "overall":
        data.get("overall",0),



        "verdict":
        data.get("verdict","Pending"),



        "strengths":
        data.get("strengths",[]),


        "improvements":
        data.get("improvements",[]),



        "recruiterComment":"",

        "recruiterRating":0,

        "finalDecision":"",


        "createdAt":
        datetime.utcnow()

    }


    interviews.insert_one(result)


    return {
        "message":"AI Result saved"
    }






# GET SCHEDULED INTERVIEWS

@router.get("/")
def get_interviews():


    scheduled=[]


    for item in interviews.find():

        if item.get("type")=="AI Interview":
            continue


        item["_id"]=str(item["_id"])

        scheduled.append(item)



    return {

        "scheduled":scheduled

    }






# COMBINED RESULTS

@router.get("/results")
def get_results():

    results = []

    # ==========================
    # VIDEO INTERVIEW RESULTS
    # ==========================
    for item in db["video_interviews"].find({"status": "Completed"}):

        interview = interviews.find_one({
            "candidateName": item.get("candidateName"),
            "jobTitle": item.get("jobTitle"),
            "type": "Video Interview"
        })

        results.append({
            "_id": str(item["_id"]),
            "candidateName": item.get("candidateName"),
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

    # ==========================
    # ONLINE ASSESSMENT RESULTS
    # ==========================
    for assessment in db["assessments"].find({"status": "Completed"}):

        interview = interviews.find_one({
            "candidateName": assessment.get("candidateName"),
            "jobTitle": assessment.get("jobTitle"),
            "type": "Online Assessment"
        })

        results.append({
            "_id": str(assessment["_id"]),
            "candidateName": assessment.get("candidateName"),
            "jobTitle": assessment.get("jobTitle"),
            "type": "Online Assessment",
            "overall": assessment.get("score", 0),
            "score": assessment.get("score", 0),
            "answers": assessment.get("answers", []),
            "questions": assessment.get("questions", []),
            "verdict": interview.get("finalDecision", "Pending") if interview else "Pending"
        })

    return results



# UPDATE INTERVIEW + SAVE RECRUITER REVIEW


# UPDATE INTERVIEW + SAVE RECRUITER REVIEW + UPDATE APPLICATION STATUS

@router.put("/result/{id}")
def update_interview(id:str,data:dict):


    update={


        "type":
        data.get("type"),


        "status":
        data.get("status"),


        "meetingLink":
        data.get("meetingLink"),


        "instructions":
        data.get("instructions"),


        "notes":
        data.get("notes"),


        "recruiterComment":
        data.get("recruiterComment",""),


        "recruiterRating":
        data.get("recruiterRating",0),


        "finalDecision":
        data.get("finalDecision",""),


        "updatedAt":
        datetime.utcnow()

    }



    result = interviews.update_one(

        {
        "_id":ObjectId(id)
        },

        {
        "$set":update
        }

    )



    if result.matched_count == 0:

        return {
            "message":"Interview not found"
        }



    # ==============================
    # UPDATE APPLICATION STATUS
    # ==============================


    interview = interviews.find_one(
        {
        "_id":ObjectId(id)
        }
    )


    if interview and interview.get("applicationId"):


        application_id = interview["applicationId"]


        decision = data.get("finalDecision")


        status = None



        if decision == "Selected":

            status = "Selected"


        elif decision == "Rejected":

            status = "Rejected"


        elif decision == "Hold":

            status = "Hold"



        if status:


            db["applications"].update_one(

                {
                "_id":ObjectId(application_id)
                },

                {
                "$set":{
                    "status":status
                }
                }

            )



    return {
        "message":"Interview updated"
    }