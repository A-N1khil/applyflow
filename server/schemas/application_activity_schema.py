from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApplicationChangeType(StrEnum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"


class ApplicationActivity(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    activity_id: UUID
    activity_index: int
    activity_time: datetime
    user_id: UUID
    application_id: UUID
    change_type: ApplicationChangeType
    what_change: str | None = None
    old_value: str | None = None
    new_value: str | None = None


class ApplicationActivityCreate(BaseModel):
    user_id: UUID
    application_id: UUID
    change_type: ApplicationChangeType = ApplicationChangeType.UPDATE
    old_value: str | None = Field(default=None, max_length=255)
    new_value: str | None = Field(default=None, max_length=255)


class ApplicationActivityUpdate(BaseModel):
    activity_id: UUID
    user_id: UUID
    application_id: UUID
    change_type: ApplicationChangeType | None = None
    old_value: str | None = Field(default=None, max_length=255)
    new_value: str | None = Field(default=None, max_length=255)
