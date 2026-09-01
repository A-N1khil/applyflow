from enum import StrEnum
from uuid import UUID
from datetime import datetime

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


class Application(BaseModel):
    app_id: UUID
    user_id: UUID
    company_id: UUID
    role: str
    url: str | None = None
    location: str = "Remote"
    status: ApplicationStatus = ApplicationStatus.APPLIED
    created_at: datetime | None = None


class ApplicationCreate(BaseModel):
    user_id: UUID
    company_id: UUID
    role: str
    url: str | None = None
    location: str = "Remote"
    status: ApplicationStatus = ApplicationStatus.APPLIED


class ApplicationUpdate(BaseModel):
    user_id: UUID
    company_id: UUID | None = None
    role: str | None = None
    location: str | None = None
    url: str | None = None
