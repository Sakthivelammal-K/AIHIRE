from fastapi import APIRouter, HTTPException
from database import db, jobs
from bson import ObjectId
from datetime import datetime


router = APIRouter()


applications = db["applications"]



@router.post("/create")
def create_application(application: dict):

    print("Received Application:", application)


    application["status"] = "Applied"


    applications.insert_one(application)


    job_title = application.get("jobTitle")


    jobs.update_one(

        {
            "title": job_title
        },

        {
            "$inc":
            {
                "applicants": 1
            }
        }

    )


    return {

        "message":
        "Application submitted successfully"

    }





@router.get("/")
def get_applications():

    result=[]


    for app in applications.find():

        app["_id"]=str(app["_id"])

        result.append(app)


    return result






@router.put("/{application_id}")
def update_application(
    application_id:str,
    data:dict
):


    try:


        result = applications.update_one(

            {
                "_id":
                ObjectId(application_id)
            },

            {
                "$set":data
            }

        )


        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )


        return {

            "message":
            "Application updated"

        }


    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )