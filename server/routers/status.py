from fastapi import APIRouter

router = APIRouter(prefix="/statuses", tags=["statuses"])


@router.get("")
def get_statuses():
    return [
        "APPLIED",
        "RECRUITER_CONTACT",
        "ASSESSMENT",
        "INTERVIEW",
        "FINAL_INTERVIEW",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
    ]
