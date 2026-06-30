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


    results=[]



    # AI

    for item in interviews.find(
        {
        "type":"AI Interview"
        }
    ):


        item["_id"]=str(item["_id"])

        results.append(item)




    # VIDEO

    videos=db["video_interviews"]


    for item in videos.find(
        {
        "status":"Completed"
        }
    ):


        item["_id"]=str(item["_id"])


        results.append({

            "_id":
            item["_id"],


            "candidateName":
            item.get("candidateName","Unknown"),


            "jobTitle":
            item.get("jobTitle","-"),



            "type":
            "Video Interview",



            "technical":
            item.get("technical",0),


            "communication":
            item.get("communication",0),


            "confidence":
            item.get("confidence",0),


            "overall":
            item.get("overall",0),



            "verdict":
            item.get("verdict","Pending"),



            "strengths":
            item.get("strengths",[]),


            "improvements":
            item.get("improvements",[]),



            "videoPath":
            item.get("videoPath",""),



            "answers":
            item.get("answers",[]),



            "violations":
            item.get("violations",0),



            "recruiterComment":
            item.get("recruiterComment",""),


            "recruiterRating":
            item.get("recruiterRating",0),


            "finalDecision":
            item.get("finalDecision","")

        })



    return results






# SAVE RECRUITER REVIEW


@router.put("/result/{id}")
def save_review(id:str,data:dict):


    update={


        "recruiterComment":
        data.get("recruiterComment"),


        "recruiterRating":
        data.get("recruiterRating"),


        "finalDecision":
        data.get("finalDecision"),


        "reviewedAt":
        datetime.utcnow()

    }



    result=interviews.update_one(

        {
        "_id":ObjectId(id)
        },

        {
        "$set":update
        }

    )



    if result.matched_count==0:


        db["video_interviews"].update_one(

            {
            "_id":ObjectId(id)
            },

            {
            "$set":update
            }

        )


    return {
        "message":"Review saved"
    }