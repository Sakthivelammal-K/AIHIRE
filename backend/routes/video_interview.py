from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime
from bson import ObjectId
import shutil
import os

from database import db


router = APIRouter(
    prefix="/video-interviews",
    tags=["Video Interviews"]
)



# START VIDEO INTERVIEW

@router.post("/start")
async def start_interview(data:dict):


    interview={


        "candidateName":
        data.get("candidateName"),


        "jobId":
        data.get("jobId"),


        "jobTitle":
        data.get("jobTitle"),



        "type":
        "Video Interview",


        "status":
        "In Progress",


        "answers":[],

        "violations":0,


        "technical":0,

        "communication":0,

        "confidence":0,

        "overall":0,

        "verdict":"Pending",


        "createdAt":
        datetime.utcnow(),


        "submittedAt":None


    }



    result=db.video_interviews.insert_one(
        interview
    )


    interview["_id"]=str(
        result.inserted_id
    )


    return interview


# SAVE ANSWER

@router.put("/{interview_id}/answer")
async def save_answer(
    interview_id:str,
    data:dict
):


    interview=db.video_interviews.find_one(
        {
        "_id":ObjectId(interview_id)
        }
    )


    if not interview:

        raise HTTPException(
            404,
            "Interview not found"
        )



    answer={


        "questionNo":
        data.get("questionNo"),


        "question":
        data.get("question"),


        "answer":
        data.get("answer")

    }




    db.video_interviews.update_one(

        {
        "_id":ObjectId(interview_id)
        },

        {

        "$push":{

            "answers":answer

        }

        }

    )



    return {
        "message":"Answer saved"
    }



# UPLOAD VIDEO


@router.post("/{interview_id}/upload")
async def upload_video(

    interview_id:str,

    video:UploadFile=File(...)

):


    os.makedirs(
        "uploads/videos",
        exist_ok=True
    )


    filename=f"{interview_id}.webm"


    filepath=os.path.join(

        "uploads/videos",

        filename

    )



    with open(filepath,"wb") as buffer:


        shutil.copyfileobj(
            video.file,
            buffer
        )




    db.video_interviews.update_one(

        {
        "_id":ObjectId(interview_id)
        },

        {

        "$set":{

            "videoPath":filepath

        }

        }

    )


    return {

        "message":"Video uploaded",

        "videoPath":filepath

    }



# FINISH INTERVIEW

@router.put("/{interview_id}/finish")
async def finish_interview(

    interview_id:str,

    data:dict

):


    interview = db.video_interviews.find_one(
        {
            "_id":ObjectId(interview_id)
        }
    )


    if not interview:

        raise HTTPException(
            404,
            "Interview not found"
        )


    answers = interview.get(
        "answers",
        []
    )


    violations = data.get(
        "violations",
        0
    )


    technical = (
        80
        if len(answers) >= 3
        else 60
    )


    communication = (
        75
        if len(answers) >= 3
        else 60
    )


    confidence = (
        85
        if violations == 0
        else 65
    )


    overall = int(
        (
        technical +
        communication +
        confidence
        ) / 3
    )


    if overall >= 75:

        verdict="Hire"


    elif overall < 50:

        verdict="Reject"


    else:

        verdict="Review"



    db.video_interviews.update_one(

        {
        "_id":ObjectId(interview_id)
        },

        {

        "$set":{

            "status":
            "Completed",


            "technical":
            technical,


            "communication":
            communication,


            "confidence":
            confidence,


            "overall":
            overall,


            "verdict":
            verdict,


            "violations":
            violations,


            "submittedAt":
            datetime.utcnow()

        }

        }

    )


    return {


        "message":
        "Interview completed",


        "overall":
        overall,


        "verdict":
        verdict

    }





# GET ALL VIDEO INTERVIEWS


@router.get("/")
async def get_video_interviews():


    data=[]


    for item in db.video_interviews.find():


        item["_id"]=str(
            item["_id"]
        )


        data.append(item)



    return data

@router.get("/completed")
async def get_completed_interviews():

    data=[]


    for item in db.video_interviews.find(
        {
        "status":"Completed"
        }
    ):

        item["_id"]=str(
            item["_id"]
        )

        data.append(item)


    return data

@router.post("/{interview_id}/evaluate")
async def evaluate_interview(interview_id: str):

    result = db.video_interviews.find_one(
        {"_id": ObjectId(interview_id)}
    )


    if not result:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )


    # convert ObjectId to string

    result["_id"] = str(result["_id"])


    return result