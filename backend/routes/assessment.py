from fastapi import APIRouter
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(
    prefix="/assessments",
    tags=["Assessment"]
)

assessments = db["assessments"]


# ===========================
# Get all completed assessments
# ===========================
@router.get("/results")
def get_results():

    results=[]

    for assessment in assessments.find({"status":"Completed"}):


        jobTitle = assessment.get("jobTitle")


        if not jobTitle:

            jobId = assessment.get("jobId")


            if jobId:

                job = db.jobs.find_one(
                    {
                        "_id": ObjectId(jobId)
                    }
                )


                if job:
                    jobTitle = job.get("title")


        assessment["jobTitle"] = jobTitle or "-"


        assessment["_id"] = str(
            assessment["_id"]
        )


        results.append(assessment)


    return results


# ===========================
# Get one completed assessment
# ===========================
@router.get("/result/{candidate_name}")
def get_candidate_result(candidate_name: str):

    assessment = assessments.find_one(
        {
            "candidateName": candidate_name,
            "status": "Completed"
        }
    )

    if not assessment:
        return {}

    assessment["_id"] = str(assessment["_id"])

    return assessment


# ===========================
# Submit assessment
# ===========================
@router.put("/{id}/submit")
def submit_assessment(id: str, data: dict):

    assessment = assessments.find_one(
        {
            "_id": ObjectId(id)
        }
    )


    if not assessment:
        return {
            "message":"Assessment not found"
        }



    answers = data.get(
        "answers",
        []
    )


    score = 0


    for index, answer in enumerate(answers):

        if answer == assessment["questions"][index]["answer"]:
            score += 1



    percentage = int(
        (score / len(assessment["questions"])) * 100
    )



    jobTitle = assessment.get(
        "jobTitle",
        ""
    )

    jobId = assessment.get(
        "jobId",
        None
    )



    # if old assessment has no job details
    if not jobTitle:


        application = db["applications"].find_one(
            {
                "candidateName":
                assessment["candidateName"]
            }
        )


        if application:


            jobId = application.get(
                "jobId"
            )


            if jobId:


                job = db["jobs"].find_one(
                    {
                        "_id":ObjectId(jobId)
                    }
                )


                if job:

                    jobTitle = job.get(
                        "title",
                        ""
                    )




    assessments.update_one(

        {
            "_id":ObjectId(id)
        },

        {
            "$set":{

                "answers":answers,

                "score":percentage,

                "jobId":jobId,

                "jobTitle":jobTitle,

                "status":"Completed",

                "submittedAt":datetime.utcnow()

            }
        }

    )


    return {

        "score":percentage,

        "message":"Assessment completed"

    }


# ===========================
# Get/Create assessment
# ===========================
@router.get("/{username}")
def get_assessment(username: str):


    assessment = assessments.find_one(
        {
            "candidateName": username,
            "status": "Pending"
        }
    )


    if assessment:

        assessment["_id"] = str(
            assessment["_id"]
        )

        return assessment



    # find application of candidate
    application = db["applications"].find_one(
        {
            "candidateName": username
        }
    )


    jobTitle = ""


    jobId = None


    if application:

        jobId = application.get("jobId")


        if jobId:

            job = db["jobs"].find_one(
                {
                    "_id": ObjectId(jobId)
                }
            )


            if job:

                jobTitle = job.get(
                    "title",
                    ""
                )



    questions = [

        {
            "question": "What is React?",
            "options": [
                "Library",
                "Database",
                "Language",
                "OS"
            ],
            "answer": "Library"
        },


        {
            "question": "What is MongoDB?",
            "options": [
                "SQL Database",
                "NoSQL Database",
                "Framework",
                "Browser"
            ],
            "answer": "NoSQL Database"
        },


        {
            "question": "FastAPI is built using?",
            "options": [
                "Python",
                "Java",
                "C++",
                "PHP"
            ],
            "answer": "Python"
        }

    ]



    result = {


        "candidateName": username,


        "jobId": jobId,


        "jobTitle": jobTitle,


        "type": "Online Assessment",


        "questions": questions,


        "status": "Pending",


        "createdAt": datetime.utcnow()

    }



    inserted = assessments.insert_one(result)



    result["_id"] = str(
        inserted.inserted_id
    )


    return result


