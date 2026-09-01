from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.db.user_db_service import UserDBService
from server.services.user_service import UserService


DatabaseSessionDependency = Annotated[Session, Depends(get_db)]


def get_user_db_service(
    database_session: DatabaseSessionDependency,
) -> UserDBService:
    return UserDBService(database_session)


UserDBServiceDependency = Annotated[
    UserDBService,
    Depends(get_user_db_service),
]


def get_user_service(
    user_db_service: UserDBServiceDependency,
) -> UserService:
    return UserService(user_db_service)
