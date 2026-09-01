from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.db.application_db_service import ApplicationDBService
from server.services.application_service import ApplicationService


DatabaseSessionDependency = Annotated[Session, Depends(get_db)]


def get_application_db_service(
    database_session: DatabaseSessionDependency,
) -> ApplicationDBService:
    return ApplicationDBService(database_session)


ApplicationDBServiceDependency = Annotated[
    ApplicationDBService,
    Depends(get_application_db_service),
]


def get_application_service(
    application_db_service: ApplicationDBServiceDependency,
) -> ApplicationService:
    return ApplicationService(application_db_service)
