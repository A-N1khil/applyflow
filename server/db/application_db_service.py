from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.db.base_db_service import BaseDBService
from server.models.application_model import ApplicationModel


class ApplicationDBService(BaseDBService[ApplicationModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def create_application(
        self,
        user_id: UUID,
        application: ApplicationModel,
    ) -> ApplicationModel:
        application.user_id = user_id
        return self.add(application)

    def update_application(
        self,
        user_id: UUID,
        application: ApplicationModel,
    ) -> ApplicationModel:
        application.user_id = user_id
        return self.add(application)

    def delete_application(
        self,
        user_id: UUID,
        application: ApplicationModel,
    ) -> None:
        application.user_id = user_id
        self.delete(application)

    def get_application_by_id(
        self, user_id: UUID, application_id: UUID
    ) -> ApplicationModel | None:
        statement = select(ApplicationModel).where(
            ApplicationModel.application_id == application_id,
            ApplicationModel.user_id == user_id,
        )
        return self.database_session.scalar(statement)

    def get_all_applications(self, user_id: UUID) -> list[ApplicationModel]:
        statement = select(ApplicationModel).where(
            ApplicationModel.user_id == user_id
        ).order_by(ApplicationModel.application_index)
        return list(self.database_session.scalars(statement).all())

    def get_next_application_index(self, user_id: UUID) -> int:
        statement = select(
            func.coalesce(func.max(ApplicationModel.application_index), 0) + 1
        ).where(ApplicationModel.user_id == user_id)
        return int(self.database_session.scalar(statement))
