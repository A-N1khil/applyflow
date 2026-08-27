from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

router = APIRouter(prefix="/interviews", tags=["interviews"])


class InterviewCreate(BaseModel):
    application_id: int
    interview_type: str
    scheduled_at: datetime
    notes: str


interviews: dict[int, dict] = {
    1: {
        "id": 1,
        "application_id": 1,
        "interview_type": "Recruiter Screen",
        "scheduled_at": "2026-08-27T10:00:00",
        "notes": "Discuss the role and experience",
    },
    2: {
        "id": 2,
        "application_id": 2,
        "interview_type": "Technical Interview",
        "scheduled_at": "2026-08-28T14:00:00",
        "notes": "Review Python and FastAPI fundamentals",
    },
    3: {
        "id": 3,
        "application_id": 3,
        "interview_type": "System Design",
        "scheduled_at": "2026-08-29T11:30:00",
        "notes": "Design a job application API",
    },
    4: {
        "id": 4,
        "application_id": 4,
        "interview_type": "Final Interview",
        "scheduled_at": "2026-08-30T15:00:00",
        "notes": "Meet with the engineering manager",
    },
}


def create_interview(interview: InterviewCreate) -> dict:
    interview_id = max(interviews, default=0) + 1
    new_interview = {"id": interview_id, **interview.model_dump(mode="json")}
    interviews[interview_id] = new_interview
    return new_interview


@router.get("/all")
def get_interviews():
    return list(interviews.values())


@router.post("/post", status_code=status.HTTP_201_CREATED)
def add_interview(interview: InterviewCreate):
    return create_interview(interview)


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def add_interviews(new_interviews: list[InterviewCreate]):
    return [create_interview(interview) for interview in new_interviews]


@router.get("/get")
def get_interview(interview_id: int = Query(gt=0)):
    interview = interviews.get(interview_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview
