from enum import StrEnum

from pydantic import BaseModel


class ApplicationStatus(StrEnum):
    APPLIED = "APPLIED"
    RECRUITER_CONTACT = "RECRUITER_CONTACT"
    ASSESSMENT = "ASSESSMENT"
    INTERVIEW = "INTERVIEW"
    FINAL_INTERVIEW = "FINAL_INTERVIEW"
    OFFER = "OFFER"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class ApplicationCreate(BaseModel):
    company: str
    role: str
    location: str | None = None


class ApplicationUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    location: str | None = None


class ApplicationResponse(BaseModel):
    id: int
    company: str
    role: str
    location: str | None
    status: ApplicationStatus
