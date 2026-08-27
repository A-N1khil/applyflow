from datetime import date

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["applications"])


class ApplicationCreate(BaseModel):
    company_id: int
    role: str
    location: str
    job_url: str
    applied_at: date
    current_status: str


applications: dict[int, dict] = {
    1: {
        "id": 1,
        "company_id": 1,
        "role": "Backend Engineer",
        "location": "New York, NY",
        "job_url": "https://example.com/jobs/backend-engineer",
        "applied_at": "2026-08-20",
        "current_status": "APPLIED",
    },
    2: {
        "id": 2,
        "company_id": 2,
        "role": "Python Developer",
        "location": "Remote",
        "job_url": "https://example.com/jobs/python-developer",
        "applied_at": "2026-08-18",
        "current_status": "RECRUITER_CONTACT",
    },
    3: {
        "id": 3,
        "company_id": 3,
        "role": "API Engineer",
        "location": "Boston, MA",
        "job_url": "https://example.com/jobs/api-engineer",
        "applied_at": "2026-08-15",
        "current_status": "INTERVIEW",
    },
    4: {
        "id": 4,
        "company_id": 4,
        "role": "Software Engineer",
        "location": "Austin, TX",
        "job_url": "https://example.com/jobs/software-engineer",
        "applied_at": "2026-08-10",
        "current_status": "OFFER",
    },
}


def create_application(application: ApplicationCreate) -> dict:
    application_id = max(applications, default=0) + 1
    new_application = {"id": application_id, **application.model_dump(mode="json")}
    applications[application_id] = new_application
    return new_application


@router.get("/all", status_code=status.HTTP_200_OK)
def get_applications():
    return list(applications.values())


@router.post("/post", status_code=status.HTTP_201_CREATED)
def add_application(application: ApplicationCreate):
    return create_application(application)


@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def add_applications(new_applications: list[ApplicationCreate]):
    return [create_application(application) for application in new_applications]


@router.get("/{application_id}")
def get_application(application_id: int):
    application = applications.get(application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
