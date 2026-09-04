from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.db.application_note_db_service import ApplicationNoteDBService
from server.services.application_note_service import ApplicationNoteService


DatabaseSessionDependency = Annotated[Session, Depends(get_db)]


def get_application_note_db_service(
    database_session: DatabaseSessionDependency,
) -> ApplicationNoteDBService:
    return ApplicationNoteDBService(database_session)


ApplicationNoteDBServiceDependency = Annotated[
    ApplicationNoteDBService,
    Depends(get_application_note_db_service),
]


def get_application_note_service(
    note_db_service: ApplicationNoteDBServiceDependency,
) -> ApplicationNoteService:
    return ApplicationNoteService(note_db_service)
