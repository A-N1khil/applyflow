from datetime import datetime

from pydantic import BaseModel


class InterviewCreate(BaseModel):
    application_id: int
    interview_type: str
    scheduled_at: datetime
    notes: str
