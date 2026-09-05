from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.db.application_activity_db_service import (
    ApplicationActivityDBService,
)
from server.services.application_activity_service import (
    ApplicationActivityService,
)


DatabaseSessionDependency = Annotated[Session, Depends(get_db)]


def get_application_activity_db_service(
    database_session: DatabaseSessionDependency,
) -> ApplicationActivityDBService:
    return ApplicationActivityDBService(database_session)


ApplicationActivityDBServiceDependency = Annotated[
    ApplicationActivityDBService,
    Depends(get_application_activity_db_service),
]


def get_application_activity_service(
    activity_db_service: ApplicationActivityDBServiceDependency,
) -> ApplicationActivityService:
    return ApplicationActivityService(activity_db_service)
