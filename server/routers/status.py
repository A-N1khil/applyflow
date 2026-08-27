from fastapi import APIRouter

from server.models.application import ApplicationStatus

router = APIRouter(prefix="/statuses", tags=["statuses"])


@router.get("/all")
def get_statuses():
    return [application_status.value for application_status in ApplicationStatus]
