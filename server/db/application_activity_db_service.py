from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.db.base_db_service import BaseDBService
from server.models.application_activity_model import ApplicationActivityModel
from server.models.application_model import ApplicationModel


class ApplicationActivityDBService(BaseDBService[ApplicationActivityModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def application_exists(self, user_id: UUID, application_id: UUID) -> bool:
        statement = select(ApplicationModel.application_id).where(
            ApplicationModel.application_id == application_id,
            ApplicationModel.user_id == user_id,
        )
        return self.database_session.scalar(statement) is not None

    def get_next_activity_index(self) -> int:
        statement = select(
            func.coalesce(func.max(ApplicationActivityModel.activity_index), 0)
            + 1
        )
        return int(self.database_session.scalar(statement))

    def create_activity(
        self,
        activity: ApplicationActivityModel,
    ) -> ApplicationActivityModel:
        return self.add(activity)

    def update_activity(
        self,
        activity: ApplicationActivityModel,
    ) -> ApplicationActivityModel:
        return self.add(activity)

    def delete_activity(self, activity: ApplicationActivityModel) -> None:
        self.delete(activity)

    def get_activity_by_id(
        self,
        activity_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationActivityModel | None:
        statement = select(ApplicationActivityModel).where(
            ApplicationActivityModel.activity_id == activity_id,
            ApplicationActivityModel.user_id == user_id,
            ApplicationActivityModel.application_id == application_id,
        )
        return self.database_session.scalar(statement)

    def get_all_activities(
        self,
        user_id: UUID,
        application_id: UUID,
    ) -> list[ApplicationActivityModel]:
        statement = (
            select(ApplicationActivityModel)
            .where(
                ApplicationActivityModel.user_id == user_id,
                ApplicationActivityModel.application_id == application_id,
            )
            .order_by(ApplicationActivityModel.activity_index)
        )
        return list(self.database_session.scalars(statement).all())
