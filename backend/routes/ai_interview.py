from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class InterviewRequest(BaseModel):
    answers:list
    jobTitle:str

class QuestionRequest(BaseModel):

    jobTitle:str


@router.post("/ai/questions")
async def generate_questions(data:QuestionRequest):


    questions = {


    "Frontend Developer":[

        "Explain React component lifecycle.",
        "What is Virtual DOM and why is it useful?",
        "Explain useMemo and useCallback."

    ],


    "Backend Developer":[

        "Explain REST API architecture.",
        "How does JWT authentication work?",
        "Explain database indexing."

    ],


    "Full Stack Developer":[

        "Explain MERN stack.",
        "How does frontend communicate with backend?",
        "Explain API security."

    ]



    }


    return {

        "questions":
        questions.get(
            data.jobTitle,
            questions["Frontend Developer"]
        )

    }  

@router.post("/ai/evaluate")
async def evaluate_interview(data:InterviewRequest):


    text = " ".join(data.answers)


    length = len(text)


    if length > 300:

        technical = 90
        communication = 88
        confidence = 85

        feedback = [
            "Good explanation",
            "Strong technical knowledge"
        ]


        improvements = [
            "Add real project examples",
            "Explain concepts deeper"
        ]



    elif length > 150:


        technical = 75
        communication = 72
        confidence = 70

        feedback = [
            "Basic understanding shown"
        ]


        improvements = [
            "Improve technical depth"
        ]


    else:


        technical = 55
        communication = 60
        confidence = 58


        feedback=[
            "Need more detailed answers"
        ]


        improvements=[
            "Practice explaining concepts"
        ]



    overall = round(
        (
        technical+
        communication+
        confidence
        )/3
    )



    verdict = (
        "Hire"
        if overall>=80
        else
        "Consider"
        if overall>=65
        else
        "Reject"
    )



    return {


        "jobTitle":data.jobTitle,

        "technical":technical,

        "communication":communication,

        "confidence":confidence,

        "overall":overall,

        "verdict":verdict,

        "strengths":feedback,

        "improvements":improvements

    }