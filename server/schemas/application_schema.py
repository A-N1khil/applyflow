from enum import StrEnum
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


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
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    company_id: UUID
    role: str
    url: str | None = None
    location: str | None = "Remote"
    status: ApplicationStatus = ApplicationStatus.APPLIED
    created_at: datetime


class ApplicationCreate(BaseModel):
    user_id: UUID
    company_id: UUID
    role: str = Field(min_length=1, max_length=255)
    url: str | None = None
    location: str = Field(default="Remote", min_length=1, max_length=255)
    status: ApplicationStatus = ApplicationStatus.APPLIED


class ApplicationUpdate(BaseModel):
    user_id: UUID
    company_id: UUID | None = None
    role: str | None = Field(default=None, min_length=1, max_length=255)
    location: str | None = Field(default=None, min_length=1, max_length=255)
    url: str | None = None
    status: ApplicationStatus | None = None
