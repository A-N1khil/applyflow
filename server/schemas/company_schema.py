from uuid import UUID

from pydantic import BaseModel


class Company(BaseModel):
    company_id: UUID
    name: str
    website: str | None = None
