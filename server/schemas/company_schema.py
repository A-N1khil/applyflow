from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class Company(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_id: UUID
    name: str
    website: str | None = None


class CompanyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    website: str | None = None


class CompanyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    website: str | None = None
