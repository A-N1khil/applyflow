from typing import Generic, TypeVar

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from server.core.database import Base

# Generic type variable for database models that inherit from Base
DatabaseModel = TypeVar("DatabaseModel", bound=Base)


class BaseDBService(Generic[DatabaseModel]):
    """
    Base database service class for performing CRUD operations on database models.
    """

    def __init__(self, database_session: Session) -> None:
        self.database_session = database_session

    def add(self, database_model: DatabaseModel) -> DatabaseModel:
        try:
            self.database_session.add(database_model)
            self.database_session.commit()
            self.database_session.refresh(database_model)
        except SQLAlchemyError:
            self.database_session.rollback()
            raise
        return database_model

    def delete(self, database_model: DatabaseModel) -> None:
        try:
            self.database_session.delete(database_model)
            self.database_session.commit()
        except SQLAlchemyError:
            self.database_session.rollback()
            raise
