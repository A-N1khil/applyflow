from fastapi import APIRouter, HTTPException, Query, status

from server.models.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatus,
)

router = APIRouter(prefix="/applications", tags=["applications"])


applications: dict[int, dict] = {
    1: {
        "id": 1,
        "company": "Northstar Labs",
        "role": "Backend Engineer",
        "location": "New York, NY",
        "status": ApplicationStatus.APPLIED,
    },
    2: {
        "id": 2,
        "company": "Greenfield Health",
        "role": "Python Developer",
        "location": "Remote",
        "status": ApplicationStatus.RECRUITER_CONTACT,
    },
    3: {
        "id": 3,
        "company": "Summit Finance",
        "role": "API Engineer",
        "location": "Boston, MA",
        "status": ApplicationStatus.INTERVIEW,
    },
    4: {
        "id": 4,
        "company": "BrightPath Education",
        "role": "Software Engineer",
        "location": "Austin, TX",
        "status": ApplicationStatus.OFFER,
    },
}


def create_application(application: ApplicationCreate) -> dict:
    application_id = max(applications, default=0) + 1
    new_application = {
        "id": application_id,
        **application.model_dump(),
        "status": ApplicationStatus.APPLIED,
    }
    applications[application_id] = new_application
    return new_application


@router.get(
    "/all",
    response_model=list[ApplicationResponse],
    status_code=status.HTTP_200_OK,
)
def get_applications():
    return list(applications.values())


@router.post(
    "/post",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_application(application: ApplicationCreate):
    return create_application(application)


@router.post(
    "/bulk",
    response_model=list[ApplicationResponse],
    status_code=status.HTTP_201_CREATED,
)
def add_applications(new_applications: list[ApplicationCreate]):
    return [create_application(application) for application in new_applications]


@router.get("/get", response_model=ApplicationResponse)
def get_application(application_id: int = Query(gt=0)):
    application = applications.get(application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application
