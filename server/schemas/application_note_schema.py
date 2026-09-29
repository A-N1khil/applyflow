from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApplicationNote(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    note_id: UUID
    user_id: UUID
    application_id: UUID
    note_index: int
    note_data: str
    note_date: datetime


class ApplicationNoteCreate(BaseModel):
    user_id: UUID
    application_id: UUID
    note_data: str = Field(min_length=1)


class ApplicationNoteUpdate(BaseModel):
    note_id: UUID
    user_id: UUID
    application_id: UUID
    note_data: str = Field(min_length=1)
