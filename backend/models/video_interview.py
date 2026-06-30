from pydantic import BaseModel
from typing import List
from datetime import datetime


class InterviewAnswer(BaseModel):
    questionNo: int
    question: str
    answer: str


class VideoInterview(BaseModel):
    candidateName: str
    jobId: str
    jobTitle: str

    interviewType: str = "Video"

    status: str = "In Progress"

    violations: int = 0

    answers: List[InterviewAnswer] = []

    createdAt: datetime = datetime.utcnow()

    submittedAt: datetime | None = None